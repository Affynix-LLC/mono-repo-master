const AGENT_WEBHOOK_URL = process.env.ZAPIER_AGENT_WEBHOOK_URL;

const formatTranscript = (messages) => {
  if (!messages || messages.length === 0) return '';
  return messages
    .map((msg) => {
      const role = msg.role ? msg.role.toUpperCase() : 'UNKNOWN';
      return `${role}: ${msg.content}`;
    })
    .join('\n\n');
};

const trimMessage = (message) => {
  if (!message) return null;
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.created_at || message.timestamp || new Date().toISOString()
  };
};

export const sendAgentConversationUpdate = async ({ conversation, messages, latestMessage }) => {
  if (!AGENT_WEBHOOK_URL || !conversation || !messages) {
    return;
  }

  const formattedMessages = messages.map(trimMessage);
  const payload = {
    conversation_id: conversation.id,
    agent_name: conversation.agent_name,
    metadata: conversation.metadata || {},
    message_count: formattedMessages.length,
    latest_message: {
      ...trimMessage(latestMessage),
      submitted_at: new Date().toISOString()
    },
    user_inputs: formattedMessages.filter((msg) => msg.role === 'user'),
    conversation: formatTranscript(formattedMessages),
    messages: formattedMessages
  };

  try {
    const response = await fetch(AGENT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Zapier] Webhook responded with error:', response.status, errorText);
    }
  } catch (error) {
    console.error('[Zapier] Failed to send conversation:', error);
  }
};
