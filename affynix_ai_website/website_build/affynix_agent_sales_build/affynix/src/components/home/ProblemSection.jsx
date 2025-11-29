
import React from "react";
import { AlertCircle, TrendingDown, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      title: "Manual Friction Blocks Growth",
      description: "Every manual process is a bottleneck. Your team spends time on repetitive tasks instead of strategic growth, limiting your ability to scale efficiently.",
      color: "#EF4444"
    },
    {
      icon: TrendingDown,
      title: "Systems Don't Talk to Each Other",
      description: "Disconnected tools create data silos and workflow gaps. Information gets lost, opportunities slip through, and your team wastes hours bridging the gaps manually.",
      color: "#F97316"
    },
    {
      icon: RefreshCw,
      title: "Static Systems Can't Adapt",
      description: "Traditional solutions are set-it-and-forget-it. Markets change, customer behavior shifts, but your systems stay the same—falling behind while competitors evolve.",
      color: "#FBBF24"
    }
  ];

  return (
    <section id="problem" className="py-20 relative overflow-hidden bg-[#0B0B0B]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Revenue Systems <span className="text-[#C6A45E]">Break Down</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Most businesses are held back by the same fundamental issues—manual friction, 
            disconnected systems, and inability to adapt at speed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)] group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,164,94,0.3)] group-hover:shadow-[0_0_40px_rgba(18,244,255,0.4)] transition-all duration-300`} style={{backgroundColor: problem.color}}>
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {problem.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
