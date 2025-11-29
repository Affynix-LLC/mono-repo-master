import React from "react";
import { Settings } from "lucide-react";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";

export default function HeaderBar({ onOpenSettings }) {
    const location = useLocation();
    const isContact = location.pathname === "/contact";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-900">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                        <Logo size="w-10 h-10" />
                    </div>
                    <h1 className="text-base sm:text-lg font-light tracking-[0.4em] text-white">
                        AFFYNIX
                    </h1>
                </div>

                {/* Right: Navigation + Settings */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/contact"
                        className={`px-4 py-2 rounded-full border transition ${
                            isContact
                                ? "border-yellow-400 text-yellow-300"
                                : "border-white/10 text-white hover:border-yellow-400/60 hover:text-yellow-200"
                        }`}
                    >
                        Contact
                    </Link>
                    <button 
                        className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
                        aria-label="Settings"
                        onClick={onOpenSettings}
                    >
                        <Settings className="w-5 h-5 text-gray-300" />
                    </button>
                </div>
            </div>
        </header>
    );
}