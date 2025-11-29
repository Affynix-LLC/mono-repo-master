import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Zap } from "lucide-react";

export default function CalendlyWidget() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0B0B0B] to-[#0E0E0E]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Book Your <span className="gradient-gold-molten">Call</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            30 minutes. We analyze your business. You decide if it makes sense.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Clock, title: "30 Minutes", desc: "Focused session" },
            { icon: Zap, title: "Zero Pressure", desc: "No sales pitch" },
            { icon: Calendar, title: "Custom Strategy", desc: "For your business" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 text-center">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-2 shadow-2xl"
        >
          {/* Replace YOUR_CALENDLY_LINK with your actual Calendly scheduling link */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/your-calendly-link?hide_gdpr_banner=1&background_color=0b0b0b&text_color=ffffff&primary_color=d4af37"
            style={{ minWidth: '320px', height: '700px' }}
          />
        </motion.div>
      </div>
    </section>
  );
}