import React, { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Copy, RefreshCw, FileText } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../AdminLayout";

export default function AIEditor() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [taskType, setTaskType] = useState("rewrite_copy");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await api.auth.me();
        if (currentUser.role !== 'admin') {
          window.location.href = '/';
        }
        setUser(currentUser);
      } catch (error) {
        api.auth.redirectToLogin(window.location.pathname);
      }
    };
    checkAuth();
  }, []);

  const taskTemplates = {
    rewrite_copy: {
      label: "Rewrite Website Copy",
      systemPrompt: "You are a professional copywriter specializing in conversion-focused content. Rewrite the provided text to be more compelling, clear, and persuasive.",
      placeholder: "Paste your existing copy here..."
    },
    create_ad: {
      label: "Create Ad Script",
      systemPrompt: "You are an advertising expert. Create a compelling ad script for the described product/service that captures attention and drives action.",
      placeholder: "Describe your product/service and target audience..."
    },
    summarize_data: {
      label: "Summarize Client Data",
      systemPrompt: "You are a business analyst. Provide a clear, concise summary of the client data provided, highlighting key insights and opportunities.",
      placeholder: "Paste client data, meeting notes, or business information..."
    },
    email_template: {
      label: "Generate Email Template",
      systemPrompt: "You are a professional email marketing specialist. Create an effective email template based on the provided context and goal.",
      placeholder: "Describe the email purpose, audience, and key message..."
    },
    sales_pitch: {
      label: "Write Sales Pitch",
      systemPrompt: "You are a sales expert. Create a persuasive sales pitch that addresses pain points and communicates value effectively.",
      placeholder: "Describe your service, target client, and key benefits..."
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setOutput("");

    try {
      const template = taskTemplates[taskType];
      const fullPrompt = `${template.systemPrompt}\n\nUser Input:\n${prompt}`;

      const result = await api.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        add_context_from_internet: false
      });

      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleClear = () => {
    setPrompt("");
    setOutput("");
  };

  if (!user) {
    return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
      <div className="text-[#C6A45E] text-xl">Loading...</div>
    </div>;
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">AI Content Editor</h1>
            <p className="text-gray-400">Generate and refine content using AI</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C6A45E]" />
                    Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Task Type</Label>
                    <Select value={taskType} onValueChange={setTaskType}>
                      <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                        {Object.entries(taskTemplates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>{template.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Your Content</Label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={taskTemplates[taskType].placeholder}
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white min-h-[400px] resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim()}
                      className="flex-1 bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="border-[#C6A45E]/30 text-gray-300"
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Output Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#12F4FF]" />
                      Output
                    </div>
                    {output && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        className="text-[#12F4FF] hover:text-[#12F4FF]/80"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {output ? (
                    <div className="bg-[#0B0B0B] border border-[#C6A45E]/20 rounded-lg p-6 min-h-[400px] text-white whitespace-pre-wrap">
                      {output}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center min-h-[400px] text-gray-500">
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>AI-generated content will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6"
          >
            <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="text-[#C6A45E] font-semibold">Be Specific</div>
                    <div className="text-gray-400">The more context you provide, the better the output will be.</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[#C6A45E] font-semibold">Iterate</div>
                    <div className="text-gray-400">Use the output as a starting point and refine as needed.</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[#C6A45E] font-semibold">Save Your Work</div>
                    <div className="text-gray-400">Copy generated content before starting a new task.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}