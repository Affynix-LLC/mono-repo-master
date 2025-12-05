import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentSuccess() {
  const [sessionId, setSessionId] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get('session_id') || '');
    setProduct(urlParams.get('product') || '');
    setAmount(urlParams.get('amount') || '');
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="backdrop-blur-xl bg-black/60 border border-[#10B981]/50 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Thank you for choosing Affynix. Your automation journey starts now.
            </p>

            {product && (
              <div className="bg-[#0E0E0E] rounded-lg p-6 mb-8 border border-[#D4AF37]/20">
                <div className="text-sm text-gray-400 mb-2">You purchased:</div>
                <div className="text-xl font-semibold text-white">{product}</div>
                {amount && <div className="text-2xl font-bold text-[#D4AF37] mt-2">{amount}</div>}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <strong>Check your email</strong> - We've sent you a confirmation with next steps
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <strong>Complete the questionnaire</strong> - Help us integrate with your systems
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <strong>We handle the rest</strong> - Our team will set everything up for you
                </div>
              </div>
            </div>

            <Link to={createPageUrl("OnboardingQuestionnaire", `?session_id=${sessionId}`)}>
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-10 py-6 text-lg font-semibold mb-4 w-full"
              >
                Complete Integration Questionnaire
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link to={createPageUrl("Home")}>
              <Button
                size="lg"
                variant="ghost"
                className="text-gray-400 hover:text-white w-full"
              >
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}