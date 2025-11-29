
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Cog, TrendingUp, Zap, Shield, Network } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Target,
      title: "Precision Execution",
      description: "Replace human friction with automated precision. Every task executes exactly as designed, every time, without errors or delays.",
      stat: "99.9%",
      statLabel: "Accuracy",
      color: "#DC2626"
    },
    {
      icon: Cog,
      title: "Self-Optimizing Systems",
      description: "Your automation infrastructure continuously refines itself based on performance data. The system gets smarter and more efficient over time.",
      stat: "24/7",
      statLabel: "Active Learning",
      color: "#2563EB"
    },
    {
      icon: TrendingUp,
      title: "Automated Revenue Growth",
      description: "Build profit engines that run themselves. From lead capture to conversion, every step is optimized for maximum ROI without manual intervention.",
      stat: "3-5X",
      statLabel: "ROI Multiplier",
      color: "#059669"
    },
    {
      icon: Zap,
      title: "Rapid Deployment",
      description: "From diagnostic to live system in weeks, not months. We architect, build, and activate your automation stack with precision speed.",
      stat: "2-4",
      statLabel: "Week Launch",
      color: "#EA580C"
    },
    {
      icon: Shield,
      title: "Built to Scale",
      description: "Systems designed to handle 10X growth without breaking. Your infrastructure scales seamlessly as your business expands.",
      stat: "10X",
      statLabel: "Scale Capacity",
      color: "#7C3AED"
    },
    {
      icon: Network,
      title: "Network Intelligence",
      description: "Tap into insights from the entire Affynix network. Your system benefits from optimizations across all client implementations.",
      stat: "∞",
      statLabel: "Network Effects",
      color: "#DB2777"
    }
  ];

  return (
    <section id="benefits" className="py-20 relative overflow-hidden bg-[#111111]">
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-[#C6A45E]">Architect</span> and <span className="text-[#12F4FF]">Activate</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We don't just consult—we build, deploy, and maintain your profit automation infrastructure. 
            Strategy meets execution in one unified system.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)] group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,164,94,0.3)] group-hover:shadow-[0_0_40px_rgba(18,244,255,0.4)] group-hover:scale-110 transition-all duration-300`} style={{backgroundColor: benefit.color}}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-[#C6A45E] mb-1">
                      {benefit.stat}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {benefit.statLabel}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="backdrop-blur-xl bg-[#111111]/60 border-2 border-[#C6A45E]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <CardContent className="p-12 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                "Affynix designs the logic<br />& builds the system"
              </div>
              <p className="text-lg text-gray-400">
                Our Method: Diagnose, design, deploy, and continuously refine.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
