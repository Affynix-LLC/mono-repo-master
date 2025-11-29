
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function IntegrationSection() {
  const layers = [
    {
      title: "The Brain",
      subtitle: "Consultancy Layer",
      icon: Brain,
      color: "#A855F7", // Changed color
      capabilities: [
        "Strategic audits",
        "Automation blueprints",
        "Growth logic & ROI mapping",
        "AI agent prescription"
      ]
    },
    {
      title: "The Body",
      subtitle: "Implementation Network",
      icon: Cpu,
      color: "#06B6D4", // Changed color
      capabilities: [
        "System deployment",
        "AI agent buildout (voice, chat, backend)",
        "CRM + marketing integration",
        "Data routing and optimization"
      ]
    },
    {
      title: "The Synapse",
      subtitle: "Feedback Loop",
      icon: Repeat,
      color: "#F59E0B", // Changed color
      capabilities: [
        "Data flows from Body → Brain",
        "Optimization flows from Brain → Body",
        "Each client becomes a self-improving node",
        "Continuous system evolution"
      ]
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#0B0B0B]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #C6A45E 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
            VISUAL MODEL
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Brain + Body + Synapse
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Affynix operates as an integrated intelligence system. Strategy (Brain) designs the logic. 
            Implementation (Body) executes the system. Feedback (Synapse) drives continuous evolution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {layers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)]">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,164,94,0.3)]`} style={{backgroundColor: layer.color}}>
                    <layer.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    {layer.subtitle}
                  </p>
                  <div className="space-y-3">
                    {layer.capabilities.map((capability, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-400">
                        <div className="w-1.5 h-1.5 bg-[#12F4FF] rounded-full mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(18,244,255,0.5)]" />
                        <span className="text-sm leading-relaxed">{capability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="backdrop-blur-xl bg-[#111111]/40 border-2 border-[#C6A45E]/30 rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <h3 className="text-2xl font-bold text-center text-white mb-8">System Architecture Flow</h3>
          
          <div className="flex flex-col items-center space-y-6">
            {/* Client Business */}
            <div className="w-full max-w-md backdrop-blur-xl bg-[#111111]/60 border-2 border-[#C6A45E]/50 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(198,164,94,0.2)]">
              <div className="text-[#C6A45E] font-bold text-lg">Client Business</div>
            </div>
            
            <div className="text-[#12F4FF] text-2xl">↓</div>

            {/* Brain */}
            <div className="w-full max-w-md backdrop-blur-xl bg-[#111111]/60 border-2 border-[#C6A45E]/50 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(198,164,94,0.2)]">
              <div className="text-[#C6A45E] font-bold text-lg mb-1">Consultancy: Brain</div>
              <div className="text-sm text-gray-400">Strategic audit & blueprint design</div>
            </div>

            <div className="text-[#12F4FF] text-2xl">↓</div>

            {/* Body */}
            <div className="w-full max-w-md backdrop-blur-xl bg-[#111111]/60 border-2 border-[#12F4FF]/50 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(18,244,255,0.2)]">
              <div className="text-[#12F4FF] font-bold text-lg mb-1">Implementation: Body</div>
              <div className="text-sm text-gray-400">System deployment & integration</div>
            </div>

            <div className="text-[#C6A45E] text-2xl">↓</div>

            {/* Live System with Feedback */}
            <div className="w-full max-w-md backdrop-blur-xl bg-[#111111]/60 border-2 border-[#12F4FF]/50 rounded-xl p-4 text-center relative shadow-[0_0_20px_rgba(18,244,255,0.2)]">
              <div className="text-[#12F4FF] font-bold text-lg mb-1">Live System → Data Feedback</div>
              <div className="text-sm text-gray-400">Continuous optimization loop</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[#12F4FF] text-3xl">
                ↺
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] px-6 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
              Each client becomes a self-improving node within the Affynix network
            </Badge>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
