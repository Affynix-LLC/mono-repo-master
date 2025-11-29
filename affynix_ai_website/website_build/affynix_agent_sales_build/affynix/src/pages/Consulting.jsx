import React from "react";
import { motion } from "framer-motion";
import ConsultingIntakeForm from "../components/agents/ConsultingIntakeForm.jsx";

export default function Consulting() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ConsultingIntakeForm />
        </motion.div>
      </div>
    </div>
  );
}