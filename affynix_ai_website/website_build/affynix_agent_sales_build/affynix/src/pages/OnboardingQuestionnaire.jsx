import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function OnboardingQuestionnaire() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get('session_id') || '');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      stripe_session_id: sessionId,
      client_name: formData.get("client_name"),
      client_email: formData.get("client_email"),
      company_name: formData.get("company_name"),
      phone: formData.get("phone"),
      industry: formData.get("industry"),
      business_description: formData.get("business_description"),
      crm_system: formData.get("crm_system"),
      calendar_system: formData.get("calendar_system"),
      communication_tools: formData.get("communication_tools"),
      phone_system: formData.get("phone_system"),
      website_url: formData.get("website_url"),
      integration_priority: formData.get("integration_priority"),
      monthly_call_volume: formData.get("monthly_call_volume"),
      primary_goal: formData.get("primary_goal"),
      special_requirements: formData.get("special_requirements"),
    };

    try {
      // Save to database
      await base44.entities.ClientIntegrationDetails.create(data);
      
      // Send to Zapier webhook (which connects to HubSpot)
      try {
        await base44.functions.invoke('sendToZapier', data);
      } catch (zapierError) {
        console.error('Zapier webhook failed:', zapierError);
        // Continue even if Zapier fails - data is already in database
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
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="backdrop-blur-xl bg-black/60 border border-[#10B981]/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Perfect! We're All Set 🎉</h2>
              <p className="text-xl text-gray-300 mb-6">
                Our team will begin integrating your AI automation within 24-48 hours.
              </p>
              <p className="text-gray-400 mb-8">
                You'll receive an email with timeline updates and next steps. We handle everything from here!
              </p>
              <Link to={createPageUrl("Home")}>
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-10 py-6">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-4 py-2 text-sm">
            INTEGRATION SETUP
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's Get You <span className="gradient-gold-molten">Connected</span>
          </h1>
          <p className="text-xl text-gray-400">
            This information helps us seamlessly integrate AI automation with your existing systems
          </p>
        </motion.div>

        <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Your Name *</Label>
                    <Input
                      name="client_name"
                      required
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Email *</Label>
                    <Input
                      name="client_email"
                      type="email"
                      required
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Company Name *</Label>
                    <Input
                      name="company_name"
                      required
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Phone Number</Label>
                    <Input
                      name="phone"
                      type="tel"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Business Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Industry</Label>
                    <Input
                      name="industry"
                      placeholder="e.g., Real Estate, Healthcare, E-commerce"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Website URL</Label>
                    <Input
                      name="website_url"
                      type="url"
                      placeholder="https://yourcompany.com"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Tell us about your business</Label>
                    <Textarea
                      name="business_description"
                      rows={4}
                      placeholder="What does your business do? Who are your customers?"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* System Integration Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Current Systems
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">CRM System</Label>
                    <Input
                      name="crm_system"
                      placeholder="e.g., HubSpot, Salesforce, Zoho"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Calendar System</Label>
                    <Input
                      name="calendar_system"
                      placeholder="e.g., Google Calendar, Outlook, Calendly"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Current Phone System</Label>
                    <Input
                      name="phone_system"
                      placeholder="e.g., RingCentral, Twilio, Traditional PBX"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Communication Tools</Label>
                    <Input
                      name="communication_tools"
                      placeholder="e.g., Slack, Microsoft Teams, Email"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                </div>
              </div>

              {/* Automation Goals */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Automation Goals
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Integration Timeline</Label>
                    <Select name="integration_priority" defaultValue="Within 1 week">
                      <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                        <SelectItem value="Immediate">Immediate (ASAP)</SelectItem>
                        <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                        <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Monthly Call Volume (estimate)</Label>
                    <Input
                      name="monthly_call_volume"
                      placeholder="e.g., 100-500 calls per month"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Primary Goal</Label>
                    <Textarea
                      name="primary_goal"
                      rows={3}
                      placeholder="What's your main goal with AI automation? (e.g., reduce missed calls, automate appointment booking, qualify leads)"
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Special Requirements or Notes</Label>
                    <Textarea
                      name="special_requirements"
                      rows={4}
                      placeholder="Any specific features, compliance requirements, or integrations you need?"
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
                    Complete Setup
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}