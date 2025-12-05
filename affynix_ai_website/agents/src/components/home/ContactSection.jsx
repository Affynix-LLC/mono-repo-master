
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, ArrowRight, Loader2, Shield, Users, Sparkles } from "lucide-react";
import { api } from "@/api/apiClient";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
    };

    try {
      // Create intake submission directly
      await api.entities.IntakeSubmission.create({
        ...data,
        source: "Home Page - Contact Form",
        status: "New"
      });
      
        setSuccess(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 relative overflow-hidden bg-[#0E0E0E]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-6 px-4 py-2 text-sm">
            GET STARTED
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Request Your Free Diagnostic
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We'll audit your workflows and deliver a custom blueprint—no commitment required.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="backdrop-blur-xl bg-black/60 border border-[#10B981]/50">
              <CardContent className="p-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                <p className="text-gray-300 text-lg mb-6">
                  We've received your request. Our team will reach out within 24 hours.
                </p>
                <p className="text-gray-400">
                  Check your email for confirmation and next steps.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Name *</Label>
                      <Input
                        name="client_name"
                        required
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Email *</Label>
                      <Input
                        name="client_email"
                        type="email"
                        required
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Company</Label>
                      <Input
                        name="company"
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Phone</Label>
                      <Input
                        name="phone"
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Service Interest *</Label>
                    <Select name="service_type" defaultValue="Full Infrastructure">
                      <SelectTrigger className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0E0E0E] border-[#D4AF37]/30">
                        <SelectItem value="Full Infrastructure">Full Infrastructure</SelectItem>
                        <SelectItem value="Single Agent">Single Agent</SelectItem>
                        <SelectItem value="Diagnostic Only">Diagnostic Only</SelectItem>
                        <SelectItem value="Custom">Custom Solution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Business Challenges</Label>
                    <Textarea
                      name="business_challenges"
                      rows={4}
                      className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      placeholder="Describe your current pain points..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Current Revenue</Label>
                      <Input
                        name="current_revenue"
                        placeholder="e.g., $500K/year"
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Team Size</Label>
                      <Input
                        name="team_size"
                        placeholder="e.g., 10-50"
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white focus:border-[#00FFFF] transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-[#D4AF37] hover:bg-[#E6C878] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] text-black py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Diagnostic
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="space-y-6">
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Fast Response</h3>
                    <p className="text-gray-400 text-sm">
                      We'll review your submission and reach out within 24 hours to schedule your diagnostic.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Commitment</h3>
                    <p className="text-gray-400 text-sm">
                      Free diagnostic and blueprint. Only proceed if the value is clear.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Expert Team</h3>
                    <p className="text-gray-400 text-sm">
                      Work with automation specialists who understand your business challenges.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
