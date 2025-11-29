import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";
import ROICalculator from "../components/home/ROICalculator.jsx";
import ContactSection from "../components/home/ContactSection.jsx";

export default function Onboarding() {
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      id: 'calculator',
      title: 'Calculate Your Impact',
      description: 'Use our AI Impact Estimator to see potential savings',
      icon: Sparkles,
      color: '#C6A45E'
    },
    {
      id: 'contact',
      title: 'Request Diagnostic',
      description: 'Schedule your free workflow audit',
      icon: Clock,
      color: '#3B82F6'
    },
    {
      id: 'complete',
      title: 'Get Your Blueprint',
      description: "We'll deliver a custom automation strategy",
      icon: CheckCircle2,
      color: '#10B981'
    }
  ];

  useEffect(() => {
    // Track if user has scrolled to calculator
    const handleScroll = () => {
      const calculatorSection = document.getElementById('impact-calculator');
      if (calculatorSection) {
        const rect = calculatorSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && !completedSteps.includes('calculator')) {
          setCompletedSteps([...completedSteps, 'calculator']);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [completedSteps]);

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C6A45E]/10 via-transparent to-[#12F4FF]/10"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
              ONBOARDING PATHWAY
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Start Your <span className="text-[#C6A45E]">Automation Journey</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to transform your business operations with AI automation
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`backdrop-blur-xl bg-[#111111]/60 border-2 transition-all duration-300 ${
                  completedSteps.includes(step.id) 
                    ? 'border-[#10B981]/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                    : 'border-[#C6A45E]/20'
                }`}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ 
                          backgroundColor: completedSteps.includes(step.id) ? '#10B981' : step.color 
                        }}
                      >
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      {completedSteps.includes(step.id) && (
                        <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Step {index + 1}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA to scroll down */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={() => document.getElementById('impact-calculator')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white px-8 py-6 text-lg"
            >
              Begin Step 1
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Detailed ROI Calculator */}
      <div id="impact-calculator">
        <ROICalculator />
      </div>

      {/* Contact/Diagnostic Section */}
      <div id="request-diagnostic">
        <ContactSection />
      </div>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden bg-[#111111]">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#C6A45E] to-[#12F4FF] flex items-center justify-center shadow-[0_0_40px_rgba(18,244,255,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Build Your Automation Infrastructure?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Our team will review your submission and reach out within 24 hours to schedule your diagnostic audit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="border-[#C6A45E]/30 text-gray-300 px-8 py-6 text-lg"
              >
                Return Home
              </Button>
              <Button
                size="lg"
                onClick={() => document.getElementById('request-diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white px-8 py-6 text-lg"
              >
                Schedule Diagnostic
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}