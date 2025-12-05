import { useState, useEffect, useRef } from 'react';
import { OpenAIAssistant } from '../lib/openai-assistant';

export default function OpenAIAssistantChat({ 
  assistantId, 
  title = 'AI Assistant',
  placeholder = 'Type your message...',
  welcomeMessage = 'Hello! How can I help you today?',
  className = ''
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [assistant, setAssistant] = useState(null);
  const messagesEndRef = useRef(null);
  const streamingMessageRef = useRef('');

  useEffect(() => {
    if (!assistantId) {
      console.error('assistantId is required');
      return;
    }

    const assistantInstance = new OpenAIAssistant(assistantId, {
      onMessage: (content) => {
        // Handle streaming message chunks
        streamingMessageRef.current += content;
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== 'streaming');
          return [...filtered, {
            id: 'streaming',
            role: 'assistant',
            content: streamingMessageRef.current,
            streaming: true
          }];
        });
      },
      onStatus: (status) => {
        setStatus(status);
        if (status === 'completed') {
          // Finalize the streaming message
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== 'streaming');
            const streamingMsg = prev.find(m => m.id === 'streaming');
            if (streamingMsg) {
              return [...filtered, {
                id: `msg_${Date.now()}`,
                role: 'assistant',
                content: streamingMessageRef.current,
                streaming: false
              }];
            }
            return filtered;
          });
          streamingMessageRef.current = '';
          setIsLoading(false);
        } else if (status === 'in_progress') {
          setIsLoading(true);
        }
      },
      onError: (error) => {
        console.error('Assistant error:', error);
        setIsLoading(false);
        setMessages(prev => [...prev, {
          id: `error_${Date.now()}`,
          role: 'system',
          content: `Error: ${error.message}`,
          error: true
        }]);
      }
    });

    setAssistant(assistantInstance);

    // Initialize with welcome message if provided
    if (welcomeMessage) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage
      }]);
    }
  }, [assistantId, welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !assistant) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessage
    }]);

    try {
      await assistant.sendMessage(userMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (assistant) {
      assistant.reset();
      setMessages(welcomeMessage ? [{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage
      }] : []);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-50 ${className}`}
        aria-label="Open assistant"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          {status !== 'idle' && status !== 'completed' && (
            <p className="text-xs text-gray-400">{status}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Reset conversation"
            title="Reset conversation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close assistant"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-cyan-600 text-white'
                  : message.error
                  ? 'bg-red-900/50 text-red-200'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
                {message.streaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        ))}
        {isLoading && status !== 'completed' && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

