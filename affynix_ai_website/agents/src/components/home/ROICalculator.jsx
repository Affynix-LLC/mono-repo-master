import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Clock, DollarSign, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ROICalculator() {
  const [step, setStep] = useState(1);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState(null);
  
  const [formData, setFormData] = useState({
    roleTitle: "",
    monthlyCostPerEmployee: "",
    numberOfEmployees: "",
    tasksPerMonth: "",
    emailHours: "",
    dataEntryHours: "",
    followupHours: "",
    errorCorrectionHours: "",
    reportingHours: "",
    otherHours: "",
    emailAutomation: 60,
    dataEntryAutomation: 80,
    followupAutomation: 70,
    errorCorrectionAutomation: 50,
    reportingAutomation: 65,
    otherAutomation: 40,
    userEmail: "",
    userCompany: ""
  });

  const roleOptions = [
    "Sales Representative",
    "Admin Assistant",
    "Support Agent",
    "Data Entry Clerk",
    "Account Manager",
    "Operations Coordinator",
    "Marketing Specialist",
    "Custom Role"
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateImpact = async () => {
    setCalculating(true);
    
    // Calculate totals
    const totalHours = 
      parseFloat(formData.emailHours || 0) +
      parseFloat(formData.dataEntryHours || 0) +
      parseFloat(formData.followupHours || 0) +
      parseFloat(formData.errorCorrectionHours || 0) +
      parseFloat(formData.reportingHours || 0) +
      parseFloat(formData.otherHours || 0);

    const timeSaved = 
      (parseFloat(formData.emailHours || 0) * formData.emailAutomation / 100) +
      (parseFloat(formData.dataEntryHours || 0) * formData.dataEntryAutomation / 100) +
      (parseFloat(formData.followupHours || 0) * formData.followupAutomation / 100) +
      (parseFloat(formData.errorCorrectionHours || 0) * formData.errorCorrectionAutomation / 100) +
      (parseFloat(formData.reportingHours || 0) * formData.reportingAutomation / 100) +
      (parseFloat(formData.otherHours || 0) * formData.otherAutomation / 100);

    const monthlyCost = parseFloat(formData.monthlyCostPerEmployee);
    const numEmployees = parseFloat(formData.numberOfEmployees);
    const hourlyRate = monthlyCost / 160; // Assuming 160 working hours per month
    
    const costSavings = timeSaved * hourlyRate * numEmployees;
    const totalMonthlyCost = monthlyCost * numEmployees;
    const roiPercent = totalMonthlyCost > 0 ? (costSavings / totalMonthlyCost) * 100 : 0;

    const calculatedResults = {
      timeSaved: timeSaved * numEmployees,
      costSavings: costSavings,
      roiPercent: roiPercent,
      equivalentEmployees: (timeSaved * numEmployees) / 160,
      automationScore: (
        formData.emailAutomation +
        formData.dataEntryAutomation +
        formData.followupAutomation +
        formData.errorCorrectionAutomation +
        formData.reportingAutomation +
        formData.otherAutomation
      ) / 6
    };

    // Save to database
    try {
      await base44.entities.AICalculatorInputs.create({
        role_title: formData.roleTitle,
        monthly_cost_per_employee: monthlyCost,
        number_of_employees: numEmployees,
        tasks_per_month: parseFloat(formData.tasksPerMonth || 0),
        email_hours: parseFloat(formData.emailHours || 0),
        data_entry_hours: parseFloat(formData.dataEntryHours || 0),
        followup_hours: parseFloat(formData.followupHours || 0),
        error_correction_hours: parseFloat(formData.errorCorrectionHours || 0),
        reporting_hours: parseFloat(formData.reportingHours || 0),
        other_hours: parseFloat(formData.otherHours || 0),
        email_automation_percent: formData.emailAutomation,
        data_entry_automation_percent: formData.dataEntryAutomation,
        followup_automation_percent: formData.followupAutomation,
        error_correction_automation_percent: formData.errorCorrectionAutomation,
        reporting_automation_percent: formData.reportingAutomation,
        other_automation_percent: formData.otherAutomation,
        calculated_time_saved: calculatedResults.timeSaved,
        calculated_cost_savings: calculatedResults.costSavings,
        calculated_roi_percent: calculatedResults.roiPercent,
        user_email: formData.userEmail || null,
        user_company: formData.userCompany || null
      });
    } catch (error) {
      console.error('Failed to save calculator data:', error);
    }

    setResults(calculatedResults);
    setCalculating(false);
    setStep(4);
  };

  const resetCalculator = () => {
    setStep(1);
    setResults(null);
    setFormData({
      roleTitle: "",
      monthlyCostPerEmployee: "",
      numberOfEmployees: "",
      tasksPerMonth: "",
      emailHours: "",
      dataEntryHours: "",
      followupHours: "",
      errorCorrectionHours: "",
      reportingHours: "",
      otherHours: "",
      emailAutomation: 60,
      dataEntryAutomation: 80,
      followupAutomation: 70,
      errorCorrectionAutomation: 50,
      reportingAutomation: 65,
      otherAutomation: 40,
      userEmail: "",
      userCompany: ""
    });
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#0B0B0B]">
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="backdrop-blur-xl bg-[#C6A45E]/20 border border-[#C6A45E]/50 text-[#C6A45E] mb-6 px-4 py-2 text-sm shadow-[0_0_20px_rgba(198,164,94,0.3)]">
            INTERACTIVE TOOL
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            AI Impact Estimator
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Calculate exactly how much time and money AI automation can save your team.
            Get a detailed breakdown based on your specific workflows.
          </p>
        </motion.div>

        <Card className="backdrop-blur-xl bg-[#111111]/60 border-2 border-[#C6A45E]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <CardContent className="p-8 md:p-12">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    s < step ? 'bg-[#10B981] text-white' :
                    s === step ? 'bg-[#C6A45E] text-white' :
                    'bg-[#111111] border-2 border-[#C6A45E]/30 text-gray-500'
                  }`}>
                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      s < step ? 'bg-[#10B981]' : 'bg-[#C6A45E]/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Role & Workload */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Step 1: Role & Workload Data</h3>
                
                <div>
                  <Label className="text-gray-300 mb-2 block">Role Title / Function *</Label>
                  <Select value={formData.roleTitle} onValueChange={(value) => handleInputChange('roleTitle', value)}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      {roleOptions.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Monthly Cost per Employee ($) *</Label>
                    <Input
                      type="number"
                      value={formData.monthlyCostPerEmployee}
                      onChange={(e) => handleInputChange('monthlyCostPerEmployee', e.target.value)}
                      placeholder="e.g., 5000"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Include salary + benefits</p>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Number of Employees *</Label>
                    <Input
                      type="number"
                      value={formData.numberOfEmployees}
                      onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                      placeholder="e.g., 5"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Estimated Tasks per Month</Label>
                  <Input
                    type="number"
                    value={formData.tasksPerMonth}
                    onChange={(e) => handleInputChange('tasksPerMonth', e.target.value)}
                    placeholder="e.g., 500"
                    className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total count of emails, CRM updates, scheduling, data entry, etc.</p>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.roleTitle || !formData.monthlyCostPerEmployee || !formData.numberOfEmployees}
                  className="w-full bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white py-6 text-lg"
                >
                  Continue to Time Distribution
                </Button>
              </motion.div>
            )}

            {/* Step 2: Time Distribution */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Step 2: Time Distribution</h3>
                <p className="text-gray-400 mb-6">Enter approximate hours spent per month on each task type</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Emails / Communication (hrs/month)</Label>
                    <Input
                      type="number"
                      value={formData.emailHours}
                      onChange={(e) => handleInputChange('emailHours', e.target.value)}
                      placeholder="e.g., 40"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Data Entry / CRM Updates (hrs/month)</Label>
                    <Input
                      type="number"
                      value={formData.dataEntryHours}
                      onChange={(e) => handleInputChange('dataEntryHours', e.target.value)}
                      placeholder="e.g., 30"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Customer Follow-up / Outreach (hrs/month)</Label>
                    <Input
                      type="number"
                      value={formData.followupHours}
                      onChange={(e) => handleInputChange('followupHours', e.target.value)}
                      placeholder="e.g., 25"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Error Correction / QA (hrs/month)</Label>
                    <Input
                      type="number"
                      value={formData.errorCorrectionHours}
                      onChange={(e) => handleInputChange('errorCorrectionHours', e.target.value)}
                      placeholder="e.g., 15"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Reporting / Analytics (hrs/month)</Label>
                    <Input
                      type="number"
                      value={formData.reportingHours}
                      onChange={(e) => handleInputChange('reportingHours', e.target.value)}
                      placeholder="e.g., 20"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Other Tasks (hrs/month)</Label>
                    <Input
                      type="number"
                      value={formData.otherHours}
                      onChange={(e) => handleInputChange('otherHours', e.target.value)}
                      placeholder="e.g., 10"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-[#C6A45E]/30 text-gray-300"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white py-6 text-lg"
                  >
                    Continue to Automation Impact
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: AI Optimization */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Step 3: AI Automation Potential</h3>
                <p className="text-gray-400 mb-6">Adjust sliders to set expected automation percentage for each task type</p>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Emails / Communication</Label>
                      <Badge className="bg-[#12F4FF]/20 text-[#12F4FF]">{formData.emailAutomation}%</Badge>
                    </div>
                    <Slider
                      value={[formData.emailAutomation]}
                      onValueChange={(value) => handleInputChange('emailAutomation', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Data Entry / CRM Updates</Label>
                      <Badge className="bg-[#12F4FF]/20 text-[#12F4FF]">{formData.dataEntryAutomation}%</Badge>
                    </div>
                    <Slider
                      value={[formData.dataEntryAutomation]}
                      onValueChange={(value) => handleInputChange('dataEntryAutomation', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Customer Follow-up / Outreach</Label>
                      <Badge className="bg-[#12F4FF]/20 text-[#12F4FF]">{formData.followupAutomation}%</Badge>
                    </div>
                    <Slider
                      value={[formData.followupAutomation]}
                      onValueChange={(value) => handleInputChange('followupAutomation', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Error Correction / QA</Label>
                      <Badge className="bg-[#12F4FF]/20 text-[#12F4FF]">{formData.errorCorrectionAutomation}%</Badge>
                    </div>
                    <Slider
                      value={[formData.errorCorrectionAutomation]}
                      onValueChange={(value) => handleInputChange('errorCorrectionAutomation', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Reporting / Analytics</Label>
                      <Badge className="bg-[#12F4FF]/20 text-[#12F4FF]">{formData.reportingAutomation}%</Badge>
                    </div>
                    <Slider
                      value={[formData.reportingAutomation]}
                      onValueChange={(value) => handleInputChange('reportingAutomation', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Other Tasks</Label>
                      <Badge className="bg-[#12F4FF]/20 text-[#12F4FF]">{formData.otherAutomation}%</Badge>
                    </div>
                    <Slider
                      value={[formData.otherAutomation]}
                      onValueChange={(value) => handleInputChange('otherAutomation', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="border-t border-[#C6A45E]/20 pt-6 space-y-4">
                  <p className="text-gray-400 text-sm">Optional: Help us personalize your results</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => handleInputChange('userEmail', e.target.value)}
                      placeholder="Your email (optional)"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                    <Input
                      value={formData.userCompany}
                      onChange={(e) => handleInputChange('userCompany', e.target.value)}
                      placeholder="Company name (optional)"
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 border-[#C6A45E]/30 text-gray-300"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={calculateImpact}
                    disabled={calculating}
                    className="flex-1 bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white py-6 text-lg"
                  >
                    {calculating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate Impact'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && results && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C6A45E] to-[#12F4FF] flex items-center justify-center shadow-[0_0_40px_rgba(18,244,255,0.4)]">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Your AI Impact Report</h3>
                  <p className="text-gray-400">Based on {formData.roleTitle} role analysis</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="backdrop-blur-xl bg-[#0B0B0B]/60 border border-[#C6A45E]/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#10B981] flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Monthly Time Saved</div>
                          <div className="text-3xl font-bold text-white">{Math.round(results.timeSaved)} hrs</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Equivalent to <strong className="text-[#10B981]">{results.equivalentEmployees.toFixed(1)} full-time employees</strong>
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-[#0B0B0B]/60 border border-[#C6A45E]/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Monthly Cost Savings</div>
                          <div className="text-3xl font-bold text-white">${Math.round(results.costSavings).toLocaleString()}</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        <strong className="text-[#3B82F6]">${Math.round(results.costSavings * 12).toLocaleString()}</strong> annual savings
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-[#0B0B0B]/60 border border-[#C6A45E]/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">ROI Percentage</div>
                          <div className="text-3xl font-bold text-white">{results.roiPercent.toFixed(1)}%</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Return on automation investment
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-[#0B0B0B]/60 border border-[#C6A45E]/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F59E0B] flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Automation Score</div>
                          <div className="text-3xl font-bold text-white">{Math.round(results.automationScore)}%</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Average automation potential
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="backdrop-blur-xl bg-[#C6A45E]/10 border border-[#C6A45E]/30 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C6A45E]" />
                    Next Steps
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Request a diagnostic audit to validate these projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Get a custom automation blueprint for your team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Deploy AI agents and start realizing savings within weeks</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="flex-1 border-[#C6A45E]/30 text-gray-300"
                  >
                    Calculate Another Role
                  </Button>
                  <Button
                    onClick={() => window.location.href = '#contact'}
                    className="flex-1 bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white py-6 text-lg"
                  >
                    Get Your Blueprint
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}