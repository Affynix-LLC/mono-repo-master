import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, CheckCircle2, MessageSquare, TrendingUp, Loader2, Users, Zap, Sparkles, DollarSign, Clock, Shield, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AgentsPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleCheckout = async (priceId, tierName) => {
    setCheckoutLoading(priceId);
    try {
      const response = await base44.functions.invoke('createCheckout', {
        priceId,
        origin: window.location.origin
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const agents = [
    {
      icon: Phone,
      name: "AI Phone Representative",
      category: "Inbound",
      description: "A 24/7 trained digital receptionist. Handles inbound calls. Answers questions. Books appointments. Transfers when needed.",
      color: "from-blue-500 to-cyan-500",
      pricing: {
        t1: { 
          name: "Tier 1", 
          price: "$299", 
          priceId: "price_1SVD6ZAqAdqj1bSpeRSIB23O",
          features: [
            "1 Agent",
            "1 Language",
            "Pre-made template script",
            "Monthly call volume allocation",
            "CRM Sync included"
          ] 
        },
        t2: { 
          name: "Tier 2", 
          price: "$399", 
          priceId: "price_1SVDAkAqAdqj1bSp4sZNdPYR",
          features: [
            "1 Agent",
            "2 Languages",
            "Tailored script",
            "Higher monthly call volume",
            "CRM Sync included"
          ] 
        },
        t3: { 
          name: "Tier 3", 
          price: "$699", 
          priceId: "price_1SVDBqAqAdqj1bSp85taa0WQ",
          features: [
            "1 Agent",
            "2 Languages",
            "Fully custom script",
            "Add-On Modules available",
            "CRM Sync included"
          ]
        },
        enterprise: { 
          name: "Enterprise", 
          price: "Contact Us", 
          features: [
            "Multi-agent",
            "Multi-language",
            "Full customization",
            "Requires consultation call to scope"
          ]
        }
      }
    },
    {
      icon: MessageSquare,
      name: "AI Customer Support",
      category: "Inbound",
      description: "Automated support agent. Resolves common issues. Escalates complex cases. Operates in three formats: Chatbot, Voice, or Hybrid (Chat + Voice).",
      color: "from-orange-500 to-red-500",
      pricing: {
        t1: { 
          name: "Tier 1", 
          price: "$299", 
          priceId: "price_1SVDE5AqAdqj1bSpevRW7C8b",
          features: [
            "1 Agent",
            "1 Language",
            "Pre-made template script",
            "Monthly ticket allocation",
            "CRM Sync included"
          ] 
        },
        t2: { 
          name: "Tier 2", 
          price: "$399", 
          priceId: "price_1SVDEqAqAdqj1bSptqa2obNL",
          features: [
            "1 Agent",
            "2 Languages",
            "Tailored script",
            "Higher monthly ticket volume",
            "CRM Sync included"
          ] 
        },
        t3: { 
          name: "Tier 3", 
          price: "$699", 
          priceId: "price_1SVDGdAqAdqj1bSpSTHJsHeC",
          features: [
            "1 Agent",
            "2 Languages",
            "Fully custom script",
            "Add-On Modules available",
            "CRM Sync included"
          ]
        },
        enterprise: { 
          name: "Enterprise", 
          price: "Contact Us", 
          features: [
            "Multi-agent",
            "Multi-language",
            "Full customization",
            "Requires consultation call to scope"
          ]
        }
      }
    },
    {
      icon: TrendingUp,
      name: "AI Outreach Caller",
      category: "Outbound",
      description: "Sales-focused outbound agent. Acts as a digital sales representative. Calls inbound and cold leads. Executes outbound scripts. Qualifies prospects. Books appointments. Hands off warm leads to operators.",
      color: "from-yellow-500 to-amber-500",
      pricing: {
        t1: { 
          name: "Tier 1", 
          price: "$499", 
          priceId: "price_1SVDIfAqAdqj1bSpTjrb1N8Y",
          features: [
            "1 Agent",
            "1 Language",
            "Pre-made template script",
            "Monthly call volume allocation",
            "CRM Sync included"
          ] 
        },
        t2: { 
          name: "Tier 2", 
          price: "$899", 
          priceId: "price_1SVDJOAqAdqj1bSpcuczOAg8",
          features: [
            "1 Agent",
            "2 Languages",
            "Tailored script",
            "Higher monthly call volume",
            "CRM Sync included"
          ] 
        },
        t3: { 
          name: "Tier 3", 
          price: "$1,599", 
          priceId: "price_1SVDKSAqAdqj1bSpqKTG0RO0",
          features: [
            "1 Agent",
            "2 Languages",
            "Fully custom script",
            "Add-On Modules available",
            "CRM Sync included"
          ]
        },
        enterprise: { 
          name: "Enterprise", 
          price: "Contact Us", 
          features: [
            "Multi-agent",
            "Multi-language",
            "Full customization",
            "Requires consultation call to scope"
          ]
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-6 py-2 text-sm">
            AI AGENTS
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            Deploy Your <span className="gradient-gold-molten">AI Workforce</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose your agent, select your tier, and start automating in minutes.
          </p>
        </motion.div>

        {/* Agents */}
        <div className="space-y-20">
          {agents.map((agent, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${agent.color}`} />
                <CardContent className="p-10 lg:p-14">
                  {/* Agent Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${agent.color}`}>
                      <agent.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white">{agent.name}</h2>
                      <Badge variant="outline" className="mt-2 border-[#D4AF37]/30 text-[#D4AF37]">
                        {agent.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg mb-10 max-w-4xl">
                    {agent.description}
                  </p>

                  {/* Pricing Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(agent.pricing).map(([key, tier]) => (
                      <div key={key} className="flex flex-col">
                        <div className="flex-1 p-6 rounded-lg bg-gradient-to-br from-[#0E0E0E] to-black border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all">
                          <div className="mb-4">
                            <div className="font-bold text-white text-lg mb-2">{tier.name}</div>
                            <div className="text-3xl font-bold text-[#D4AF37]">
                              {tier.price}
                              {tier.price !== "Contact Us" && <span className="text-sm text-gray-400">/mo</span>}
                            </div>
                          </div>
                          <ul className="space-y-2 mb-6">
                            {tier.features.map((f, i) => (
                              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                <span className="leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button
                          onClick={() => {
                            if (tier.priceId) {
                              handleCheckout(tier.priceId, tier.name);
                            } else {
                              window.location.href = '/Consulting';
                            }
                          }}
                          disabled={checkoutLoading === tier.priceId}
                          className="mt-4 w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black font-bold h-12"
                        >
                          {checkoutLoading === tier.priceId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              {tier.priceId ? 'Buy Now' : 'Contact Us'}
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Workflow Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <Badge className="mb-6 px-4 py-1.5 backdrop-blur-xl bg-purple-500/20 border border-purple-500/50 text-purple-400">
            WORKFLOW MODULES
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Logic & Automation Workflows</h2>
          <p className="text-lg text-gray-400 mb-12">These workflows operate behind the agent to power full-funnel automation.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, name: "Lead Funnel Workflow", desc: "We architect end-to-end lead management systems that convert more prospects by automating capture, qualification, routing, and intelligent follow-up sequences." },
              { icon: Phone, name: "Outbound Workflow", desc: "We design structured outbound call flows with attempt logic, qualification frameworks, and seamless handoff protocols that maximize your sales team's efficiency." },
              { icon: MessageSquare, name: "Inbound Workflow", desc: "We build intelligent inbound routing systems that direct every call to the right place, book appointments automatically, and escalate critical issues instantly." },
              { icon: Zap, name: "CRM Automation Workflow", desc: "We create automated CRM workflows that tag leads, move deals through pipelines, trigger tasks, and keep your data accurate in real-time without manual entry." },
              { icon: Users, name: "Operations Workflow", desc: "We implement operational alert systems that notify your team via Slack, email, or SMS when critical events occur, ensuring nothing falls through the cracks." },
              { icon: Sparkles, name: "Multi-Channel Workflow", desc: "We orchestrate synchronized outreach across voice, SMS, email, and chat channels with sequenced follow-ups that increase engagement and conversion rates." }
            ].map((workflow, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="backdrop-blur-xl bg-black/60 border border-purple-500/20 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <workflow.icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-white text-xs">{workflow.name}</h4>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-snug">{workflow.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm mb-3">Need custom workflow configuration?</p>
            <Button
              onClick={() => window.location.href = '/Consulting'}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              Request Custom Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Operational Considerations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <Badge className="mb-6 px-4 py-1.5 backdrop-blur-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]">
            OPERATIONAL CONSIDERATIONS
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Operational Considerations & Strategic Recommendations</h2>
          <p className="text-lg text-gray-400 mb-12">Condensed guidance for clients evaluating agent deployment.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, name: "Inbound vs Outbound Segmentation", desc: "We architect workflows based on how your business generates demand. Inbound systems get real-time qualification, instant routing, and intelligent escalation. Outbound systems get structured cadences, follow-up logic, and persistent contact strategies. We segment properly so conversion rates improve." },
              { icon: MessageSquare, name: "Multi-Channel Orchestration", desc: "We build agents that operate consistently across phone, chat, email, SMS, and LinkedIn. Your prospects choose their channel. We ensure unified communication that increases contact rates and eliminates leakage across touchpoints." },
              { icon: Sparkles, name: "Tech Stack Integration", desc: "We sync your CRM, calendar, and communication systems into one automated flow. Our agents write structured data back into your existing infrastructure without manual cleanup. Clean integration means zero operational loss and accurate reporting from day one." },
              { icon: Users, name: "Controlled Autonomy", desc: "We deploy AI agents with strategic oversight built in. You start with controlled workflows we design and tune. We scale autonomy only after baseline performance is validated. This protects quality while maximizing efficiency." },
              { icon: DollarSign, name: "Transparent ROI Modeling", desc: "We calculate exactly how automation increases your booked calls, closed deals, and service capacity. Our pricing considers agent volume, contact attempts, and communication load. You see clear cost efficiency before deployment." },
              { icon: Shield, name: "Compliance & Deliverability Engineering", desc: "We architect outbound operations that respect communication rules and protect your domain health. Our infrastructure includes proper warm-up protocols, throttling logic, and compliance guardrails. This reduces SPAM risk and maintains long-term reachability." },
              { icon: Clock, name: "Sales Cycle Alignment", desc: "We match agent design to your deal complexity. High-volume, short-cycle businesses get heavy automation. Enterprise or complex sales cycles get hybrid workflows combining agents with human touchpoints. The system fits your revenue model." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#E6C878]">
                        <item.icon className="w-4 h-4 text-black" />
                      </div>
                      <h4 className="font-bold text-white text-xs">{item.name}</h4>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-snug">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Our team can build fully custom AI agents tailored to your unique business needs.
              </p>
              <Button
                onClick={() => window.location.href = '/Consulting'}
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-10 py-6 text-lg font-bold"
              >
                Request Consultation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}