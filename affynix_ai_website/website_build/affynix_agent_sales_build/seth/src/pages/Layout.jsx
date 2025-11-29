
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";

export default function Layout({ children }) {
    return (
        <>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div className="min-h-screen bg-black text-gray-200">
            <style jsx global>{`
                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(0, 255, 255, 0.4),
                                    0 0 40px rgba(0, 255, 255, 0.2),
                                    0 0 60px rgba(0, 255, 255, 0.1);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(0, 255, 255, 0.6),
                                    0 0 60px rgba(0, 255, 255, 0.3),
                                    0 0 90px rgba(0, 255, 255, 0.15);
                    }
                }
                
                @keyframes breathe {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                @keyframes heroFade {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes orbBreathe {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.04); }
                    100% { transform: scale(1); }
                }

                @keyframes orbMorph {
                    0%   { border-radius: 50%; }
                    25%  { border-radius: 48% 52% 50% 50%; }
                    50%  { border-radius: 50% 46% 54% 50%; }
                    75%  { border-radius: 52% 50% 49% 51%; }
                    100% { border-radius: 50%; }
                }

                @keyframes affynixIntro {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes morph-organic {
                    0%, 100% {
                        border-radius: 50%;
                    }
                    25% {
                        border-radius: 45% 55% 50% 50%;
                    }
                    50% {
                        border-radius: 50% 50% 45% 55%;
                    }
                    75% {
                        border-radius: 55% 45% 55% 45%;
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .orb-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                }

                .message-enter {
                    animation: fade-in-up 0.3s ease-out;
                }

                body {
                    background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }

                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #0a0a0a;
                }

                ::-webkit-scrollbar-thumb {
                    background: #1a1a1a;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #2a2a2a;
                }

                .affynix-header {
                    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    color: #d8b86a;
                    text-shadow:
                        0 0 4px rgba(216,184,106,0.35),
                        0 0 8px rgba(216,184,106,0.2),
                        0 0 18px rgba(216,184,106,0.15);
                    transition: all 0.4s ease;
                }

                .affynix-header:hover {
                    text-shadow:
                        0 0 8px rgba(216,184,106,0.55),
                        0 0 18px rgba(216,184,106,0.4),
                        0 0 26px rgba(216,184,106,0.25);
                    transform: scale(1.015);
                }

                .agent-zero-title {
                    position: relative;
                    text-align: center;
                    margin-bottom: 22px;
                    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 2rem;
                    font-weight: 600;
                    letter-spacing: 0.10em;
                    color: #d8b86a;
                    text-shadow:
                        0 0 6px rgba(216,184,106,0.4),
                        0 0 12px rgba(216,184,106,0.25);
                }

                .hero-line {
                    margin-top: 26px;
                    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    text-align: center;
                    font-size: 1.15rem;
                    letter-spacing: 0.06em;
                    color: rgba(255,255,255,0.65);
                    opacity: 0;
                    animation: heroFade 1.4s ease forwards 1.2s;
                }

                .remove-status-text {
                    display: none !important;
                }

                .orb {
                    animation: orbBreathe 6s ease-in-out infinite;
                }

                .orb.typing {
                    box-shadow:
                        0 0 22px rgba(0,255,255,0.45),
                        0 0 42px rgba(0,255,255,0.35),
                        0 0 80px rgba(0,255,255,0.2);
                    transition: box-shadow 0.25s ease;
                }

                .affynix-grid {
                    background-image:
                        radial-gradient(circle at center,
                            rgba(0,255,255,0.05) 0%,
                            rgba(0,255,255,0.02) 25%,
                            transparent 70%
                        ),
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 100% 100%, 80px 80px, 80px 80px;
                }

                .orb-morph {
                    animation: orbMorph 11s ease-in-out infinite;
                }

                .orb-aura {
                    filter: drop-shadow(0 0 16px rgba(0,255,255,0.4))
                            drop-shadow(0 0 36px rgba(0,255,255,0.3))
                            drop-shadow(0 0 64px rgba(0,255,255,0.25));
                }

                .affynix-fade {
                    opacity: 0;
                    transform: translateY(10px);
                    animation: affynixIntro 1.2s ease forwards;
                }

                .b44-app, .app, body, #root, .b44-theme-dark {
                    background: transparent !important;
                }

                .b44-chat-container * {
                    filter: none !important;
                    backdrop-filter: none !important;
                }

                .affynix-main-wrapper {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    min-height: 100vh !important;
                }
                `}</style>
                
            <header className="flex justify-between items-center p-4 border-b border-cyan-500/20 backdrop-blur-sm bg-black/50 relative z-10">
                <Link to={createPageUrl("Index")} className="flex items-center gap-3 no-underline">
                    <h1 className="text-2xl font-bold tracking-widest affynix-header cursor-pointer">
                        AFFYNIX
                    </h1>
                </Link>
                <Link to={createPageUrl("Checkout")}>
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-lg text-white font-medium transition-all">
                        Checkout
                    </button>
                </Link>
            </header>

            {children}
        </div>
        </>
    );
}
