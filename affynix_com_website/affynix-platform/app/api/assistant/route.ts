import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store thread IDs in memory (in production, use a database)
const threadStore = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, assistantId, threadId, message, instructions } = body;

    // Create a new thread
    if (action === 'create-thread') {
      const thread = await openai.beta.threads.create();
      threadStore.set(thread.id, thread.id);
      return Response.json({ threadId: thread.id });
    }

    // Add a message to the thread
    if (action === 'add-message') {
      if (!threadId || !message) {
        return Response.json(
          { error: 'threadId and message are required' },
          { status: 400 }
        );
      }

      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      return Response.json({ success: true });
    }

    // Run the assistant and stream the response
    if (action === 'run') {
      if (!threadId || !assistantId) {
        return Response.json(
          { error: 'threadId and assistantId are required' },
          { status: 400 }
        );
      }

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: instructions || undefined,
      });

      // Create a streaming response
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          // Poll for run completion
          let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

          while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
            await new Promise(resolve => setTimeout(resolve, 500));
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

            // Send status update
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'status', status: runStatus.status })}\n\n`)
            );
          }

          if (runStatus.status === 'completed') {
            // Get the messages
            const messages = await openai.beta.threads.messages.list(threadId, {
              limit: 1,
              order: 'desc',
            });

            const assistantMessage = messages.data[0];
            if (assistantMessage && assistantMessage.role === 'assistant') {
              const content = assistantMessage.content[0];
              if (content.type === 'text') {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'message', content: content.text.value })}\n\n`)
                );
              }
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            );
          } else if (runStatus.status === 'requires_action') {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Assistant requires action' })}\n\n`)
            );
          } else {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: `Run failed: ${runStatus.status}` })}\n\n`)
            );
          }

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Get messages from a thread
    if (action === 'get-messages') {
      if (!threadId) {
        return Response.json(
          { error: 'threadId is required' },
          { status: 400 }
        );
      }

      const messages = await openai.beta.threads.messages.list(threadId, {
        limit: 50,
        order: 'asc',
      });

      const formattedMessages = messages.data.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content[0]?.type === 'text' ? msg.content[0].text.value : '',
        createdAt: msg.created_at,
      }));

      return Response.json({ messages: formattedMessages });
    }

    return Response.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Assistant API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

