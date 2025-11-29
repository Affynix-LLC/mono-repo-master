import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsPanel from "../components/SettingsPanel";
import HistoryPanel from "../components/HistoryPanel";
import Logo from "../components/Logo";
import HeaderBar from "../components/HeaderBar";
import { api } from "@/api/apiClient";

export default function Index() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
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
                agent_name: "agent_zero",
                metadata: {
                    name: "Agent Zero Session",
                    assistant_id: "asst_JgICRWsfkVO3ODT8cdSMOqAm"
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

    // Subscribe to conversation updates
    useEffect(() => {
        if (!conversation || !conversation.id) return;

        try {
            const unsubscribe = api.agents.subscribeToConversation(conversation.id, (data) => {
                try {
                    if (!data || !data.messages || !Array.isArray(data.messages)) {
                        return;
                    }
                    
                    const formattedMessages = data.messages
                        .filter(msg => msg && msg.role)
                        .map(msg => ({
                            sender: msg.role === 'user' ? 'user' : 'ai',
                            text: msg.content || ''
                        }));
                    setMessages(formattedMessages);
                } catch (error) {
                    console.error("Error in subscription callback:", error);
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

    const startNewChat = async () => {
        const conv = await api.agents.createConversation({
            agent_name: "agent_zero",
            metadata: {
                name: "Agent Zero Session",
                assistant_id: "asst_JgICRWsfkVO3ODT8cdSMOqAm"
            }
        });
        
        if (!conv.messages) {
            conv.messages = [];
        }
        setConversation(conv);
        setMessages([]);
        setShowHistory(false);
        setChatStarted(true);
    };

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

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-sans relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
            <HeaderBar onOpenSettings={() => setShowSettings(true)} />

            <main className="flex-1 overflow-y-auto pt-28 pb-8 px-4 sm:px-8 relative">
                {!chatStarted && (
                    <div className="max-w-6xl mx-auto text-center space-y-10">
                        <div className="flex flex-col items-center gap-6">
                            <Logo />
                            <div className="space-y-6">
                                <p className="text-sm uppercase tracking-[0.5em] text-cyan-300">Automation Infrastructure</p>
                                <h1 className="text-4xl sm:text-6xl font-light leading-tight text-white">
                                    Launch an Affynix AI operator to <span className="text-cyan-300">qualify, route,</span> and <span className="text-cyan-300">convert</span> leads.
                                </h1>
                                <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                                    The intake agent that interviews prospects, writes summaries, syncs to your CRM, and books meetings in realtime.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button 
                                    onClick={handleStartChat}
                                    className="px-10 py-5 text-lg bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all rounded-2xl shadow-[0_20px_80px_rgba(6,182,212,0.35)]"
                                >
                                    Launch Intake Agent
                                </Button>
                                <button
                                    onClick={() => setShowHistory(true)}
                                    className="px-10 py-5 text-lg border border-gray-800 rounded-2xl hover:border-gray-600 transition-all text-gray-200"
                                >
                                    View Transcripts
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                            {[
                                { label: "New Leads This Week", value: "312", detail: "+18% vs last week" },
                                { label: "Average Response Time", value: "4.2s", detail: "Realtime sync" },
                                { label: "CRM Integrations", value: "HubSpot • Salesforce • Close", detail: "Bi-directional" }
                            ].map((stat) => (
                                <div key={stat.label} className="p-6 rounded-3xl border border-gray-900 bg-black/60 backdrop-blur-sm">
                                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">{stat.label}</p>
                                    <p className="text-3xl font-light text-white">{stat.value}</p>
                                    <p className="text-sm text-gray-400 mt-2">{stat.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {chatStarted && (
                    <div className="relative max-w-4xl mx-auto" style={{ zIndex: 1 }}>
                        <AnimatePresence>
                            {messages && messages.map((msg, index) => (
                                <motion.div
                                    key={`msg-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                        {msg.sender === 'ai' && <Bot className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />}
                                        <div className={`max-w-xl rounded-xl p-4 backdrop-blur-sm border transition-all
                                            ${msg.sender === 'user' 
                                                ? 'bg-blue-600/20 border-blue-500/30' 
                                                : 'bg-gray-900/60 border-gray-700/30'
                                            }`}
                                            style={{
                                                boxShadow: msg.sender === 'ai' 
                                                    ? '0 4px 16px rgba(6, 182, 212, 0.1)' 
                                                    : '0 4px 16px rgba(59, 130, 246, 0.1)'
                                            }}
                                        >
                                            <p className="whitespace-pre-wrap text-gray-100">{msg.text}</p>
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
                                <div className="max-w-xl p-4 rounded-xl bg-gray-900/60 border border-gray-700/30 backdrop-blur-sm">
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
                )}
            </main>

            <footer className="p-4 border-t border-gray-900 bg-black/70 backdrop-blur-sm relative z-10">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-900/80 border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-500 backdrop-blur-sm rounded-xl transition-all"
                        style={{
                            boxShadow: input.length > 0 ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none'
                        }}
                        disabled={isLoading}
                    />
                    <Button 
                        type="submit" 
                        variant="default" 
                        className="bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all rounded-xl"
                        style={{
                            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)'
                        }}
                        disabled={isLoading}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </footer>

            <AnimatePresence>
                {showSettings && (
                    <SettingsPanel onClose={() => setShowSettings(false)} />
                )}
                {showHistory && (
                    <HistoryPanel
                        onNewChat={startNewChat}
                        onClose={() => setShowHistory(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}