import React from "react";

export default function LoadingIndicator() {
    return (
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-2xl w-fit">
            <div className="flex gap-1">
                <div 
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" 
                    style={{ animationDelay: '0ms', animationDuration: '1s' }}
                ></div>
                <div 
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" 
                    style={{ animationDelay: '150ms', animationDuration: '1s' }}
                ></div>
                <div 
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" 
                    style={{ animationDelay: '300ms', animationDuration: '1s' }}
                ></div>
            </div>
            <span className="text-xs text-gray-500 font-light">Agent is typing</span>
        </div>
    );
}