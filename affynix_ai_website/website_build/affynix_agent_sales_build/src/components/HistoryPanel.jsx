import React from "react";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HistoryPanel({ onClose, onNewChat }) {
    // Mock chat history
    const mockHistory = [
        { id: 1, title: "Lead inquiry about pricing...", date: "2 hours ago" },
        { id: 2, title: "Product demo request...", date: "Yesterday" },
        { id: 3, title: "Partnership discussion...", date: "2 days ago" },
    ];

    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-cyan-500/30 z-50 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-cyan-300">Chat History</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-cyan-400">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <Button 
                onClick={onNewChat}
                className="w-full mb-4 bg-cyan-600 hover:bg-cyan-500"
            >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
            </Button>

            <div className="space-y-2">
                {mockHistory.map((chat) => (
                    <div
                        key={chat.id}
                        className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                        <p className="text-sm text-gray-200 truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{chat.date}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}