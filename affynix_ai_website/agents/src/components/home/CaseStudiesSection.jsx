import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export default function CaseStudiesSection() {
  const caseStudies = [
    {
      company: "SaaS Platform",
      results: "300% ROI in 90 Days",
      before: "Manual lead qualification eating 40+ hours/week",
      after: "AI handles 85% of inbound, books qualified meetings automatically",
      stats: [
        { label: "Time Saved", value: "160 hrs/mo", icon: Clock },
        { label: "Conversion Rate", value: "+47%", icon: TrendingUp }
      ],
      metrics: { timeframe: "90 days", investment: "$45K", return: "$135K" }
    },
    {
      company: "E-commerce Brand",
      results: "50+ Automations in First Month",
      before: "Disconnected systems, manual order processing, slow support",
      after: "Integrated automation handling orders, inventory, and support 24/7",
      stats: [
        { label: "Orders Processed", value: "10K+", icon: DollarSign },
        { label: "Support Tickets", value: "-65%", icon: Users }
      ],
      metrics: { timeframe: "First month", investment: "$32K", return: "$98K" }
    },
    {
      company: "Consulting Firm",
      results: "Client Capacity Doubled Without New Hires",
      before: "Manual reporting, scheduling chaos, limited client touchpoints",
      after: "Automated communication, dynamic scheduling, real-time analytics",
      stats: [
        { label: "Client Capacity", value: "2x", icon: Users },
        { label: "Admin Time", value: "-70%", icon: Clock }
      ],
      metrics: { timeframe: "6 months", investment: "$52K", return: "$180K" }
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#111111]">
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="backdrop-blur-xl bg-[#12F4FF]/20 border border-[#12F4FF]/50 text-[#12F4FF] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(18,244,255,0.3)]">
            RESULTS
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Numbers From <span className="text-[#C6A45E]">Real Clients</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)]">
                <CardContent className="p-8">
                  <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-4">
                    {study.company}
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {study.results}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Before</div>
                      <p className="text-sm text-gray-400">{study.before}</p>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">After</div>
                      <p className="text-sm text-gray-400">{study.after}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {study.stats.map((stat, i) => {
                      const colors = [
                        ["#EF4444", "#10B981"],
                        ["#3B82F6", "#F59E0B"],
                        ["#8B5CF6", "#22C55E"]
                      ];
                      const studyColors = colors[index % colors.length];
                      return (
                        <div key={i} className="backdrop-blur-xl bg-[#111111]/60 border border-[#12F4FF]/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: studyColors[i % studyColors.length]}}>
                              <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                          </div>
                          <div className="text-lg font-bold text-white">{stat.value}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-[#C6A45E]/20">
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-gray-500">Investment</div>
                        <div className="text-white font-semibold">{study.metrics.investment}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500">Return</div>
                        <div className="text-[#12F4FF] font-semibold">{study.metrics.return}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Video Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="backdrop-blur-xl bg-[#111111]/60 border-2 border-[#C6A45E]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto flex items-center justify-center" style={{backgroundColor: "#1A1A1A"}}>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)]" style={{backgroundColor: "#14B8A6"}}>
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
                    </div>
                    <p className="text-gray-400">Watch Client Testimonial</p>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="bg-[#12F4FF]/20 border border-[#12F4FF]/50 text-[#12F4FF] mb-4 w-fit">
                    VIDEO
                  </Badge>
                  <blockquote className="text-xl text-white font-medium mb-4 italic">
                    "Affynix built the system. Our revenue operations now run themselves."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-white">Sarah Chen</div>
                    <div className="text-gray-400">CEO, TechScale Solutions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}