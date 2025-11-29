
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Bot, Mail, Calendar, Users } from "lucide-react";

export default function SingleAgentSection() {
  const agents = [
    {
      icon: Phone,
      name: "Phone Representative Agent",
      description: "AI voice agent that handles inbound/outbound calls, qualifies leads, books appointments, and provides customer support with natural conversation flow.",
      features: [
        "Natural voice interaction",
        "Lead qualification",
        "Appointment scheduling",
        "24/7 availability"
      ],
      price: "$497",
      period: "/month",
      color: "#3B82F6"
    },
    {
      icon: Users,
      name: "Cold-Caller Agent",
      description: "Automated outbound calling system that reaches prospects at scale, delivers personalized pitches, and books qualified meetings with your sales team.",
      features: [
        "Automated outbound dialing",
        "Personalized pitch delivery",
        "Meeting booking",
        "Call analytics & recording"
      ],
      price: "$697",
      period: "/month",
      color: "#DC2626"
    },
    {
      icon: MessageSquare,
      name: "Chatbot Agent",
      description: "Intelligent chat assistant for your website that engages visitors, answers questions, captures leads, and routes conversations to your team when needed.",
      features: [
        "Website integration",
        "Lead capture & qualification",
        "Instant responses",
        "CRM integration"
      ],
      price: "$297",
      period: "/month",
      color: "#10B981"
    },
    {
      icon: Mail,
      name: "Email Response Agent",
      description: "AI-powered email automation that handles inbound inquiries, nurtures leads, sends follow-ups, and maintains consistent communication at scale.",
      features: [
        "Inbound email handling",
        "Automated follow-ups",
        "Personalized responses",
        "Email sequence automation"
      ],
      price: "$397",
      period: "/month",
      color: "#F59E0B"
    },
    {
      icon: Calendar,
      name: "Scheduling Agent",
      description: "Smart booking assistant that manages your calendar, coordinates meeting times, sends reminders, and handles rescheduling automatically.",
      features: [
        "Calendar management",
        "Automated reminders",
        "Rescheduling handling",
        "Multi-timezone support"
      ],
      price: "$197",
      period: "/month",
      color: "#8B5CF6"
    },
    {
      icon: Bot,
      name: "Custom AI Agent",
      description: "Bespoke AI agent designed specifically for your unique business process. We build exactly what you need with complete customization.",
      features: [
        "Fully customized",
        "Any business process",
        "Your specifications",
        "Dedicated development"
      ],
      price: "Custom",
      period: "pricing",
      color: "#EC4899"
    }
  ];

  return (
    <section id="single-agents" className="py-20 relative overflow-hidden bg-[#111111]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
            À LA CARTE OPTIONS
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Single Agent Solutions
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't need full infrastructure? Deploy individual AI agents for specific tasks. 
            Each agent operates independently and can be integrated with your existing systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)] group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`} style={{backgroundColor: agent.color}}>
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {agent.name}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {agent.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-500 mb-3">Includes:</div>
                    <div className="space-y-2">
                      {agent.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-[#12F4FF] rounded-full shadow-[0_0_10px_rgba(18,244,255,0.5)]" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#C6A45E]/20">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">{agent.price}</span>
                      <span className="text-gray-500">{agent.period}</span>
                    </div>
                    <Button className={`w-full bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white font-semibold py-6 rounded-full shadow-[0_0_30px_rgba(198,164,94,0.3)] hover:shadow-[0_0_40px_rgba(18,244,255,0.4)] transition-all duration-300`}>
                      Deploy Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="backdrop-blur-xl bg-[#111111]/60 border-2 border-[#C6A45E]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need Multiple Agents?
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Get better value with our full infrastructure package—includes strategic planning, 
                multi-agent deployment, and continuous optimization.
              </p>
              <Button size="lg" className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white px-8 py-6 text-lg rounded-full font-semibold shadow-[0_0_30px_rgba(198,164,94,0.4)] hover:shadow-[0_0_50px_rgba(18,244,255,0.5)] transition-all duration-300">
                Explore Full Infrastructure
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
