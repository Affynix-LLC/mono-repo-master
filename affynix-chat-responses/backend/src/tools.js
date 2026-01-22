import * as crm from "./crm.js";

export const tools = [
  {
    type: "function",
    name: "create_contact",
    description: "Create a new contact in the CRM",
    parameters: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        company: { type: "string" },
        notes: { type: "string" }
      }
    }
  },
  {
    type: "function",
    name: "add_notes_to_contact",
    description: "Attach notes to an existing contact",
    parameters: {
      type: "object",
      required: ["contact_id", "notes"],
      properties: {
        contact_id: { type: "string" },
        notes: { type: "string" }
      }
    }
  },
  {
    type: "function",
    name: "schedule_appointment",
    description: "Schedule an onboarding or follow-up call",
    parameters: {
      type: "object",
      required: ["name", "time"],
      properties: {
        name: { type: "string" },
        time: { type: "string" },
        details: { type: "string" }
      }
    }
  },
  {
    type: "function",
    name: "update_appointment",
    description: "Cancel or reschedule an appointment",
    parameters: {
      type: "object",
      required: ["appointment_id", "action"],
      properties: {
        appointment_id: { type: "string" },
        action: { type: "string", enum: ["cancel", "reschedule"] },
        new_time: { type: "string" }
      }
    }
  },
  {
    type: "function",
    name: "sendIntakeToApix",
    description: "Send completed intake data to ApiX for Airtable sync",
    parameters: {
      type: "object",
      required: ["name", "email", "phone", "company"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        company: { type: "string" },
        answers: { type: "object" }
      }
    }
  }
];

export async function executeToolCall({ name, arguments: args }) {
  if (typeof crm[name] === "function") {
    return crm[name](args || {});
  }
  return { error: `Unknown tool: ${name}` };
}
