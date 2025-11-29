import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Success() {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session_id');
        setSessionId(session);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full text-center"
            >
                <div className="bg-gray-900/60 border border-cyan-500/30 rounded-2xl p-12 backdrop-blur-sm"
                     style={{ boxShadow: '0 4px 30px rgba(6, 182, 212, 0.2)' }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6 flex justify-center"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-14 h-14 text-white" />
                        </div>
                    </motion.div>

                    <h1 className="text-4xl font-bold mb-4 text-cyan-300">
                        Payment Successful!
                    </h1>
                    
                    <p className="text-xl text-gray-300 mb-2">
                        Thank you for your purchase
                    </p>
                    
                    {sessionId && (
                        <p className="text-sm text-gray-500 mb-8">
                            Session ID: {sessionId}
                        </p>
                    )}

                    <p className="text-gray-400 mb-8">
                        Your account has been upgraded. You'll receive a confirmation email shortly.
                    </p>

                    <Link to={createPageUrl("Index")}>
                        <Button className="bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all px-8 py-6 text-lg">
                            <Home className="w-5 h-5 mr-2" />
                            Return Home
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}