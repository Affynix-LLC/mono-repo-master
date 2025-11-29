import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Clock, DollarSign, Users, ArrowRight, RefreshCw } from "lucide-react";

export default function SimpleCalculator() {
  const [employees, setEmployees] = useState("");
  const [avgSalary, setAvgSalary] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateSavings = () => {
    const numEmployees = parseFloat(employees) || 0;
    const salary = parseFloat(avgSalary) || 0;
    
    // Conservative 30% time savings assumption
    const hoursPerMonth = 160; // Standard work month
    const timeSavedPercent = 0.30;
    
    const timeSaved = numEmployees * hoursPerMonth * timeSavedPercent;
    const costPerHour = salary / hoursPerMonth;
    const monthlySavings = timeSaved * costPerHour;
    const annualSavings = monthlySavings * 12;
    
    return {
      timeSaved: Math.round(timeSaved),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      perEmployee: Math.round(annualSavings / numEmployees)
    };
  };

  const results = showResults ? calculateSavings() : null;

  const handleCalculate = () => {
    if (employees && avgSalary) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setEmployees("");
    setAvgSalary("");
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#E6C878] to-[#D4AF37]" />
        
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Badge className="backdrop-blur-xl bg-black/80 border border-[#D4AF37]/30 text-[#D4AF37] mb-4 px-4 py-2">
              QUICK ESTIMATE
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              What Could You Save?
            </h2>
            <p className="text-gray-400 text-lg">
              2 simple inputs. Instant results.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Number of Employees
                    </Label>
                    <Input
                      type="number"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      placeholder="e.g., 10"
                      min="1"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-12 text-lg focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                      Average Monthly Salary
                    </Label>
                    <Input
                      type="number"
                      value={avgSalary}
                      onChange={(e) => setAvgSalary(e.target.value)}
                      placeholder="e.g., 5000"
                      min="1"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-12 text-lg focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!employees || !avgSalary}
                  size="lg"
                  className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black font-semibold py-6 text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calculate My Savings
                </Button>

                <p className="text-center text-xs text-gray-500">
                  Based on industry average of 30% time automation
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E6C878] flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your Potential Savings</h3>
                  <p className="text-gray-400">Based on {employees} employees at ${parseFloat(avgSalary).toLocaleString()}/mo each</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {results.timeSaved.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Hours Saved/Month</div>
                      <div className="text-xs text-blue-400 mt-2">
                        {Math.round(results.timeSaved / 8)} work days
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">
                        ${results.monthlySavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Monthly Savings</div>
                      <div className="text-xs text-green-400 mt-2">
                        Save every month
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-[#D4AF37]/40">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                      <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                        ${results.annualSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Annual Savings</div>
                      <div className="text-xs text-[#D4AF37] mt-2">
                        ${results.perEmployee.toLocaleString()}/employee
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-[#0E0E0E] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold mb-2">Your Automation Potential</p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Your team could save approximately <span className="text-[#D4AF37] font-semibold">{results.timeSaved.toLocaleString()} hours</span> per month, 
                          translating to <span className="text-[#D4AF37] font-semibold">${results.annualSavings.toLocaleString()}</span> in annual savings. 
                          That's <span className="text-[#D4AF37] font-semibold">${results.perEmployee.toLocaleString()}</span> saved per employee each year.
                        </p>
                        <p className="text-gray-500 text-xs mt-3">
                          *Conservative estimate based on 30% time automation across standard business operations
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 py-6"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Calculate Again
                  </Button>
                  <a href="#contact" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black py-6 font-semibold"
                    >
                      Get Custom Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}