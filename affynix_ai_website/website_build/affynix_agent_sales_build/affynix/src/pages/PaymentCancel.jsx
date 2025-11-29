import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="backdrop-blur-xl bg-black/60 border border-[#F59E0B]/50">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#F59E0B] flex items-center justify-center">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Cancelled
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              No worries! Your payment was not processed. You can try again whenever you're ready.
            </p>

            <div className="space-y-4">
              <Link to={createPageUrl("Pricing")}>
                <Button
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-10 py-6 text-lg font-semibold w-full"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Return to Pricing
                </Button>
              </Link>

              <Link to={createPageUrl("Home")}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-gray-400 hover:text-white w-full"
                >
                  Go to Home
                </Button>
              </Link>

              <div className="pt-6">
                <p className="text-gray-400 text-sm mb-4">Need help deciding?</p>
                <a href="#contact">
                  <Button variant="outline" className="border-[#D4AF37]/30 text-gray-300">
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}