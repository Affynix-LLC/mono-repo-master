
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Pencil, Trash2, Search, Phone, MessageSquare, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";

export default function AgentManager() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

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

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: () => base44.entities.Agent.list('-created_date'),
    enabled: !!user,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
    enabled: !!user,
  });

  const createAgentMutation = useMutation({
    mutationFn: (agentData) => base44.entities.Agent.create(agentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setDialogOpen(false);
      setEditingAgent(null);
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Agent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setDialogOpen(false);
      setEditingAgent(null);
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (id) => base44.entities.Agent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const agentData = {
      agent_name: formData.get('agent_name'),
      agent_type: formData.get('agent_type'),
      client_id: formData.get('client_id'),
      status: formData.get('status'),
      monthly_cost: parseFloat(formData.get('monthly_cost')) || 0,
      performance_score: parseFloat(formData.get('performance_score')) || 0,
      total_interactions: parseInt(formData.get('total_interactions')) || 0,
      success_rate: parseFloat(formData.get('success_rate')) || 0,
      api_endpoint: formData.get('api_endpoint'),
      notes: formData.get('notes'),
    };

    if (editingAgent) {
      updateAgentMutation.mutate({ id: editingAgent.id, data: agentData });
    } else {
      createAgentMutation.mutate(agentData);
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteAgentMutation.mutate(id);
    }
  };

  const getAgentIcon = (type) => {
    const icons = {
      "Phone Representative": Phone,
      "Cold Caller": Phone,
      "Chatbot": MessageSquare,
      "Email Response": Mail,
      "Scheduling": Calendar,
      "Custom": Bot
    };
    return icons[type] || Bot;
  };

  const getStatusColor = (status) => {
    const colors = {
      "Active": "#10B981",
      "Inactive": "#6B7280",
      "In Development": "#F59E0B",
      "Testing": "#3B82F6",
      "Paused": "#EF4444"
    };
    return colors[status] || "#6B7280";
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.agent_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || agent.agent_type === filterType;
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Agent Manager</h1>
              <p className="text-gray-400">{filteredAgents.length} total agents</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingAgent(null);
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111111] border-[#C6A45E]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingAgent ? 'Edit Agent' : 'Add New Agent'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Agent Name *</Label>
                      <Input name="agent_name" defaultValue={editingAgent?.agent_name} required className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Agent Type *</Label>
                      <Select name="agent_type" defaultValue={editingAgent?.agent_type || "Chatbot"}>
                        <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                          <SelectItem value="Phone Representative">Phone Representative</SelectItem>
                          <SelectItem value="Cold Caller">Cold Caller</SelectItem>
                          <SelectItem value="Chatbot">Chatbot</SelectItem>
                          <SelectItem value="Email Response">Email Response</SelectItem>
                          <SelectItem value="Scheduling">Scheduling</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Client *</Label>
                      <Select name="client_id" defaultValue={editingAgent?.client_id}>
                        <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Status</Label>
                      <Select name="status" defaultValue={editingAgent?.status || "In Development"}>
                        <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="In Development">In Development</SelectItem>
                          <SelectItem value="Testing">Testing</SelectItem>
                          <SelectItem value="Paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Monthly Cost ($)</Label>
                      <Input name="monthly_cost" type="number" step="0.01" defaultValue={editingAgent?.monthly_cost} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Performance Score (0-100)</Label>
                      <Input name="performance_score" type="number" min="0" max="100" defaultValue={editingAgent?.performance_score} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Total Interactions</Label>
                      <Input name="total_interactions" type="number" defaultValue={editingAgent?.total_interactions} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Success Rate (%)</Label>
                      <Input name="success_rate" type="number" min="0" max="100" step="0.1" defaultValue={editingAgent?.success_rate} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-300">API Endpoint</Label>
                      <Input name="api_endpoint" defaultValue={editingAgent?.api_endpoint} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" placeholder="https://api.affynix.ai/agent/..." />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-300">Notes</Label>
                      <Textarea name="notes" defaultValue={editingAgent?.notes} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" rows={4} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-[#C6A45E]/30">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white">
                      {editingAgent ? 'Update' : 'Create'} Agent
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search by name or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Phone Representative">Phone Representative</SelectItem>
                      <SelectItem value="Cold Caller">Cold Caller</SelectItem>
                      <SelectItem value="Chatbot">Chatbot</SelectItem>
                      <SelectItem value="Email Response">Email Response</SelectItem>
                      <SelectItem value="Scheduling">Scheduling</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="In Development">In Development</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent List */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAgents.map((agent, index) => {
              const AgentIcon = getAgentIcon(agent.agent_type);
              const statusColor = getStatusColor(agent.status);
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                            <AgentIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{agent.agent_name}</h3>
                            <p className="text-sm text-gray-400">{agent.agent_type}</p>
                          </div>
                        </div>
                        <Badge style={{backgroundColor: statusColor}} className="text-white">
                          {agent.status}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Client</span>
                          <span className="text-white font-medium">{getClientName(agent.client_id)}</span>
                        </div>
                        {agent.monthly_cost > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Monthly Cost</span>
                            <span className="text-[#10B981] font-semibold">${agent.monthly_cost.toLocaleString()}</span>
                          </div>
                        )}
                        {agent.total_interactions > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Interactions</span>
                            <span className="text-white font-medium">{agent.total_interactions.toLocaleString()}</span>
                          </div>
                        )}
                        {agent.success_rate > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Success Rate</span>
                            <span className="text-[#12F4FF] font-semibold">{agent.success_rate}%</span>
                          </div>
                        )}
                        {agent.performance_score > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Performance</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-[#0B0B0B] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#C6A45E] rounded-full transition-all duration-300"
                                  style={{width: `${agent.performance_score}%`}}
                                />
                              </div>
                              <span className="text-white font-medium">{agent.performance_score}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-[#C6A45E]/20">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(agent)}
                          className="flex-1 text-[#12F4FF] hover:text-[#12F4FF]/80"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(agent.id)}
                          className="flex-1 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {filteredAgents.length === 0 && (
              <div className="col-span-2">
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                  <CardContent className="p-12 text-center">
                    <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No agents found</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
