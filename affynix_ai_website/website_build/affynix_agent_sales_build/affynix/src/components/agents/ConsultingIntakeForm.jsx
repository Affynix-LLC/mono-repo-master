import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ConsultingIntakeForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      client_name: formData.get("client_name"),
      client_email: formData.get("client_email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      service_type: formData.get("service_type"),
      business_challenges: formData.get("business_challenges"),
      current_revenue: formData.get("current_revenue"),
      team_size: formData.get("team_size"),
      notes: `Agent Config: Phone Number: ${formData.get("needs_phone_number")}, CRM: ${formData.get("crm_system")}, Current Workflow: ${formData.get("current_workflow")}, Direction: ${formData.get("agent_direction")}, Appointment Setting: ${formData.get("needs_appointment_setting")}, Lead Qualification: ${formData.get("needs_lead_qualification")}, Languages: ${formData.get("required_languages")}. Additional Notes: ${formData.get("notes") || 'None'}`,
      source: "Agents Page - Consulting Intake",
      status: "New"
    };

    try {
      await base44.entities.IntakeSubmission.create(data);
      
      try {
        await base44.functions.invoke('sendToZapier', data);
      } catch (zapierError) {
        console.error('Zapier webhook failed:', zapierError);
      }
      
      setSuccess(true);
      e.target.reset();
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
        className="max-w-2xl mx-auto"
      >
        <Card className="backdrop-blur-xl bg-black/60 border border-[#10B981]/50">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Thank You! 🎉</h3>
            <p className="text-xl text-gray-300 mb-6">
              We've received your consulting request and will get back to you within 24 hours.
            </p>
            <p className="text-gray-400 mb-8">
              Our team will analyze your needs and prepare a custom automation strategy for your business.
            </p>
            <Button
              onClick={() => setSuccess(false)}
              className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-8 py-6"
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Request a <span className="gradient-gold-molten">Custom Consultation</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Need a custom solution? Not sure which agent fits your needs? Let our experts design a personalized automation strategy for your business.
        </p>
      </motion.div>

      <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                Contact Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Your Name *</Label>
                  <Input
                    name="client_name"
                    required
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Email *</Label>
                  <Input
                    name="client_email"
                    type="email"
                    required
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Company Name *</Label>
                  <Input
                    name="company"
                    required
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    placeholder="Acme Inc"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Phone Number</Label>
                  <Input
                    name="phone"
                    type="tel"
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Agent Configuration */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                Agent Configuration
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Do you need a phone number? *</Label>
                  <Select name="needs_phone_number" required>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">What CRM do you use? *</Label>
                  <Input
                    name="crm_system"
                    required
                    placeholder="e.g., HubSpot, Salesforce, Zoho, None"
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">What does your current call system or workflow look like? *</Label>
                  <Textarea
                    name="current_workflow"
                    required
                    rows={3}
                    placeholder="Describe your current system..."
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Do you need inbound, outbound, or both? *</Label>
                  <Select name="agent_direction" required>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Inbound">Inbound Only</SelectItem>
                      <SelectItem value="Outbound">Outbound Only</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Do you need appointment setting added? *</Label>
                  <Select name="needs_appointment_setting" required>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Do you want Lead Qualification Workflow attached? *</Label>
                  <Select name="needs_lead_qualification" required>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">What languages do you require? *</Label>
                  <Input
                    name="required_languages"
                    required
                    placeholder="e.g., English, Spanish, French"
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                Business Details
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">What Service Are You Interested In? *</Label>
                  <Select name="service_type" required>
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="Custom">Custom AI Solution</SelectItem>
                      <SelectItem value="Full Infrastructure">Full Automation Infrastructure</SelectItem>
                      <SelectItem value="Single Agent">Single Agent (Custom Configuration)</SelectItem>
                      <SelectItem value="Diagnostic Only">Just Want a Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Current Revenue Range</Label>
                  <Select name="current_revenue">
                    <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                      <SelectValue placeholder="Select revenue range" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                      <SelectItem value="$0-$100k">$0 - $100k/year</SelectItem>
                      <SelectItem value="$100k-$500k">$100k - $500k/year</SelectItem>
                      <SelectItem value="$500k-$1M">$500k - $1M/year</SelectItem>
                      <SelectItem value="$1M-$5M">$1M - $5M/year</SelectItem>
                      <SelectItem value="$5M+">$5M+/year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Team Size</Label>
                  <Input
                    name="team_size"
                    placeholder="e.g., 10-25 employees"
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                  />
                </div>
              </div>
            </div>

            {/* Business Challenges */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                Your Challenges & Goals
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">What Challenges Are You Facing? *</Label>
                  <Textarea
                    name="business_challenges"
                    required
                    rows={4}
                    placeholder="e.g., Too many missed calls, manual data entry, slow response times, scaling issues..."
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Additional Notes or Requirements</Label>
                  <Textarea
                    name="notes"
                    rows={4}
                    placeholder="Any specific requirements, timeline constraints, or questions you have..."
                    className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Request Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-400">
              We'll review your request and get back to you within 24 hours with a custom proposal.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}