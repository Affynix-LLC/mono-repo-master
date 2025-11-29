import React from "react";
import { Settings } from "lucide-react";

export default function HeaderBar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-900">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: Brand */}
                <div className="flex items-center">
                    <h1 className="text-xl font-extralight tracking-[0.3em] text-cyan-400">
                        AFFYNIX
                    </h1>
                </div>

                {/* Center: Mode Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-sm font-light text-gray-400">Chat</span>
                </div>

                {/* Right: Settings Icon */}
                <div className="flex items-center">
                    <button 
                        className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
                        aria-label="Settings"
                    >
                        <Settings className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>
        </header>
    );
}