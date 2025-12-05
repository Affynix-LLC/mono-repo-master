import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Zap, Star, Sparkles, TrendingUp, PhoneCall, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState("");

  const handleCheckout = async (priceId, productName, amount) => {
    setLoading(priceId);
    
    try {
      const response = await base44.functions.invoke('createCheckout', {
        priceId,
        email: email || undefined,
        origin: window.location.origin
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('Failed to create checkout session');
        setLoading(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
      setLoading(null);
    }
  };

  const baseProducts = [
    {
      name: "Base Plan",
      tier: "Tier 1",
      price: "$199",
      period: "/month",
      description: "24/7 AI receptionist for small businesses",
      features: [
        "24/7 AI receptionist",
        "Handles calls and bookings",
        "One language support",
        "Basic custom script",
        "Never miss a lead",
      ],
      priceId: "price_1SJK1cAqAdqj1bSpOCz34nca",
      icon: PhoneCall,
      color: "#3B82F6",
      popular: false,
    },
    {
      name: "Plus Plan",
      tier: "Tier 2",
      price: "$299",
      period: "/month",
      description: "Bilingual AI receptionist with calendar integration",
      features: [
        "Everything in Base Plan",
        "Bilingual (English + Spanish)",
        "Calendar integration",
        "Advanced custom scripting",
        "Priority support",
      ],
      priceId: "price_1SJK7rAqAdqj1bSpzIQmlJ4S",
      icon: Zap,
      color: "#8B5CF6",
      popular: true,
    },
    {
      name: "Premium Plan",
      tier: "Tier 3",
      price: "$499",
      period: "/month",
      description: "Custom-branded AI with full CRM integration",
      features: [
        "Everything in Plus Plan",
        "Custom-branded voice agent",
        "Full CRM and lead sync",
        "Advanced scripting & tone",
        "Dedicated account manager",
      ],
      priceId: "price_1SJKBBAqAdqj1bSp9qIgGD7k",
      icon: Star,
      color: "#F59E0B",
      popular: false,
    },
  ];

  const comboProducts = [
    {
      name: "Tier 1 Combo",
      subtitle: "50 Leads + Agent",
      price: "$295",
      period: "/month",
      description: "Base Plan + 50 verified leads (10% discount)",
      discount: "Save 10%",
      features: [
        "Everything in Base Plan",
        "50 verified leads included",
        "Additional leads at standard rate",
        "Perfect for getting started",
      ],
      priceId: "price_1SPSY6AqAdqj1bSppAoeVNGG",
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      name: "Tier 2 Combo",
      subtitle: "100 Leads + Agent",
      price: "$475",
      period: "/month",
      description: "Plus Plan + 100 verified leads (15% discount)",
      discount: "Save 15%",
      features: [
        "Everything in Plus Plan",
        "100 verified leads included",
        "Additional leads at standard rate",
        "Best for growing teams",
      ],
      priceId: "price_1SPScrAqAdqj1bSpDYpvWPhM",
      icon: TrendingUp,
      color: "#8B5CF6",
      popular: true,
    },
    {
      name: "Tier 3 Combo",
      subtitle: "150 Leads + Agent",
      price: "$695",
      period: "/month",
      description: "Premium Plan + 150 verified leads (20% discount)",
      discount: "Save 20%",
      features: [
        "Everything in Premium Plan",
        "150 verified leads included",
        "Additional leads at standard rate",
        "Maximum value package",
      ],
      priceId: "price_1SPSdPAqAdqj1bSpI1i34nlv",
      icon: Sparkles,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-4 py-2 text-sm">
            SIMPLE, TRANSPARENT PRICING
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Choose Your <span className="gradient-gold-molten">AI Solution</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            From basic automation to full-scale AI implementation. All plans include hands-off setup and ongoing support.
          </p>
          
          {/* Email input for easier checkout */}
          <div className="max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email for faster checkout"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6 text-center"
            />
          </div>
        </motion.div>

        {/* Base Plans */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">AI Phone Rep Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {baseProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#D4AF37] text-black px-4 py-1 font-semibold">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <Card className={`backdrop-blur-xl bg-black/60 border-2 h-full transition-all duration-300 hover:scale-105 ${
                  product.popular 
                    ? 'border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.3)]' 
                    : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                }`}>
                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{backgroundColor: product.color}}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm text-gray-400 mb-1">{product.tier}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-white">{product.price}</span>
                      <span className="text-gray-400">{product.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleCheckout(product.priceId, product.name, product.price)}
                      disabled={loading === product.priceId}
                      size="lg"
                      className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                        product.popular
                          ? 'bg-[#D4AF37] hover:bg-[#E6C878] text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {loading === product.priceId ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Get Started'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Combo Plans */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Combo Plans with Leads</h2>
            <p className="text-gray-400">Bundle your AI agent with verified leads and save up to 20%</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {comboProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {product.discount && (
                  <div className="absolute -top-4 right-4 z-10">
                    <Badge className="bg-[#10B981] text-white px-3 py-1 font-semibold">
                      {product.discount}
                    </Badge>
                  </div>
                )}
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#D4AF37] text-black px-4 py-1 font-semibold">
                      BEST VALUE
                    </Badge>
                  </div>
                )}
                <Card className={`backdrop-blur-xl bg-black/60 border-2 h-full transition-all duration-300 hover:scale-105 ${
                  product.popular 
                    ? 'border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.3)]' 
                    : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                }`}>
                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{backgroundColor: product.color}}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                    <div className="text-sm text-[#D4AF37] mb-3">{product.subtitle}</div>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-white">{product.price}</span>
                      <span className="text-gray-400">{product.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleCheckout(product.priceId, product.name, product.price)}
                      disabled={loading === product.priceId}
                      size="lg"
                      className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                        product.popular
                          ? 'bg-[#D4AF37] hover:bg-[#E6C878] text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {loading === product.priceId ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Get Started'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lead Add-On */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Need More Leads?</h3>
              <p className="text-gray-400 mb-4">Add verified lead packs anytime</p>
              <div className="text-4xl font-bold text-white mb-4">$95</div>
              <p className="text-gray-400 mb-6">50 verified leads (available to active subscribers)</p>
              <Button
                onClick={() => handleCheckout('price_1SQvpkAqAdqj1bSp3gOO88cF', 'AI Leads - 50 Pack', '$95')}
                disabled={loading === 'price_1SQvpkAqAdqj1bSp3gOO88cF'}
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white py-6 px-8"
              >
                {loading === 'price_1SQvpkAqAdqj1bSp3gOO88cF' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Purchase Lead Pack'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Plan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#12F4FF]/10 border border-[#D4AF37]/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
              <p className="text-xl text-gray-300 mb-8">
                For enterprises needing 300+ leads/month or custom AI infrastructure
              </p>
              <a href="#contact">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-10 py-6 text-lg font-semibold">
                  Contact Sales
                </Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}