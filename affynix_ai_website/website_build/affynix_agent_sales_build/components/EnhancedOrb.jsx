import React from "react";
import { motion } from "framer-motion";

export default function EnhancedOrb({ isThinking = false, isTyping = false }) {
    const orbGlow = {
        boxShadow: isTyping 
            ? '0 0 25px #0ff, 0 0 50px #0ff, 0 0 75px #0ff'
            : isThinking 
            ? '0 0 30px #0ff, 0 0 60px #0ff, 0 0 90px #0ff, 0 0 120px #0ff'
            : '0 0 20px #0ff, 0 0 40px #0ff, 0 0 60px #0ff',
    };

    return (
        <div className="flex flex-col items-center justify-center py-16">
            <style jsx>{`
                @keyframes breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes ripple {
                    0% { transform: scale(0.8); opacity: 0.6; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                @keyframes morph {
                    0%, 100% { border-radius: 50%; }
                    25% { border-radius: 48% 52% 50% 50%; }
                    50% { border-radius: 50% 50% 48% 52%; }
                    75% { border-radius: 52% 48% 52% 48%; }
                }
                .orb-breathe {
                    animation: breathe 5s ease-in-out infinite;
                }
                .orb-morph {
                    animation: morph 8s ease-in-out infinite;
                }
                .orb-ripple {
                    animation: ripple 3s ease-out infinite;
                }
            `}</style>

            <div className="orb-aura">
            <motion.div
                animate={isThinking ? {
                    scale: [1, 1.08, 1],
                    opacity: [1, 0.85, 1]
                } : {}}
                transition={{
                    duration: 2,
                    repeat: isThinking ? Infinity : 0,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                {/* Ripple layers */}
                <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full border border-cyan-400/10 orb-ripple"></div>
                <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full border border-cyan-400/10 orb-ripple" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full border border-cyan-400/10 orb-ripple" style={{ animationDelay: '2s' }}></div>

                {/* Main orb with breathing and morphing */}
                <div 
                    className={`w-32 h-32 md:w-40 md:h-40 border border-cyan-400/30 transition-all duration-500 orb orb-morph orb-aura relative overflow-hidden ${isTyping ? 'typing' : ''}`}
                    style={{
                        ...orbGlow,
                        background: 'radial-gradient(circle at center, rgba(0,180,255,0.65) 0%, rgba(0,120,255,0.55) 28%, rgba(0,60,120,0.35) 60%, rgba(0,50,80,0.15) 90%)'
                    }}
                >
                    {/* Hexagonal sacred geometry hint */}
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                        <path d="M50,10 L85,30 L85,70 L50,90 L15,70 L15,30 Z" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="0.5" 
                              className="text-cyan-400" />
                        <path d="M50,25 L75,37.5 L75,62.5 L50,75 L25,62.5 L25,37.5 Z" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="0.5" 
                              className="text-cyan-300" />
                    </svg>
                    
                    {/* Concentric layers with glassmorphism */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 backdrop-blur-sm"></div>
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-300/5 to-blue-400/5 backdrop-blur-sm"></div>
                    
                    {/* Core glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-cyan-400/50 blur-sm"></div>
                    </div>
                </div>

                {/* Typing indicator */}
                {isThinking && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
            </motion.div>
            </div>
        </div>
    );
}