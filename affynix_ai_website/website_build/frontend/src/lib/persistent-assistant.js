import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

export default class PersistentAssistant {
  constructor(assistantId, callbacks = {}) {
    this.assistantId = assistantId;
    this.threadId = null;
    this.callbacks = callbacks;
    this.running = false;
  }

  async ensureThread() {
    if (!this.threadId) {
      const thread = await openai.beta.threads.create();
      this.threadId = thread.id;
    }
  }

  async sendMessage(content) {
    if (!content || this.running) return;
    this.running = true;

    await this.ensureThread();

    await openai.beta.threads.messages.create(this.threadId, {
      role: "user",
      content
    });

    const stream = await openai.beta.threads.runs.stream(this.threadId, {
      assistant_id: this.assistantId
    });

    try {
      for await (const event of stream) {
        if (event.event === "thread.message.delta") {
          const chunk = event.data.delta?.content?.[0]?.text?.value;
          if (chunk && this.callbacks.onMessage) {
            this.callbacks.onMessage(chunk);
          }
        }

        if (event.event === "thread.run.completed") {
          this.running = false;
          if (this.callbacks.onStatus) {
            this.callbacks.onStatus("completed");
          }
        }
      }
    } catch (err) {
      this.running = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(err);
      }
    }
  }

  reset() {
    this.threadId = null;
    this.running = false;
  }
}
