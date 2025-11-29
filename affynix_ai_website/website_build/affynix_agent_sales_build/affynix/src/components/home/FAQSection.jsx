import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How quickly can we deploy?",
      a: "Most clients go live within 7-14 days. We handle setup, integration, testing."
    },
    {
      q: "What if the AI can't handle a call?",
      a: "It escalates to your team in real-time. You get a transcript and recording of every interaction."
    },
    {
      q: "Do we need to change our systems?",
      a: "No. We integrate with your existing CRM, phone system, and calendar."
    },
    {
      q: "What does it cost?",
      a: "Agents start at $199/month. Custom infrastructure depends on scope. We provide exact numbers after the diagnostic."
    },
    {
      q: "Can we customize it?",
      a: "Yes. You control the script, tone, and responses."
    },
    {
      q: "What if we need to cancel?",
      a: "No contracts. Cancel with 30 days notice."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-[#0B0B0B]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-8">{faq.q}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] transition-transform flex-shrink-0 ${
                      openIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="px-6 pb-6 pt-0">
                        <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}