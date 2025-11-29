import React from "react";
import logoSvg from "@/assets/affynix-logo.svg";

export default function Logo({ size = "w-36 h-36" }) {
    return (
        <div className="flex justify-center items-center">
            <div className="relative">
                <div className="absolute inset-0 blur-[80px] bg-yellow-500/20 rounded-full animate-pulse" />
                <img
                    src={logoSvg}
                    alt="Affynix Logo"
                    className={`relative object-contain drop-shadow-[0_0_40px_rgba(255,215,0,0.45)] ${size}`}
                    style={{
                        filter:
                            "drop-shadow(0 0 25px rgba(255,215,0,0.5)) drop-shadow(0 0 60px rgba(255,215,0,0.45))",
                    }}
                />
            </div>
        </div>
    );
}