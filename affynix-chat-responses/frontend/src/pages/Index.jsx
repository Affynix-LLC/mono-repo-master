import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { streamChat } from "../api/apiClient.js";

const START_LABELS = ["Start", "Begin", "Enter"];

export default function Index() {
  const [messages, setMessages] = useState([]); // {id, sender, text}
  const [sessionId, setSessionId] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [startLabel, setStartLabel] = useState(START_LABELS[0]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setStartLabel(START_LABELS[Math.floor(Math.random() * START_LABELS.length)]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const streamAssistant = async ({ sid, userMessage }) => {
    if (!sid) return;
    setIsLoading(true);

    const assistantId = `ai_${Date.now()}`;
    let liveText = "";

    setMessages(prev => [
      ...prev,
      { id: assistantId, sender: "ai", text: "", streaming: true }
    ]);

    await streamChat({
      sessionId: sid,
      message: userMessage,
      onDelta: (delta) => {
        liveText += delta;
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, text: liveText, streaming: true } : m))
        );
      },
      onDone: () => {
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, text: liveText, streaming: false } : m))
        );
        setIsLoading(false);
      },
      onError: (err) => {
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, text: "Error. Please retry.", streaming: false } : m))
        );
        setIsLoading(false);
        console.error(err);
      }
    });
  };

  const handleStartChat = async () => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setChatStarted(true);
    setMessages([]);
    await streamAssistant({ sid: newSessionId, userMessage: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatStarted || !sessionId) return;

    const userText = input.trim();
    setInput("");

    setMessages(prev => [...prev, { id: `u_${Date.now()}`, sender: "user", text: userText }]);

    await streamAssistant({ sid: sessionId, userMessage: userText });
  };

  const handleCloseChat = () => {
    setChatStarted(false);
    setSessionId("");
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24 relative">
        {!chatStarted && (
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-sm sm:text-base font-semibold tracking-[0.35em] text-yellow-300 uppercase">
              Agent01
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleStartChat}
                className="px-12 py-4 text-base sm:text-lg rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(201,169,97,0.95))",
                  color: "#0b0b0b"
                }}
              >
                {startLabel}
              </button>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {chatStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 py-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-black/90 border border-cyan-500/20 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Agent01</p>
                  <p className="text-sm text-gray-400">Onboarding & Scheduling Assistant</p>
                </div>
                <button onClick={handleCloseChat} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id || `msg-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}>
                        {msg.sender === "ai" && <Bot className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />}
                        <div
                          className={`max-w-xl rounded-2xl p-4 backdrop-blur-lg border transition-all
                            ${msg.sender === "user" ? "bg-blue-600/20 border-blue-500/30" : "bg-gray-900/70 border-gray-700/30"}`}
                        >
                          <p className="whitespace-pre-wrap text-gray-100">
                            {msg.text}
                            {msg.streaming && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />}
                          </p>
                        </div>
                        {msg.sender === "user" && <User className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 flex items-center gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-900/80 border border-cyan-500/30 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-2xl px-6 py-3"
                  disabled={isLoading}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
