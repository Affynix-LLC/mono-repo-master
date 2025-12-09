import React from "react";
import Logo from "./Logo";

export default function HeaderBar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-900">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
                <a
                    href="/"
                    className="flex items-center gap-3 group cursor-pointer text-white no-underline"
                >
                    <div className="w-12 h-12 sm:w-14 sm:h-14">
                        <Logo size="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <h1 className="text-base sm:text-lg font-light tracking-[0.4em] text-white transition-colors group-hover:text-yellow-300">
                            AFFYNIX
                        </h1>
                        <span
                            className="h-[2px] w-full bg-gradient-to-r from-yellow-400 to-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                            aria-hidden="true"
                        />
                    </div>
                </a>
            </div>
        </header>
    );
}