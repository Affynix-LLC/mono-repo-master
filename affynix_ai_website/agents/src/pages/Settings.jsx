import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Save, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.role !== 'admin') {
          window.location.href = '/';
        }
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin(window.location.pathname);
      }
    };
    checkAuth();
  }, []);

  const { data: configs = [] } = useQuery({
    queryKey: ['configs'],
    queryFn: () => base44.entities.AppConfiguration.list(),
    enabled: !!user,
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AppConfiguration.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configs'] });
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.AppConfiguration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configs'] });
    },
  });

  const getConfigValue = (key, defaultValue = "") => {
    const config = configs.find(c => c.config_key === key);
    return config ? config.config_value : defaultValue;
  };

  const getConfigId = (key) => {
    const config = configs.find(c => c.config_key === key);
    return config ? config.id : null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.target);
    const updates = [];

    // Define all configuration keys
    const configKeys = [
      { key: 'homepage_hero_title', category: 'Homepage', type: 'text' },
      { key: 'homepage_hero_subtitle', category: 'Homepage', type: 'text' },
      { key: 'homepage_cta_text', category: 'CTA', type: 'text' },
      { key: 'pricing_diagnostic', category: 'Pricing', type: 'number' },
      { key: 'pricing_full_infrastructure', category: 'Pricing', type: 'number' },
      { key: 'pricing_single_agent', category: 'Pricing', type: 'number' },
      { key: 'contact_email', category: 'General', type: 'text' },
      { key: 'company_name', category: 'General', type: 'text' },
    ];

    for (const { key, category, type } of configKeys) {
      const value = formData.get(key);
      if (value !== null) {
        const configId = getConfigId(key);
        const configData = {
          config_key: key,
          config_value: value,
          config_type: type,
          category: category
        };

        if (configId) {
          updates.push(updateConfigMutation.mutateAsync({ id: configId, data: configData }));
        } else {
          updates.push(createConfigMutation.mutateAsync(configData));
        }
      }
    }

    try {
      await Promise.all(updates);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
      <div className="text-[#C6A45E] text-xl">Loading...</div>
    </div>;
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Configure your Affynix application</p>
          </div>

          <form onSubmit={handleSave}>
            <div className="space-y-6">
              {/* General Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                  <CardHeader>
                    <CardTitle className="text-white">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Company Name</Label>
                      <Input
                        name="company_name"
                        defaultValue={getConfigValue('company_name', 'Affynix.ai')}
                        className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Contact Email</Label>
                      <Input
                        name="contact_email"
                        type="email"
                        defaultValue={getConfigValue('contact_email', 'hello@affynix.ai')}
                        className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Homepage Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Homepage Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Hero Title</Label>
                      <Input
                        name="homepage_hero_title"
                        defaultValue={getConfigValue('homepage_hero_title', 'Profit Automation Infrastructure')}
                        className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Hero Subtitle</Label>
                      <Textarea
                        name="homepage_hero_subtitle"
                        defaultValue={getConfigValue('homepage_hero_subtitle', 'We design the system. We build the agents. We automate your growth.')}
                        className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Primary CTA Text</Label>
                      <Input
                        name="homepage_cta_text"
                        defaultValue={getConfigValue('homepage_cta_text', 'Get Started')}
                        className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pricing Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Pricing Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Diagnostic Only ($)</Label>
                        <Input
                          name="pricing_diagnostic"
                          type="number"
                          defaultValue={getConfigValue('pricing_diagnostic', '997')}
                          className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Full Infrastructure ($)</Label>
                        <Input
                          name="pricing_full_infrastructure"
                          type="number"
                          defaultValue={getConfigValue('pricing_full_infrastructure', '4997')}
                          className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Single Agent ($/mo)</Label>
                        <Input
                          name="pricing_single_agent"
                          type="number"
                          defaultValue={getConfigValue('pricing_single_agent', '497')}
                          className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white py-6 text-lg"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save All Settings
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}