import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, ArrowRight, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AgentConfigurationForm({ agentType, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    agent_type: agentType || "",
    client_name: "",
    client_email: "",
    company: "",
    phone: "",
    needs_phone_number: "",
    crm_system: "",
    current_workflow: "",
    agent_direction: "",
    needs_appointment_setting: "",
    needs_lead_qualification: "",
    required_languages: "",
    tier: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.IntakeSubmission.create({
        client_name: formData.client_name,
        client_email: formData.client_email,
        company: formData.company,
        phone: formData.phone,
        service_type: "Single Agent",
        business_challenges: `Agent Configuration: ${formData.agent_type}`,
        notes: `Agent: ${formData.agent_type} | Tier: ${formData.tier} | Phone: ${formData.needs_phone_number} | CRM: ${formData.crm_system} | Workflow: ${formData.current_workflow} | Direction: ${formData.agent_direction} | Appointments: ${formData.needs_appointment_setting} | Qualification: ${formData.needs_lead_qualification} | Languages: ${formData.required_languages}`,
        source: "Agent Configuration Form",
        status: "New"
      });

      try {
        await base44.functions.invoke('sendToZapier', formData);
      } catch (zapierError) {
        console.error('Zapier webhook failed:', zapierError);
      }

      setSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <Card className="backdrop-blur-xl bg-black/90 border border-[#10B981]/50 max-w-lg w-full">
          <CardContent className="p-8 text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Configuration Received!</h3>
            <p className="text-gray-300 mb-6">
              We'll reach out within 24 hours to finalize your {agentType} setup and schedule deployment.
            </p>
            <Button onClick={onClose} className="bg-[#D4AF37] hover:bg-[#E6C878] text-black">
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <Card className="backdrop-blur-xl bg-black/90 border border-[#D4AF37]/30 max-w-2xl w-full my-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Configure {agentType}</h3>
              <p className="text-sm text-gray-400">Complete this form to start your agent setup</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Your Name *</Label>
                <Input
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Email *</Label>
                <Input
                  required
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                  className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Company *</Label>
                <Input
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/20 pt-4 mt-4">
              <h4 className="text-sm font-bold text-white mb-3">Agent Configuration</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Select Tier *</Label>
                  <Select required value={formData.tier} onValueChange={(v) => setFormData({...formData, tier: v})}>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm">
                      <SelectValue placeholder="Choose tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="T1">Tier 1 (T1)</SelectItem>
                      <SelectItem value="T2">Tier 2 (T2)</SelectItem>
                      <SelectItem value="T3">Tier 3 (T3)</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Need phone number? *</Label>
                  <Select required value={formData.needs_phone_number} onValueChange={(v) => setFormData({...formData, needs_phone_number: v})}>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">CRM System *</Label>
                  <Input
                    required
                    value={formData.crm_system}
                    onChange={(e) => setFormData({...formData, crm_system: e.target.value})}
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                    placeholder="HubSpot, Salesforce, etc."
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Direction *</Label>
                  <Select required value={formData.agent_direction} onValueChange={(v) => setFormData({...formData, agent_direction: v})}>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Inbound">Inbound</SelectItem>
                      <SelectItem value="Outbound">Outbound</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Appointment Setting? *</Label>
                  <Select required value={formData.needs_appointment_setting} onValueChange={(v) => setFormData({...formData, needs_appointment_setting: v})}>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Lead Qualification? *</Label>
                  <Select required value={formData.needs_lead_qualification} onValueChange={(v) => setFormData({...formData, needs_lead_qualification: v})}>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-300 text-xs mb-1.5 block">Languages Required *</Label>
                  <Input
                    required
                    value={formData.required_languages}
                    onChange={(e) => setFormData({...formData, required_languages: e.target.value})}
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                    placeholder="English, Spanish, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-300 text-xs mb-1.5 block">Current Workflow *</Label>
                  <Input
                    required
                    value={formData.current_workflow}
                    onChange={(e) => setFormData({...formData, current_workflow: e.target.value})}
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white h-9 text-sm"
                    placeholder="Describe your current system..."
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black h-10 text-sm font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Configuration
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}