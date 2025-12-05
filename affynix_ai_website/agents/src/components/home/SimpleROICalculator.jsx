
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function SimpleROICalculator() {
  const [employees, setEmployees] = useState("");
  const [avgSalary, setAvgSalary] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateQuickROI = () => {
    const numEmployees = parseFloat(employees) || 0;
    const salary = parseFloat(avgSalary) || 0;
    
    // Assuming 30% time savings for employees and a simple ROI calculation
    const timeSaved = numEmployees * 0.3 * 160; // 30% of 160 hours/month per employee
    const monthlySavings = (salary * 0.3 * numEmployees); // 30% of average salary saved
    const annualSavings = monthlySavings * 12;
    
    return {
      timeSaved: Math.round(timeSaved),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      roi: 450 // This seems to be a placeholder or fixed value, keeping it as is.
    };
  };

  const results = showResults ? calculateQuickROI() : null;

  return (
    <section className="py-16 relative overflow-hidden bg-[#0E0E0E]">
      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-4 py-2 text-sm">
            QUICK ESTIMATE
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            What Could AI Save Your Team?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get an instant estimate with 2 simple inputs
          </p>
        </motion.div>

        <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
          <CardContent className="p-8">
            {!showResults ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Number of Employees</Label>
                    <Input
                      type="number"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      placeholder="e.g., 10"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6 focus:border-[#00FFFF] transition-colors"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Average Monthly Salary ($)</Label>
                    <Input
                      type="number"
                      value={avgSalary}
                      onChange={(e) => setAvgSalary(e.target.value)}
                      placeholder="e.g., 5000"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6 focus:border-[#00FFFF] transition-colors"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setShowResults(true)}
                  disabled={!employees || !avgSalary}
                  size="lg"
                  className="w-full bg-[#D4AF37] hover:bg-[#E6C878] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] text-black py-6 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calculate Savings
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Your Quick Estimate</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 rounded-xl p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {results.timeSaved}
                    </div>
                    <div className="text-gray-400 text-sm">Hours Saved/Month</div>
                  </div>

                  <div className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 rounded-xl p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      ${results.monthlySavings.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Monthly Savings</div>
                  </div>

                  <div className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 rounded-xl p-6 text-center">
                    <div className="text-4xl font-bold text-[#D4AF37] mb-2">
                      ${results.annualSavings.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Annual Savings</div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 rounded-xl p-6 text-center">
                  <p className="text-gray-300 mb-2">
                    Your team could save approximately <strong className="text-[#D4AF37]">{results.timeSaved} hours per month</strong> and <strong className="text-[#D4AF37]">${results.annualSavings.toLocaleString()} annually</strong>
                  </p>
                  <p className="text-gray-500 text-sm">
                    *Based on 30% average time automation
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={() => setShowResults(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-[#D4AF37]/30 text-gray-300 hover:border-[#00FFFF] hover:text-[#00FFFF] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                  >
                    Recalculate
                  </Button>
                  <Link to={createPageUrl("Onboarding")} className="flex-1">
                    <Button
                      size="lg"
                      className="w-full bg-[#D4AF37] hover:bg-[#E6C878] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] text-black py-6 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Get Detailed Analysis
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
