import "dotenv/config";
import express from "express";
import cors from "cors";
import { createOpenAIClient } from "./openai.js";
import { airtable_upsert_contact } from "./crm.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const client = createOpenAIClient();
const PORT = process.env.PORT || 3001;
const APIX_DRIVE_WEBHOOK_URL = process.env.APIX_DRIVE_WEBHOOK_URL || "";
const SESSION_TIMEOUT_MS = Number.parseInt(process.env.SESSION_TIMEOUT_MS || "900000", 10);

const SYSTEM_PROMPT = `You are Agent01, the official Executive Secretary and Intake Assistant for Affynix.

You MUST begin every new conversation with the following greeting, exactly once:

"Hello, thank you for contacting Affynix.

To get started, may I have your full name, the best phone number to reach you, your email address, and the company you’re with?"

Rules:
- Greet once only.
- After greeting, speak only when the user speaks.
- Never repeat the greeting.
- Never explain system behavior.
- Never confirm backend actions in text.
- Ask only for missing intake fields.
- Default to scheduling once intake is complete.

Language:
- Default English.
- Switch to Spanish only if the user does.

Tone:
- Human, calm, professional.
- Short, clear sentences.

Tool Usage Rules:
- You may call functions when appropriate.
- Do NOT explain function calls.
- Do NOT confirm actions in text.
- After a successful tool call, either proceed to the next step or close politely.
- If required fields for a tool are missing, ask only for what is missing.`;

/**
 * In-memory session store.
 * Replace with Redis / DB in production.
 */
const sessions = new Map();
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

function createSessionState() {
  return {
    history: [{ role: "system", content: SYSTEM_PROMPT }],
    intakePersisted: false,
    finalPersisted: false,
    conversationBuffer: [],
    contact: {},
    closed: false,
    timeoutHandle: null
  };
}

function getSession(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing) {
    return existing;
  }
  const session = createSessionState();
  sessions.set(sessionId, session);
  return session;
}

function clearSessionTimeout(session) {
  if (session?.timeoutHandle) {
    clearTimeout(session.timeoutHandle);
    session.timeoutHandle = null;
  }
}

function scheduleSessionTimeout(sessionId, session) {
  if (!Number.isFinite(SESSION_TIMEOUT_MS) || SESSION_TIMEOUT_MS <= 0) {
    return;
  }
  clearSessionTimeout(session);
  session.timeoutHandle = setTimeout(() => {
    void finalizeSession(sessionId, "timeout");
  }, SESSION_TIMEOUT_MS);
}

