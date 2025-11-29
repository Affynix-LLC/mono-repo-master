import React from "react";

export default function MessageBubble({ sender, text, timestamp }) {
    const isAgent = sender === "agent";

    return (
        <div 
            className={`
                flex w-full mb-4 message-enter
                ${isAgent ? 'justify-start' : 'justify-end'}
            `}
        >
            <div 
                className={`
                    max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl
                    ${isAgent 
                        ? 'bg-gray-900 border border-gray-800 text-gray-200' 
                        : 'bg-cyan-600/20 border border-cyan-500/30 text-gray-100'
                    }
                `}
            >
                {/* Message Text */}
                <p className="text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap">
                    {text}
                </p>

                {/* Timestamp */}
                {timestamp && (
                    <div 
                        className={`
                            mt-2 text-xs font-extralight
                            ${isAgent ? 'text-gray-600' : 'text-cyan-300/50'}
                        `}
                    >
                        {new Date(timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}