import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator as CalcIcon, Zap } from "lucide-react";
import SimpleCalculator from "../components/calculators/SimpleCalculator.jsx";
import AdvancedCalculator from "../components/calculators/AdvancedCalculator.jsx";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("simple");

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-6 py-2 text-sm">
            ROI CALCULATORS
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            Calculate Your <span className="gradient-gold-molten">AI Savings</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose between a quick estimate or detailed ROI analysis to see how much you could save with AI automation
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-[#0E0E0E] border border-[#D4AF37]/20 mb-12 h-14">
              <TabsTrigger 
                value="simple" 
                className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-base font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Estimate
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-base font-semibold"
              >
                <CalcIcon className="w-4 h-4 mr-2" />
                Detailed ROI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="mt-8">
              <SimpleCalculator />
            </TabsContent>

            <TabsContent value="advanced" className="mt-8">
              <AdvancedCalculator />
            </TabsContent>
          </Tabs>
        </div>

        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            All calculations are estimates based on industry averages. Actual results may vary.
            <br />
            <span className="text-[#D4AF37]">Schedule a free consultation</span> for a personalized analysis.
          </p>
        </motion.div>
      </div>
    </div>
  );
}