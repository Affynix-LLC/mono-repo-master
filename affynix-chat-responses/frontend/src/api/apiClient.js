export async function streamChat({ sessionId, message, onDelta, onDone, onError }) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE: events separated by blank line.
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const lines = part.split("\n");
        const eventLine = lines.find(l => l.startsWith("event:"));
        const dataLine = lines.find(l => l.startsWith("data:"));

        if (!eventLine || !dataLine) continue;

        const event = eventLine.replace("event:", "").trim();
        const dataStr = dataLine.replace("data:", "").trim();

        let data = null;
        try { data = JSON.parse(dataStr); } catch { data = { raw: dataStr }; }

        if (event === "delta") onDelta?.(data.delta || "");
        if (event === "done") onDone?.(data);
        if (event === "error") onError?.(new Error(data.message || "Unknown error"));
      }
    }
  } catch (err) {
    onError?.(err);
  }
}
