
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, Zap, BarChart3 } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Diagnostic Intake",
      description: "Submit your business details through Affynix.ai. We analyze workflows, identify friction points, and map automation opportunities.",
      color: "#6366F1"
    },
    {
      number: "02",
      icon: Layers,
      title: "Blueprint & Approval",
      description: "Receive your custom Automation Blueprint showing ROI projections, agent architecture, and integration strategy. Review and approve.",
      color: "#14B8A6"
    },
    {
      number: "03",
      icon: Zap,
      title: "Build & Deploy",
      description: "We build your AI agents, configure integrations, and deploy your automation stack. Systems go live with full testing and monitoring.",
      color: "#F97316"
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Optimize & Scale",
      description: "Continuous refinement based on performance data. Monthly reports track ROI, and we scale your infrastructure as your business grows.",
      color: "#A855F7"
    }
  ];

  return (
    <section id="process" className="py-20 relative overflow-hidden bg-[#0B0B0B]">
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
            EXECUTION FRAMEWORK
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            From <span className="text-[#12F4FF]">Concept to Live System</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our streamlined 4-step process takes you from initial diagnostic to fully operational 
            automation infrastructure in weeks, not months.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px">
            <div className="h-full bg-[#12F4FF]/30"></div>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="h-full backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)] group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(198,164,94,0.3)] group-hover:shadow-[0_0_40px_rgba(18,244,255,0.4)] transition-all duration-300`} style={{backgroundColor: step.color}}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-[#C6A45E]">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow connector for mobile */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-4">
                  <div className="text-[#12F4FF] text-2xl">↓</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

