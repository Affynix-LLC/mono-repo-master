import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Hero from "../components/home/Hero.jsx";
import ChatIntakeAgent from "../components/home/ChatIntakeAgent.jsx";
import OpenAIAssistant from "../components/OpenAIAssistant.jsx";


export default function Home() {
  return (
    <div className="bg-[#0B0B0B]">
      <Hero />
      
      {/* Agent Zero Section */}
      <ChatIntakeAgent />

      {/* Three Agent Preview Section */}
      <section className="py-20 bg-gradient-to-b from-[#0E0E0E] to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-6 py-2 text-sm">
              OUR AGENTS
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Meet Your <span className="gradient-gold-molten">AI Workforce</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Three specialized agents designed to transform your business operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* AI Phone Representative */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden h-full hover:border-[#D4AF37]/60 transition-all group">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <CardContent className="p-0">
                  {/* Placeholder Image */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center overflow-hidden">
                    <Phone className="w-24 h-24 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">AI Phone Representative</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Your 24/7 digital receptionist handling inbound calls, answering questions, booking appointments, and transferring when needed.
                    </p>
                    <Badge className="bg-blue-500/20 text-blue-400 border-0">
                      Inbound Agent
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Customer Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden h-full hover:border-[#D4AF37]/60 transition-all group">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />
                <CardContent className="p-0">
                  {/* Placeholder Image */}
                  <div className="relative h-64 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center overflow-hidden">
                    <MessageSquare className="w-24 h-24 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">AI Customer Support</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Automated support resolving common issues, escalating complex cases via chat, voice, or hybrid format.
                    </p>
                    <Badge className="bg-orange-500/20 text-orange-400 border-0">
                      Inbound Agent
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Outreach Caller */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden h-full hover:border-[#D4AF37]/60 transition-all group">
                <div className="h-2 bg-gradient-to-r from-yellow-500 to-amber-500" />
                <CardContent className="p-0">
                  {/* Placeholder Image */}
                  <div className="relative h-64 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center overflow-hidden">
                    <TrendingUp className="w-24 h-24 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">AI Outreach Caller</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Digital sales representative executing outbound scripts, qualifying prospects, and handing off warm leads.
                    </p>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                      Outbound Agent
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to={createPageUrl('Agents')}>
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-12 py-6 text-lg font-bold"
              >
                Start Here
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Explore pricing, features, and get started in minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* OpenAI Assistant Chat Widget */}
      {process.env.VITE_OPENAI_ASSISTANT_ID && (
        <OpenAIAssistant
          assistantId={process.env.VITE_OPENAI_ASSISTANT_ID}
          title="Affynix Assistant"
          placeholder="Ask me about our AI agents..."
          welcomeMessage="Hello! I'm here to help you learn about Affynix AI agents. What would you like to know?"
        />
      )}
    </div>
  );
}