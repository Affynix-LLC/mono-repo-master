import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Users, Calendar, MessageSquare, TrendingUp, 
  DollarSign, Clock, Target, ArrowRight, CheckCircle2, Sparkles, RefreshCw, Send
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AdvancedCalculator() {
  const [step, setStep] = useState(1);
  const [agentType, setAgentType] = useState("");
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    user_email: "",
    user_company: "",
    current_call_volume_monthly: "",
    human_agents_count: "",
    current_cost_per_call: "",
    avg_call_duration_minutes: "",
    missed_calls_percentage: "",
    leads_per_month: "",
    conversion_rate_current: "",
    avg_revenue_per_conversion: ""
  });

  const agentOptions = [
    { value: "Phone Representative", icon: Phone, label: "AI Phone Rep", color: "from-blue-500 to-cyan-500" },
    { value: "Lead Qualifier", icon: Users, label: "Lead Qualifier", color: "from-purple-500 to-pink-500" },
    { value: "Appointment Setter", icon: Calendar, label: "Appointment Setter", color: "from-green-500 to-emerald-500" },
    { value: "Customer Support", icon: MessageSquare, label: "Customer Support", color: "from-orange-500 to-red-500" },
    { value: "Cold Caller", icon: TrendingUp, label: "Cold Caller", color: "from-yellow-500 to-amber-500" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateROI = () => {
    const callVolume = parseFloat(formData.current_call_volume_monthly) || 0;
    const humanAgents = parseFloat(formData.human_agents_count) || 1;
    const costPerCall = parseFloat(formData.current_cost_per_call) || 5;
    const missedCalls = parseFloat(formData.missed_calls_percentage) || 0;
    const leads = parseFloat(formData.leads_per_month) || 0;
    const conversionRate = parseFloat(formData.conversion_rate_current) || 10;
    const avgRevenue = parseFloat(formData.avg_revenue_per_conversion) || 1000;
    const avgDuration = parseFloat(formData.avg_call_duration_minutes) || 8;

    // AI pricing based on agent type
    const aiMonthlyBase = {
      "Phone Representative": 299,
      "Lead Qualifier": 449,
      "Appointment Setter": 249,
      "Customer Support": 399,
      "Cold Caller": 799
    }[agentType] || 299;

    const aiCostPerCall = agentType === "Cold Caller" ? 1.5 : 1.0;

    // Current costs
    const humanAgentSalary = humanAgents * 3500; // $3500/mo per agent
    const currentCallCost = callVolume * costPerCall;
    const totalCurrentCost = humanAgentSalary + currentCallCost;

    // AI costs
    const aiCallCost = callVolume * aiCostPerCall;
    const totalAICost = aiMonthlyBase + aiCallCost;

    // Direct cost savings
    const costSavings = totalCurrentCost - totalAICost;
    
    // Revenue recovery from missed calls
    const recoveredCalls = (callVolume * missedCalls) / 100;
    const recoveredLeads = recoveredCalls * 0.25; // 25% convert to leads
    const recoveredConversions = recoveredLeads * (conversionRate / 100);
    const recoveredRevenue = recoveredConversions * avgRevenue;

    // Time savings
    const hoursPerCall = avgDuration / 60;
    const currentHours = callVolume * hoursPerCall;
    const aiHandlesPercent = 0.80; // AI handles 80%
    const timeSaved = currentHours * aiHandlesPercent;

    // Total benefit
    const totalMonthlyBenefit = costSavings + recoveredRevenue;
    const roiPercent = totalAICost > 0 ? ((totalMonthlyBenefit / totalAICost) * 100) : 0;
    const paybackMonths = totalMonthlyBenefit > 0 ? (aiMonthlyBase / totalMonthlyBenefit) : 0;

    setResults({
      monthlyCostSavings: Math.round(costSavings),
      annualCostSavings: Math.round(costSavings * 12),
      timeSavedHours: Math.round(timeSaved),
      recoveredRevenue: Math.round(recoveredRevenue),
      annualRecoveredRevenue: Math.round(recoveredRevenue * 12),
      totalMonthlySavings: Math.round(totalMonthlyBenefit),
      totalAnnualSavings: Math.round(totalMonthlyBenefit * 12),
      roiPercent: Math.round(roiPercent),
      aiMonthlyCost: aiMonthlyBase,
      totalAICost: Math.round(totalAICost),
      paybackPeriod: Math.round(paybackMonths * 10) / 10,
      currentMonthlyCost: Math.round(totalCurrentCost)
    });

    setStep(3);
  };

  const saveCalculation = async () => {
    setSaving(true);
    try {
      await base44.entities.AICalculatorInputs.create({
        ...formData,
        selected_agent_type: agentType,
        calculated_cost_savings: results.monthlyCostSavings,
        calculated_time_saved: results.timeSavedHours,
        calculated_roi_percent: results.roiPercent
      });
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetCalculator = () => {
    setStep(1);
    setAgentType("");
    setResults(null);
    setFormData({
      user_email: "",
      user_company: "",
      current_call_volume_monthly: "",
      human_agents_count: "",
      current_cost_per_call: "",
      avg_call_duration_minutes: "",
      missed_calls_percentage: "",
      leads_per_month: "",
      conversion_rate_current: "",
      avg_revenue_per_conversion: ""
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#E6C878] to-[#D4AF37]" />
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              Advanced ROI Calculator
            </CardTitle>
            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
              Step {step} of 3
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Select Your AI Agent Type
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agentOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setAgentType(option.value);
                        setStep(2);
                      }}
                      className="group relative p-6 rounded-xl border-2 transition-all text-left hover:scale-105 bg-[#0E0E0E] border-[#D4AF37]/20 hover:border-[#D4AF37]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                      <option.icon className="w-10 h-10 text-[#D4AF37] mb-3 relative z-10" />
                      <div className="text-lg font-semibold text-white relative z-10">{option.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Enter Your Business Metrics
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-white"
                  >
                    ← Change Agent
                  </Button>
                </div>

                <Tabs defaultValue="business" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full bg-[#0E0E0E] border border-[#D4AF37]/20">
                    <TabsTrigger value="business" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                      Business Info
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                      Metrics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="business" className="space-y-4 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Your Email (Optional)</Label>
                        <Input
                          type="email"
                          value={formData.user_email}
                          onChange={(e) => handleInputChange("user_email", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="you@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Company Name (Optional)</Label>
                        <Input
                          value={formData.user_company}
                          onChange={(e) => handleInputChange("user_company", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="Acme Inc"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Monthly Call Volume *</Label>
                        <Input
                          type="number"
                          value={formData.current_call_volume_monthly}
                          onChange={(e) => handleInputChange("current_call_volume_monthly", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Human Agents</Label>
                        <Input
                          type="number"
                          value={formData.human_agents_count}
                          onChange={(e) => handleInputChange("human_agents_count", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Cost Per Call ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.current_cost_per_call}
                          onChange={(e) => handleInputChange("current_cost_per_call", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="5.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Avg Call Duration (min)</Label>
                        <Input
                          type="number"
                          value={formData.avg_call_duration_minutes}
                          onChange={(e) => handleInputChange("avg_call_duration_minutes", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Missed Calls (%)</Label>
                        <Input
                          type="number"
                          value={formData.missed_calls_percentage}
                          onChange={(e) => handleInputChange("missed_calls_percentage", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="25"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Leads/Month</Label>
                        <Input
                          type="number"
                          value={formData.leads_per_month}
                          onChange={(e) => handleInputChange("leads_per_month", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Conversion Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.conversion_rate_current}
                          onChange={(e) => handleInputChange("conversion_rate_current", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Avg Revenue/Sale ($)</Label>
                        <Input
                          type="number"
                          value={formData.avg_revenue_per_conversion}
                          onChange={(e) => handleInputChange("avg_revenue_per_conversion", e.target.value)}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-11"
                          placeholder="2500"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={calculateROI}
                  disabled={!formData.current_call_volume_monthly}
                  className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black py-6 text-lg font-semibold transition-all hover:scale-[1.02]"
                >
                  Calculate ROI
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {step === 3 && results && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-2">Your ROI Projection</h3>
                  <p className="text-gray-400">Based on {agentType} implementation</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        ${results.totalMonthlySavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Monthly Benefit</div>
                      <div className="text-xs text-green-400 mt-2">
                        ${results.totalAnnualSavings.toLocaleString()}/year
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {results.timeSavedHours.toLocaleString()}h
                      </div>
                      <div className="text-sm text-gray-400">Hours Saved/Month</div>
                      <div className="text-xs text-blue-400 mt-2">
                        {Math.round(results.timeSavedHours / 8)} work days
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-[#D4AF37]/40">
                    <CardContent className="p-6 text-center">
                      <Target className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {results.roiPercent}%
                      </div>
                      <div className="text-sm text-gray-400">ROI</div>
                      <div className="text-xs text-[#D4AF37] mt-2">
                        {results.paybackPeriod} month payback
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Breakdown */}
                <Card className="bg-[#0E0E0E] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Cost Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                        <span className="text-gray-400">Current Monthly Cost</span>
                        <span className="text-red-400 font-semibold">${results.currentMonthlyCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                        <span className="text-gray-400">AI Solution Cost</span>
                        <span className="text-white font-semibold">${results.totalAICost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                        <span className="text-gray-400">Cost Savings</span>
                        <span className="text-green-400 font-semibold">${results.monthlyCostSavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                        <span className="text-gray-400">Recovered Revenue</span>
                        <span className="text-green-400 font-semibold">+${results.recoveredRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 mt-2 border-t-2 border-[#D4AF37]/30">
                        <span className="text-white font-bold">Net Monthly Benefit</span>
                        <span className="text-[#D4AF37] font-bold text-xl">${results.totalMonthlySavings.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={saveCalculation}
                    disabled={saving}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#E6C878] text-black py-6"
                  >
                    {saving ? "Saving..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Save & Get Consultation
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="flex-1 border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 py-6"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}