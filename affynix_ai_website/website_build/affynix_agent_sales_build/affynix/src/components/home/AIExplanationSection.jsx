import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function AIExplanationSection() {
  return (
    <section className="py-20 px-6 bg-[#0B0B0B]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 p-8 lg:p-12">
            <div className="space-y-6 text-gray-300">
              <p className="text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                We automate.
              </p>
              
              <p className="text-xl lg:text-2xl leading-relaxed">
                Others sell you software. We build your infrastructure.
              </p>
              
              <p className="text-xl lg:text-2xl leading-relaxed">
                The workflow. The logic. The execution. Built for <span className="text-white font-semibold">your</span> business.
              </p>
              
              <div className="pt-6 border-t border-[#D4AF37]/20">
                <p className="text-xl lg:text-2xl text-white">
                  No fluff. No generic tools. Just systems that work.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}