function extractJsonPayload(text) {
  if (!text || typeof text !== "string") {
    return null;
  }
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    try {
      const parsed = JSON.parse(fencedMatch[1]);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    // fallthrough
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) {
    const slice = trimmed.slice(start, end + 1);
    try {
      const parsed = JSON.parse(slice);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

function pickContactFields(source) {
  if (!source || typeof source !== "object") {
    return {};
  }
  const fields = {};
  const keys = ["name", "email", "phone", "company", "notes"];
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null) {
      fields[key] = String(value).trim();
    }
  }
  return fields;
}

function extractContact(parsed, text) {
  let contact = {};
  if (parsed && typeof parsed === "object") {
    const base = pickContactFields(parsed);
    const nested = parsed.contact && typeof parsed.contact === "object"
      ? pickContactFields(parsed.contact)
      : {};
    contact = { ...base, ...nested };
    const answers = parsed.answers ?? parsed.contact?.answers;
    if (answers && typeof answers === "object" && !Array.isArray(answers)) {
      contact.answers = answers;
    }
  }

  if (!contact.email && typeof text === "string") {
    const match = text.match(EMAIL_REGEX);
    if (match?.[0]) {
      contact.email = match[0];
    }
  }

  return Object.keys(contact).length ? contact : null;
}

function parseAgentOutput(text) {
  const parsed = extractJsonPayload(text);
  const contactReadyFromText = typeof text === "string"
    ? /contact_ready\s*[:=]\s*true/i.test(text)
    : false;
  const conversationFinishedFromText = typeof text === "string"
    ? /conversation_finished\s*[:=]\s*true/i.test(text)
    : false;

  let contactReady = contactReadyFromText;
  let conversationFinished = conversationFinishedFromText;
  if (parsed) {
    if (parsed.contact_ready === true || parsed.contactReady === true) {
      contactReady = true;
    }
    if (parsed.conversation_finished === true || parsed.conversationFinished === true) {
      conversationFinished = true;
    }
  }

  const contact = extractContact(parsed, text);
  return { contactReady, conversationFinished, contact };
}

function mergeContact(session, contact) {
  if (!contact || typeof contact !== "object") {
    return;
  }
  const updated = { ...session.contact };
  for (const [key, value] of Object.entries(contact)) {
    if (value !== undefined && value !== null && String(value).trim().length) {
      updated[key] = value;
    }
  }
  session.contact = updated;
}

function buildInitialPayload(contact, userMessage) {
  const payload = {
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    notes: contact?.notes || "",
    conversation_append: typeof userMessage === "string" ? userMessage : "",
    lead_source: "affynix.ai",
    status: "New – Intake",
    timestamp_utc: new Date().toISOString()
  };
  if (contact?.answers && typeof contact.answers === "object" && !Array.isArray(contact.answers)) {
    payload.answers = contact.answers;
  }
  return payload;
}

function buildFinalPayload(session) {
  return {
    name: "",
    email: session?.contact?.email || "",
    phone: "",
    company: "",
    notes: "",
    lead_source: "",
    status: "",
    conversation_append: Array.isArray(session?.conversationBuffer)
      ? session.conversationBuffer.join("\n")
      : "",
    timestamp_utc: new Date().toISOString()
  };
}

function impliesSchedulingOrDecline(message) {
  if (!message || typeof message !== "string") {
    return false;
  }
  const text = message.toLowerCase();
  const scheduling = /(schedule|scheduling|book|booking|appointment|calendar|call|meet|meeting|time slot|availability|available)/;
  const decline = /(not interested|no thanks|no thank you|stop|unsubscribe|do not contact|don't contact|decline|cancel)/;
  return scheduling.test(text) || decline.test(text);
}

async function finalizeSession(sessionId, reason) {
  const session = sessions.get(sessionId);
  if (!session || session.finalPersisted || !session.intakePersisted) {
    return;
  }
  session.finalPersisted = true;
  session.closed = true;
  clearSessionTimeout(session);

  try {
    const payload = buildFinalPayload(session);
    await airtable_upsert_contact(payload);
  } catch (err) {
    console.error(`[Airtable] Final upsert failed (${reason})`, err);
  }

  sessions.set(sessionId, session);
}

async function postToApixDrive(payload) {
  if (!APIX_DRIVE_WEBHOOK_URL) {
    return;
  }
  try {
    await fetch(APIX_DRIVE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("[ApiX-Drive] Webhook failed", err);
  }
}

/**
 * POST /api/chat
 * Body: { sessionId: string, message?: string }
 * Streams assistant text via SSE.
 */
app.post("/api/chat", async (req, res) => {
  const { sessionId, message } = req.body || {};

  if (!sessionId) {
    res.status(400).json({ error: "sessionId required" });
    return;
  }

  const session = getSession(sessionId);
  clearSessionTimeout(session);
  const userMessage = typeof message === "string" ? message : "";
  const trimmedMessage = userMessage.trim();

  if (session.finalPersisted) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    res.write(`event: done\n`);
    res.write(`data: ${JSON.stringify({ ok: true, assistant: "" })}\n\n`);
    res.end();
    return;
  }

  if (session.intakePersisted && !session.finalPersisted && trimmedMessage.length) {
    session.conversationBuffer.push(userMessage);
  }

  const workingMessages = trimmedMessage.length
    ? [...session.history, { role: "user", content: trimmedMessage }]
    : [...session.history];

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const writeEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  let completed = false;
  res.on("close", () => {
    if (!completed) {
      void finalizeSession(sessionId, "disconnect");
    }
  });

  try {
    const stream = await client.responses.stream({
      model: "gpt-4.1-mini",
      input: workingMessages.map(m => (m.name ? { role: m.role, name: m.name, content: m.content } : { role: m.role, content: m.content })),
      tool_choice: "none",
      temperature: 0
    });

    let accumulatedText = "";

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        accumulatedText += event.delta;
        writeEvent("delta", { delta: event.delta });
      }
    }

    if (accumulatedText.trim().length) {
      session.history = [...workingMessages, { role: "assistant", content: accumulatedText }];
    } else {
      session.history = [...workingMessages];
    }

    const { contactReady, conversationFinished, contact } = parseAgentOutput(accumulatedText);
    if (contact) {
      mergeContact(session, contact);
    }

    if (contactReady && !session.intakePersisted) {
      session.intakePersisted = true;
      const payload = buildInitialPayload(session.contact, userMessage);
      let intakeSucceeded = false;
      try {
        const result = await airtable_upsert_contact(payload);
        intakeSucceeded = !!result?.success;
      } catch (err) {
        console.error("[Airtable] Initial upsert failed", err);
      }
      if (intakeSucceeded) {
        await postToApixDrive(payload);
      }
    }

    const intentFinal = impliesSchedulingOrDecline(userMessage);
    if ((conversationFinished || intentFinal) && session.intakePersisted && !session.finalPersisted) {
      await finalizeSession(sessionId, "signal");
    }

    sessions.set(sessionId, session);
    if (!session.finalPersisted) {
      scheduleSessionTimeout(sessionId, session);
    } else {
      clearSessionTimeout(session);
    }

    writeEvent("done", { ok: true, assistant: accumulatedText });
    completed = true;
    res.end();
  } catch (err) {
    writeEvent("error", { message: err?.message || "Server error" });
    completed = true;
    res.end();
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
