import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Users, Calendar, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BriefAgentsSection() {
  const agentTypes = [
    { icon: Phone, name: "AI Phone Rep", color: "from-blue-500 to-cyan-500" },
    { icon: Users, name: "Lead Qualifier", color: "from-purple-500 to-pink-500" },
    { icon: Calendar, name: "Appointment Setter", color: "from-green-500 to-emerald-500" },
    { icon: MessageSquare, name: "Customer Support", color: "from-orange-500 to-red-500" },
    { icon: TrendingUp, name: "Cold Caller", color: "from-yellow-500 to-amber-500" }
  ];

  return (
    <section className="py-20 px-6 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Or Choose From Our <span className="gradient-gold-molten">AI Agents</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Pre-configured agents. Ready to deploy.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {agentTypes.map((agent, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl("Agents")}>
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-8 py-6 text-lg font-semibold">
              View All Agents
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}