import { WebSocketServer } from 'ws';
import { dbHelpers } from './db.js';
import { invokeLLM } from './llm.js';

// Store active WebSocket connections by conversation ID
const connections = new Map();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws, req) => {
    console.log('[WebSocket] New connection');

    // Extract conversation ID from URL query or path
    const url = new URL(req.url, `http://${req.headers.host}`);
    const conversationId = url.searchParams.get('conversation_id') || 
                          url.pathname.split('/').pop();

    if (!conversationId) {
      ws.close(1008, 'conversation_id required');
      return;
    }

    // Store connection
    if (!connections.has(conversationId)) {
      connections.set(conversationId, new Set());
    }
    connections.get(conversationId).add(ws);

    console.log(`[WebSocket] Client connected to conversation: ${conversationId}`);

    // Send initial conversation state
    const conversation = dbHelpers.getConversation(conversationId);
    if (conversation) {
      const messages = dbHelpers.getMessagesByConversation(conversationId);
      ws.send(JSON.stringify({
        type: 'conversation_state',
        conversation: {
          ...conversation,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            id: msg.id,
            timestamp: msg.created_at
          }))
        }
      }));
    }

    // Handle incoming messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        if (message.type === 'user_message') {
          const { content, role = 'user', messageId: providedMessageId } = message;
          
          let messageId = providedMessageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          let existingMessage = null;

          if (providedMessageId) {
            existingMessage = dbHelpers.getMessageById(providedMessageId);
          }

          if (!existingMessage) {
            dbHelpers.createMessage({
              id: messageId,
              conversation_id: conversationId,
              role,
              content
            });
          }

          const timestamp = existingMessage?.created_at || new Date().toISOString();

          // Broadcast user message to all connections for this conversation
          broadcastToConversation(conversationId, {
            type: 'message',
            message: {
              id: messageId,
              role,
              content,
              timestamp
            }
          });

          // Get agent name from conversation metadata
          const conv = dbHelpers.getConversation(conversationId);
          const agentName = conv?.agent_name || 'agent_zero';
          const systemPrompt = conv?.metadata?.system_prompt || 
                              'You are a helpful AI assistant for Affynix.';

          // Stream LLM response
          try {
            const stream = await invokeLLM(content, {
              conversationId,
              systemPrompt,
              stream: true,
              dbHelpers
            });

            let fullResponse = '';
            const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Send initial message
            broadcastToConversation(conversationId, {
              type: 'message_start',
              messageId: assistantMessageId
            });

            // Stream chunks
            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content || '';
              if (delta) {
                fullResponse += delta;
                broadcastToConversation(conversationId, {
                  type: 'message_chunk',
                  messageId: assistantMessageId,
                  chunk: delta
                });
              }
            }

            // Save complete assistant message
            dbHelpers.createMessage({
              id: assistantMessageId,
              conversation_id: conversationId,
              role: 'assistant',
              content: fullResponse
            });

            // Send completion
            broadcastToConversation(conversationId, {
              type: 'message_complete',
              messageId: assistantMessageId,
              content: fullResponse
            });

          } catch (error) {
            console.error('[WebSocket] LLM error:', error);
            broadcastToConversation(conversationId, {
              type: 'error',
              error: error.message
            });
          }
        }
      } catch (error) {
        console.error('[WebSocket] Message handling error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          error: error.message
        }));
      }
    });

    ws.on('close', () => {
      console.log(`[WebSocket] Client disconnected from conversation: ${conversationId}`);
      if (connections.has(conversationId)) {
        connections.get(conversationId).delete(ws);
        if (connections.get(conversationId).size === 0) {
          connections.delete(conversationId);
        }
      }
    });

    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });
  });

  console.log('[WebSocket] Server started on /ws');
  return wss;
};

// Broadcast message to all connections for a conversation
const broadcastToConversation = (conversationId, data) => {
  const conns = connections.get(conversationId);
  if (!conns) return;

  const message = JSON.stringify(data);
  conns.forEach(ws => {
    // Use numeric constant 1 for WebSocket OPEN state
    if (ws.readyState === 1) {
      ws.send(message);
    }
  });
};
