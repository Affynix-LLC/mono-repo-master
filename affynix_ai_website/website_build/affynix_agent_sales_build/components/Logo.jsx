import React from "react";

export default function Logo() {
    return (
        <div className="flex justify-center items-center">
            <div className="relative">
                <div className="absolute inset-0 blur-xl bg-yellow-600/30 rounded-full animate-pulse"></div>
                <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690f1faa1d54235fb3f8760a/b5585529d_logo1.png" 
                    alt="Affynix Logo" 
                    className="relative w-32 h-32 object-contain"
                    style={{
                        filter: 'drop-shadow(0 0 20px rgba(217, 184, 106, 0.6)) drop-shadow(0 0 40px rgba(217, 184, 106, 0.4))'
                    }}
                />
            </div>
        </div>
    );
}