import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Users, Calendar, MessageSquare, TrendingUp, 
  DollarSign, Clock, Target, ArrowRight, CheckCircle2, Sparkles 
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AgentROICalculator() {
  const [step, setStep] = useState(1);
  const [agentType, setAgentType] = useState("");
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    user_email: "",
    user_company: "",
    
    // Agent-specific metrics
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
    { value: "Phone Representative", icon: Phone, label: "AI Phone Representative" },
    { value: "Lead Qualifier", icon: Users, label: "AI Lead Qualifier" },
    { value: "Appointment Setter", icon: Calendar, label: "AI Appointment Setter" },
    { value: "Customer Support", icon: MessageSquare, label: "AI Customer Support" },
    { value: "Cold Caller", icon: TrendingUp, label: "AI Cold Caller" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateROI = () => {
    const callVolume = parseFloat(formData.current_call_volume_monthly) || 0;
    const humanAgents = parseFloat(formData.human_agents_count) || 0;
    const costPerCall = parseFloat(formData.current_cost_per_call) || 0;
    const missedCalls = parseFloat(formData.missed_calls_percentage) || 0;
    const leads = parseFloat(formData.leads_per_month) || 0;
    const conversionRate = parseFloat(formData.conversion_rate_current) || 0;
    const avgRevenue = parseFloat(formData.avg_revenue_per_conversion) || 0;

    // AI cost estimation (roughly $0.50-$2 per call depending on complexity)
    const aiCostPerCall = agentType === "Cold Caller" ? 1.5 : 1.0;
    const aiMonthlyCost = agentType === "Phone Representative" ? 299 : 
                         agentType === "Lead Qualifier" ? 449 : 
                         agentType === "Cold Caller" ? 799 : 249;

    // Calculate current costs
    const currentMonthlyCost = callVolume * costPerCall;
    const humanAgentSalary = humanAgents * 3500; // Estimate $3500/mo per agent

    // Calculate AI costs
    const aiCallHandlingCost = callVolume * aiCostPerCall;
    const totalAICost = aiMonthlyCost + aiCallHandlingCost;

    // Calculate savings
    const costSavings = currentMonthlyCost + humanAgentSalary - totalAICost;
    
    // Calculate recovered revenue from missed calls
    const recoveredCalls = (callVolume * missedCalls) / 100;
    const recoveredLeads = recoveredCalls * 0.3; // 30% become leads
    const recoveredRevenue = recoveredLeads * (conversionRate / 100) * avgRevenue;

    // Calculate time savings (assuming 80% automation efficiency)
    const hoursPerCall = (parseFloat(formData.avg_call_duration_minutes) || 10) / 60;
    const timeSaved = callVolume * hoursPerCall * 0.8;

    // ROI calculation
    const totalBenefit = costSavings + recoveredRevenue;
    const roiPercent = (totalBenefit / totalAICost) * 100;

    setResults({
      monthlyCostSavings: Math.round(costSavings),
      annualCostSavings: Math.round(costSavings * 12),
      timeSavedHours: Math.round(timeSaved),
      recoveredRevenue: Math.round(recoveredRevenue),
      annualRecoveredRevenue: Math.round(recoveredRevenue * 12),
      totalMonthlySavings: Math.round(totalBenefit),
      totalAnnualSavings: Math.round(totalBenefit * 12),
      roiPercent: Math.round(roiPercent),
      aiMonthlyCost: aiMonthlyCost,
      paybackPeriod: Math.round(aiMonthlyCost / totalBenefit * 10) / 10
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
      console.error("Failed to save calculation:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            Agent ROI Calculator
          </CardTitle>
          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
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
            >
              <h3 className="text-xl font-bold text-white mb-6">Select Your AI Agent Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {agentOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setAgentType(option.value);
                      setStep(2);
                    }}
                    className={`p-6 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                      agentType === option.value
                        ? "border-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-[#D4AF37]/20 bg-[#0E0E0E]"
                    }`}
                  >
                    <option.icon className="w-10 h-10 text-[#D4AF37] mb-3" />
                    <div className="text-lg font-semibold text-white">{option.label}</div>
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
                  ← Change Agent Type
                </Button>
              </div>

              <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-[#0E0E0E]">
                  <TabsTrigger value="business">Business Info</TabsTrigger>
                  <TabsTrigger value="metrics">Current Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Your Email (Optional)</Label>
                      <Input
                        type="email"
                        value={formData.user_email}
                        onChange={(e) => handleInputChange("user_email", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Company Name (Optional)</Label>
                      <Input
                        value={formData.user_company}
                        onChange={(e) => handleInputChange("user_company", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="Acme Inc"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Monthly Call Volume *</Label>
                      <Input
                        type="number"
                        value={formData.current_call_volume_monthly}
                        onChange={(e) => handleInputChange("current_call_volume_monthly", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Human Agents Currently</Label>
                      <Input
                        type="number"
                        value={formData.human_agents_count}
                        onChange={(e) => handleInputChange("human_agents_count", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Cost Per Call (Current)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.current_cost_per_call}
                        onChange={(e) => handleInputChange("current_cost_per_call", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="5.00"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Avg Call Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.avg_call_duration_minutes}
                        onChange={(e) => handleInputChange("avg_call_duration_minutes", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Missed Calls (%)</Label>
                      <Input
                        type="number"
                        value={formData.missed_calls_percentage}
                        onChange={(e) => handleInputChange("missed_calls_percentage", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Leads Per Month</Label>
                      <Input
                        type="number"
                        value={formData.leads_per_month}
                        onChange={(e) => handleInputChange("leads_per_month", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="200"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Current Conversion Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.conversion_rate_current}
                        onChange={(e) => handleInputChange("conversion_rate_current", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Avg Revenue Per Sale ($)</Label>
                      <Input
                        type="number"
                        value={formData.avg_revenue_per_conversion}
                        onChange={(e) => handleInputChange("avg_revenue_per_conversion", e.target.value)}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        placeholder="2500"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={calculateROI}
                disabled={!formData.current_call_volume_monthly}
                className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black py-6 text-lg mt-6"
              >
                Calculate My ROI
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {step === 3 && results && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">Your ROI Projection</h3>
                <p className="text-gray-400">Based on your {agentType} implementation</p>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">
                      ${results.totalMonthlySavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Monthly Savings</div>
                    <div className="text-xs text-green-400 mt-2">
                      ${results.totalAnnualSavings.toLocaleString()}/year
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">
                      {results.timeSavedHours}h
                    </div>
                    <div className="text-sm text-gray-400">Hours Saved/Month</div>
                    <div className="text-xs text-blue-400 mt-2">
                      {Math.round(results.timeSavedHours / 8)} work days
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-[#D4AF37]/30">
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

              {/* Detailed Breakdown */}
              <Card className="bg-[#0E0E0E] border-[#D4AF37]/20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                      <span className="text-gray-400">Cost Savings (Labor)</span>
                      <span className="text-white font-semibold">
                        ${results.monthlyCostSavings.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                      <span className="text-gray-400">Recovered Revenue</span>
                      <span className="text-green-400 font-semibold">
                        +${results.recoveredRevenue.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                      <span className="text-gray-400">AI Agent Cost</span>
                      <span className="text-red-400 font-semibold">
                        -${results.aiMonthlyCost}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 mt-2 border-t-2 border-[#D4AF37]/30">
                      <span className="text-white font-bold">Net Monthly Benefit</span>
                      <span className="text-[#D4AF37] font-bold text-xl">
                        ${results.totalMonthlySavings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={saveCalculation}
                  disabled={saving}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#E6C878] text-black py-6"
                >
                  {saving ? "Saving..." : "Save & Get Free Consultation"}
                </Button>
                <Button
                  onClick={() => {
                    setStep(1);
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
                  }}
                  variant="outline"
                  className="flex-1 border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 py-6"
                >
                  Calculate Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}