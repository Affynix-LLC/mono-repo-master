import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Sparkles, MessageSquare, CheckCircle2, Clock, Shield, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MessageBubble from "../agents/MessageBubble.jsx";

export default function ChatIntakeAgent() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const chatStarted = conversationId !== null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const startChat = async (pathType) => {
    setInitializing(true);
    setShowOptions(false);
    try {
      const conversation = await base44.agents.createConversation({
        agent_name: "intakeAgent",
        metadata: {
          name: "Intake Conversation",
          source: "Homepage Chat",
          pathType: pathType
        }
      });
      
      setConversationId(conversation.id);
      
      // Send initial message based on path type
      let initialMessage = "";
      if (pathType === "quick-call") {
        initialMessage = "I'd like a quick form and a scheduled call.";
      } else if (pathType === "in-depth") {
        initialMessage = "I want an in-depth form for quicker onboarding.";
      } else if (pathType === "info-only") {
        initialMessage = "Just send me information about Affynix.";
      }
      
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: initialMessage
      });
      
      setLoading(true);
    } catch (error) {
      console.error("Failed to start chat:", error);
      alert("Failed to start conversation. Please try again.");
    } finally {
      setInitializing(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !conversationId) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    try {
      const conversation = { id: conversationId };
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: userMessage
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 relative overflow-hidden bg-[#0E0E0E]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-4 py-2 text-sm">
            START HERE
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Speak with <span className="text-[#D4AF37]">Agent Zero</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your AI assistant to guide you through onboarding and connect you with the right solution.
          </p>
        </motion.div>

        {!chatStarted && !showOptions ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center"
                >
                  <MessageSquare className="w-10 h-10 text-black" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Start Your Journey with Agent Zero
                </h3>
                <p className="text-gray-300 mb-8">
                  Choose how you'd like to proceed, and Agent Zero will guide you through the process.
                </p>
                <Button
                  onClick={() => setShowOptions(true)}
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-10 py-6 text-lg font-semibold"
                >
                  Start Chat
                  <MessageSquare className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        {showOptions && !chatStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card 
              className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all cursor-pointer group"
              onClick={() => startChat("quick-call")}
            >
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-bold text-white mb-2">Quick Form + Call</h4>
                <p className="text-sm text-gray-400">
                  Fill out a brief form and schedule a consultation call with our team.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all cursor-pointer group"
              onClick={() => startChat("in-depth")}
            >
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-bold text-white mb-2">In-Depth Form</h4>
                <p className="text-sm text-gray-400">
                  Complete a detailed questionnaire for faster onboarding with potential no-call setup.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all cursor-pointer group"
              onClick={() => startChat("info-only")}
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-bold text-white mb-2">Just Send Info</h4>
                <p className="text-sm text-gray-400">
                  Provide minimal details and we'll send you information about Affynix.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        {chatStarted ? (
          <div className="max-w-5xl mx-auto">
            <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
              <CardContent className="p-0">
                {chatStarted && (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[#D4AF37]/20 bg-black/40">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center"
                        >
                          <Sparkles className="w-5 h-5 text-black" />
                        </motion.div>
                        <div>
                          <div className="text-white font-semibold">Agent Zero</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-green-400"
                            />
                            Online & Ready
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-black/20">
                      <AnimatePresence>
                        {messages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <MessageBubble message={msg} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {loading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          </div>
                          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-1">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-[#D4AF37]/20 bg-black/40">
                      <div className="flex gap-2">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your message..."
                          disabled={loading}
                          className="flex-1 bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#D4AF37]"
                        />
                        <Button
                          type="submit"
                          disabled={loading || !input.trim()}
                          className="bg-[#D4AF37] hover:bg-[#E6C878] text-black"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Powered by Affynix AI • Your data is secure
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </section>
  );
}