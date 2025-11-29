import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPanel({ onClose }) {
    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-cyan-500/30 z-50 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-cyan-300">Settings</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-cyan-400">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Intelligence Level</label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Response Length</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                        <option>Short</option>
                        <option>Medium</option>
                        <option>Long</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Voice Settings</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm text-gray-300">Auto-speak responses</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Visualization Intensity</label>
                    <input type="range" min="0" max="100" defaultValue="80" className="w-full" />
                </div>
            </div>
        </motion.div>
    );
}