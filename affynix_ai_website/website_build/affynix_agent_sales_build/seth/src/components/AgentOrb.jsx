import React from "react";

export default function AgentOrb({ isThinking = false }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
            {/* Orb Container */}
            <div className="relative">
                {/* Main Orb */}
                <div 
                    className={`
                        w-32 h-32 md:w-40 md:h-40 rounded-full 
                        bg-gradient-to-br from-cyan-500/20 to-blue-600/20 
                        border border-cyan-400/30
                        ${isThinking ? 'orb-glow' : 'opacity-80'}
                        transition-opacity duration-500
                    `}
                >
                    {/* Inner Core */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-400/20"></div>
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-300/5 to-blue-400/5"></div>
                </div>

                {/* Thinking Indicator */}
                {isThinking && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Text */}
            <div className="mt-8 text-center">
                <h2 className="text-lg md:text-xl font-light text-gray-300 mb-2">
                    Affynix Intake Engine — <span className="text-cyan-400">Online</span>
                </h2>
                <p className="text-sm text-gray-500 font-extralight">
                    {isThinking ? 'Processing...' : 'Ready to begin.'}
                </p>
            </div>
        </div>
    );
}