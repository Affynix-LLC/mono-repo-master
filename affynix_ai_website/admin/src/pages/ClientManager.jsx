import React, { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Pencil, Trash2, Search, RefreshCw, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../AdminLayout";

export default function ClientManager() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [syncingClient, setSyncingClient] = useState(null);
  const [batchSyncing, setBatchSyncing] = useState(false);

  const queryClient = useQueryClient();

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

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.entities.Client.list('-created_date'),
    enabled: !!user,
  });

  const createClientMutation = useMutation({
    mutationFn: async (clientData) => {
      const client = await api.entities.Client.create(clientData);
      
      // Auto-sync to HubSpot
      try {
        await api.functions.invoke('hubspot', {
          action: 'sync_contact',
          client: client
        });
      } catch (error) {
        console.error('HubSpot sync failed:', error);
      }
      
      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDialogOpen(false);
      setEditingClient(null);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const updatedClient = await api.entities.Client.update(id, data);
      
      // Auto-sync to HubSpot
      try {
        await api.functions.invoke('hubspot', {
          action: 'sync_contact',
          client: updatedClient
        });
      } catch (error) {
        console.error('HubSpot sync failed:', error);
      }
      
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDialogOpen(false);
      setEditingClient(null);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id) => api.entities.Client.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      business_type: formData.get('business_type'),
      plan: formData.get('plan'),
      payment_status: formData.get('payment_status'),
      onboarding_step: formData.get('onboarding_step'),
      monthly_revenue: parseFloat(formData.get('monthly_revenue')) || 0,
      notes: formData.get('notes'),
    };

    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, data: clientData });
    } else {
      createClientMutation.mutate(clientData);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClientMutation.mutate(id);
    }
  };

  const handleSyncToHubSpot = async (client) => {
    setSyncingClient(client.id);
    try {
      const result = await api.functions.invoke('hubspot', {
        action: 'sync_contact',
        client: client
      });
      
      if (result.data?.success) {
        alert(`✓ ${result.data.message}`);
        queryClient.invalidateQueries({ queryKey: ['clients'] });
      } else {
        alert(`✗ Failed to sync: ${result.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`✗ Error: ${error.message}`);
    } finally {
      setSyncingClient(null);
    }
  };

  const handleBatchSync = async () => {
    if (!confirm('Sync all clients to HubSpot? This may take a few moments.')) return;
    
    setBatchSyncing(true);
    try {
      const result = await api.functions.invoke('hubspot', {
        action: 'batch_sync'
      });
      
      if (result.data?.success) {
        const summary = result.data.summary;
        alert(`✓ Batch sync complete!\n\nSynced: ${summary.synced}\nFailed: ${summary.failed}`);
        queryClient.invalidateQueries({ queryKey: ['clients'] });
      } else {
        alert(`✗ Batch sync failed: ${result.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`✗ Error: ${error.message}`);
    } finally {
      setBatchSyncing(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || client.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || client.payment_status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

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
              <h1 className="text-4xl font-bold text-white mb-2">Client Manager</h1>
              <p className="text-gray-400">{filteredClients.length} total clients</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleBatchSync}
                disabled={batchSyncing}
                variant="outline"
                className="border-[#C6A45E]/30 text-gray-300"
              >
                {batchSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All to HubSpot
                  </>
                )}
              </Button>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setEditingClient(null);
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#111111] border-[#C6A45E]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingClient ? 'Edit Client' : 'Add New Client'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Name *</Label>
                        <Input name="name" defaultValue={editingClient?.name} required className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Email *</Label>
                        <Input name="email" type="email" defaultValue={editingClient?.email} required className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Company</Label>
                        <Input name="company" defaultValue={editingClient?.company} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Phone</Label>
                        <Input name="phone" defaultValue={editingClient?.phone} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Business Type</Label>
                        <Input name="business_type" defaultValue={editingClient?.business_type} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Monthly Revenue</Label>
                        <Input name="monthly_revenue" type="number" defaultValue={editingClient?.monthly_revenue} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Plan</Label>
                        <Select name="plan" defaultValue={editingClient?.plan || "Diagnostic Only"}>
                          <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                            <SelectItem value="Diagnostic Only">Diagnostic Only</SelectItem>
                            <SelectItem value="Full Infrastructure">Full Infrastructure</SelectItem>
                            <SelectItem value="Single Agent">Single Agent</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Payment Status</Label>
                        <Select name="payment_status" defaultValue={editingClient?.payment_status || "Pending"}>
                          <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-300">Onboarding Step</Label>
                        <Select name="onboarding_step" defaultValue={editingClient?.onboarding_step || "Intake"}>
                          <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                            <SelectItem value="Intake">Intake</SelectItem>
                            <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                            <SelectItem value="Blueprint Approval">Blueprint Approval</SelectItem>
                            <SelectItem value="Build & Deploy">Build & Deploy</SelectItem>
                            <SelectItem value="Live">Live</SelectItem>
                            <SelectItem value="Optimizing">Optimizing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-300">Notes</Label>
                        <Textarea name="notes" defaultValue={editingClient?.notes} className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" rows={4} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-[#C6A45E]/30">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white">
                        {editingClient ? 'Update' : 'Create'} Client
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
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
                      placeholder="Search by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Plan</Label>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="Diagnostic Only">Diagnostic Only</SelectItem>
                      <SelectItem value="Full Infrastructure">Full Infrastructure</SelectItem>
                      <SelectItem value="Single Agent">Single Agent</SelectItem>
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
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client List */}
          <div className="space-y-4">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-white">{client.name}</h3>
                              {client.hubspot_contact_id && (
                                <Badge className="bg-[#FF7A59] text-white text-xs">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  HubSpot
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400">{client.email}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Company</div>
                            <div className="text-white">{client.company || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Plan</div>
                            <div className="text-[#C6A45E] font-semibold">{client.plan}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Status</div>
                            <div className="font-semibold" style={{color: client.payment_status === 'Paid' ? '#10B981' : client.payment_status === 'Overdue' ? '#EF4444' : '#F59E0B'}}>
                              {client.payment_status}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Onboarding</div>
                            <div className="text-white">{client.onboarding_step}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSyncToHubSpot(client)}
                          disabled={syncingClient === client.id}
                          className="text-[#FF7A59] hover:text-[#FF7A59]/80"
                          title="Sync to HubSpot"
                        >
                          {syncingClient === client.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(client)}
                          className="text-[#12F4FF] hover:text-[#12F4FF]/80"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(client.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredClients.length === 0 && (
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No clients found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
