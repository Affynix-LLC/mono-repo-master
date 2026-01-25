import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsPanel from "../components/SettingsPanel";
import Logo from "../components/Logo";
import HeaderBar from "../components/HeaderBar";
import { api } from "@/api/apiClient";

export default function Index() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [chatStarted, setChatStarted] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize conversation when Start button is clicked
    const handleStartChat = async () => {
        setChatStarted(true);
        try {
            const conv = await api.agents.createConversation({
                agent_name: "intakeAgent",
                metadata: {
                    name: "Intake Agent Session",
                    source: "affynix.ai /frontend",
                    prompt: {
                        id: "pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d",
                        version: "1"
                    }
                }
            });
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (!conv.messages) {
                conv.messages = [];
            }
            setConversation(conv);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            setIsLoading(true);
            await api.agents.addMessage(conv, {
                role: "user",
                content: "start"
            });
            setIsLoading(false);
        } catch (error) {
            console.error("Error in initConversation:", error);
            setIsLoading(false);
        }
    };

    // Subscribe to conversation updates with WebSocket streaming
    useEffect(() => {
        if (!conversation || !conversation.id) return;

        let streamingMessageId = null;
        let streamingText = '';

        try {
            const unsubscribe = api.agents.subscribeToConversation(conversation.id, (data) => {
                try {
                    // Handle streaming chunks
                    if (data.type === 'message_start') {
                        streamingMessageId = data.messageId;
                        streamingText = '';
                        setIsLoading(true);
                    } else if (data.type === 'message_chunk') {
                        if (data.messageId === streamingMessageId) {
                            streamingText += data.chunk;
                            // Update messages with streaming text
                            setMessages(prev => {
                                const filtered = prev.filter(m => m.id !== streamingMessageId);
                                return [...filtered, {
                                    id: streamingMessageId,
                                    sender: 'ai',
                                    text: streamingText,
                                    streaming: true
                                }];
                            });
                        }
                    } else if (data.type === 'message_complete') {
                        streamingMessageId = null;
                        streamingText = '';
                        setIsLoading(false);
                    } else if (data.type === 'error') {
                        console.error('Chat error:', data.error);
                        setIsLoading(false);
                    } else if (data.messages && Array.isArray(data.messages)) {
                        // Full conversation update
                        const formattedMessages = data.messages
                            .filter(msg => msg && msg.role)
                            .map(msg => ({
                                id: msg.id || `msg_${Date.now()}`,
                                sender: msg.role === 'user' ? 'user' : 'ai',
                                text: msg.content || ''
                            }));
                        setMessages(formattedMessages);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error("Error in subscription callback:", error);
                    setIsLoading(false);
                }
            });

            return () => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        } catch (error) {
            console.error("Error setting up subscription:", error);
        }
    }, [conversation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !conversation) return;

        const userInput = input;
        setInput("");
        setIsLoading(true);

        await api.agents.addMessage(conversation, {
            role: "user",
            content: userInput
        });

        setIsLoading(false);
    };

    const handleCloseChat = () => {
        setChatStarted(false);
    };

    const instructionCopy = [
        "Welcome to Affynix.",
        "Start your onboarding with Agent01.",
        "If you prefer to fill out a form instead, just ask and it will be provided.",
        "Click Start to begin."
    ];

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-sans relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
            <HeaderBar onOpenSettings={() => setShowSettings(true)} />

            <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24 relative">
                {!chatStarted && (
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="flex justify-center">
                            <Logo size="w-40 h-40" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs tracking-[0.6em] text-yellow-400 uppercase">
                                AI-Powered Intake Agent
                            </p>
                            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
                                {instructionCopy.map((line, index) => (
                                    <React.Fragment key={`${line}-${index}`}>
                                        {line}
                                        {index < instructionCopy.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                onClick={handleStartChat}
                                className="px-12 py-4 text-base sm:text-lg rounded-full shadow-[0_20px_70px_rgba(255,215,0,0.35)]"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(201,169,97,0.95))",
                                    color: "#0b0b0b",
                                }}
                            >
                                Start
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {showSettings && (
                    <SettingsPanel onClose={() => setShowSettings(false)} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {chatStarted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4"
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
                                <button
                                    onClick={handleCloseChat}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label="Close chat"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <AnimatePresence>
                                    {messages && messages.map((msg) => (
                                        <motion.div
                                            key={msg.id || `msg-${msg.sender}-${msg.text?.substring(0, 10)}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <div className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                                {msg.sender === 'ai' && <Bot className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />}
                                                <div className={`max-w-xl rounded-2xl p-4 backdrop-blur-lg border transition-all
                                                    ${msg.sender === 'user' 
                                                        ? 'bg-blue-600/20 border-blue-500/30' 
                                                        : 'bg-gray-900/70 border-gray-700/30'
                                                    }`}
                                                    style={{
                                                        boxShadow: msg.sender === 'ai' 
                                                            ? '0 8px 30px rgba(6, 182, 212, 0.15)' 
                                                            : '0 8px 30px rgba(59, 130, 246, 0.15)'
                                                    }}
                                                >
                                                    <p className="whitespace-pre-wrap text-gray-100">
                                                        {msg.text}
                                                        {msg.streaming && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />}
                                                    </p>
                                                </div>
                                                {msg.sender === 'user' && <User className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {isLoading && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Bot className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
                                        <div className="max-w-xl p-4 rounded-2xl bg-gray-900/80 border border-gray-700/40 backdrop-blur-lg">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 flex items-center gap-3">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-900/80 border-cyan-500/30 focus:border-cyan-300 text-white placeholder:text-gray-500 backdrop-blur-sm rounded-2xl transition-all"
                                    style={{
                                        boxShadow: input.length > 0 ? '0 0 25px rgba(6, 182, 212, 0.25)' : 'none'
                                    }}
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    variant="default"
                                    className="bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all rounded-2xl px-6"
                                    style={{
                                        boxShadow: '0 8px 25px rgba(6, 182, 212, 0.35)'
                                    }}
                                    disabled={isLoading}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
