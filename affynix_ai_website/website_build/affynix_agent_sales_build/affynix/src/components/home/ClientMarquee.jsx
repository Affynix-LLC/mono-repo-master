import React from "react";
import { motion } from "framer-motion";

export default function ClientMarquee() {
  const clients = [
    "Microsoft", "Google", "Amazon", "Meta", "Apple",
    "Salesforce", "Oracle", "IBM", "Adobe", "SAP",
    "Microsoft", "Google", "Amazon", "Meta", "Apple"
  ];

  return (
    <section className="py-12 relative border-y border-[#C6A45E]/20 bg-[#111111]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-gray-400 font-medium mb-8">
          Trusted by leading companies across industries
        </p>
        
        <div className="relative overflow-hidden">
          <div className="flex">
            <motion.div
              className="flex gap-12 items-center"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-6 py-4 backdrop-blur-xl bg-[#111111]/60 rounded-xl border border-[#C6A45E]/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(198,164,94,0.3)] hover:border-[#12F4FF]/50 transition-all duration-300"
                >
                  <span className="text-gray-300 font-semibold text-lg whitespace-nowrap">
                    {client}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}