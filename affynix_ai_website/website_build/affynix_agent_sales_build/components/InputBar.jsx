import React, { useState } from "react";
import { Send } from "lucide-react";

export default function InputBar({ onSendMessage, disabled = false }) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-2xl px-4 py-3 focus-within:border-cyan-500/50 transition-colors">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={disabled}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 outline-none text-sm md:text-base font-light disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={disabled || !inputValue.trim()}
                    className="p-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Send message"
                >
                    <Send className="w-4 h-4 text-cyan-400" />
                </button>
            </div>
        </form>
    );
}