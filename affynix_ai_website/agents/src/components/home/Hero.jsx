import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const negativeWords = [
    "Chaos",
    "Busywork",
    "Friction",
    "Bottlenecks",
    "Errors",
    "Delays",
    "Downtime",
    "Waste",
    "Noise",
    "Repetition",
    "Inefficiency"
  ];

  const positiveWords = [
    "Automation",
    "Efficiency",
    "Intelligence",
    "Precision",
    "Scale",
    "Growth"
  ];

  const [negativeIndex, setNegativeIndex] = useState(0);
  const [positiveIndex, setPositiveIndex] = useState(0);

  useEffect(() => {
    const negativeTimer = setInterval(() => {
      setNegativeIndex((prev) => (prev + 1) % negativeWords.length);
    }, 2000);

    const positiveTimer = setInterval(() => {
      setPositiveIndex((prev) => (prev + 1) % positiveWords.length);
    }, 2000);

    return () => {
      clearInterval(negativeTimer);
      clearInterval(positiveTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-8 space-y-2">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
            >
              <span className="text-white">Hello: </span>
              <span className="inline-block relative align-middle" style={{ minWidth: '280px', height: '1.2em' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={positiveIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 top-0 gradient-gold-molten"
                  >
                    {positiveWords[positiveIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
            >
              <span className="text-white">Goodbye: </span>
              <span className="inline-block relative align-middle" style={{ minWidth: '280px', height: '1.2em' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={negativeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 top-0"
                    style={{ color: '#00FFFF' }}
                  >
                    {negativeWords[negativeIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>

          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] px-6 py-2 text-sm mb-12">
            THE EFFICIENCY AGENCY
          </Badge>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="#contact">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#E6C878] text-black font-bold px-10 py-7 rounded-full text-xl shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-110 active:scale-95"
              >
                Start Here
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-3 bg-[#D4AF37] rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}