
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Layers, Rocket, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MethodologySection() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Diagnostic",
      description: "We audit your workflows, identify automation opportunities, and map your growth logic. The output is a comprehensive Automation Blueprint that shows exactly where and how to optimize.",
      icon: Search,
      deliverable: "Automation Blueprint",
      color: "#3B82F6", // Changed color from #4F46E5
      steps: ["Intake via Affynix.ai", "Workflow & system audit", "ROI mapping"]
    },
    {
      phase: "Phase 2",
      title: "Design & Build",
      description: "We architect your automation stack—AI agents, integrations, and data flows. Every component is designed for precision execution and built to your specifications.",
      icon: Layers,
      deliverable: "Live Automation Stack",
      color: "#8B5CF6", // Changed color from #14B8A6
      steps: ["Agent architecture", "Integration design", "Client approval & deployment"]
    },
    {
      phase: "Phase 3",
      title: "Activation & Optimization",
      description: "Systems go live. We test data flows, monitor performance, and connect you to Affynix analytics. Real-time dashboards show ROI and system health.",
      icon: Rocket,
      deliverable: "ROI Dashboard + Monthly Report",
      color: "#10B981", // Changed color from #C6A45E
      steps: ["Test automations", "Analytics connection", "Performance monitoring"]
    },
    {
      phase: "Phase 4",
      title: "Recurrence",
      description: "Your system self-optimizes based on performance data. Ongoing refinement and scaling ensure your automation infrastructure evolves with your business.",
      icon: BarChart3,
      deliverable: "Self-Sustaining Profit Automation",
      color: "#14B8A6", // Changed color from #8B5CF6
      steps: ["Continuous optimization", "Scaling", "Network integration"]
    }
  ];

  return (
    <section id="solution" className="py-20 relative overflow-hidden bg-[#111111]">
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
            CLIENT LIFECYCLE FRAMEWORK
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Method: <span className="text-[#12F4FF]">Diagnose, Design, Deploy, Refine</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A systematic approach to building profit automation infrastructure. 
            From strategic audit to self-optimizing system.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)]">
                <CardContent className="p-0">
                  <div className="p-6" style={{backgroundColor: phase.color}}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 backdrop-blur-xl bg-black/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <phase.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge className="backdrop-blur-xl bg-white/20 text-white border-white/30 text-xs mb-1">
                          {phase.phase}
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 backdrop-blur-xl bg-[#111111]/60">
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {phase.description}
                    </p>
                    
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-500 mb-2">Process:</div>
                      <div className="space-y-2">
                        {phase.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 bg-[#12F4FF] rounded-full shadow-[0_0_10px_rgba(18,244,255,0.5)]" />
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#C6A45E]/20">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Deliverable
                      </div>
                      <div className="text-sm font-bold text-white">
                        {phase.deliverable}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button size="lg" className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-black px-8 py-6 text-lg rounded-full font-semibold shadow-[0_0_30px_rgba(198,164,94,0.4)] hover:shadow-[0_0_50px_rgba(18,244,255,0.5)] hover:border hover:border-[#12F4FF] transition-all duration-300">
            Request Your Diagnostic
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
