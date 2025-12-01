import React, { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, TrendingUp, Calendar, Filter, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../AdminLayout";
import moment from "moment";

export default function Payments() {
  const [user, setUser] = useState(null);
  const [filterClient, setFilterClient] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => api.entities.Payment.list('-payment_date'),
    enabled: !!user,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.entities.Client.list(),
    enabled: !!user,
  });

  const createPaymentMutation = useMutation({
    mutationFn: (paymentData) => api.entities.Payment.create(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDialogOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const paymentData = {
      client_id: formData.get('client_id'),
      amount: parseFloat(formData.get('amount')),
      payment_type: formData.get('payment_type'),
      status: formData.get('status'),
      description: formData.get('description'),
      payment_date: new Date().toISOString(),
    };

    createPaymentMutation.mutate(paymentData);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusColor = (status) => {
    const colors = {
      "Succeeded": "#10B981",
      "Pending": "#F59E0B",
      "Failed": "#EF4444",
      "Refunded": "#6B7280"
    };
    return colors[status] || "#6B7280";
  };

  const filteredPayments = payments.filter(payment => {
    const matchesClient = filterClient === 'all' || payment.client_id === filterClient;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.payment_type === filterType;
    return matchesClient && matchesStatus && matchesType;
  });

  // Calculate stats
  const totalRevenue = payments
    .filter(p => p.status === 'Succeeded')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  
  const monthlyRevenue = payments
    .filter(p => {
      if (p.status !== 'Succeeded') return false;
      const paymentDate = moment(p.payment_date || p.created_date);
      return paymentDate.isSame(moment(), 'month');
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingPayments = payments.filter(p => p.status === 'Pending').length;

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
              <h1 className="text-4xl font-bold text-white mb-2">Payment Management</h1>
              <p className="text-gray-400">Track revenue and manage transactions</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#10B981] hover:bg-[#10B981]/90 text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111111] border-[#C6A45E]/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Record New Payment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Client *</Label>
                    <Select name="client_id" required>
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
                    <Label className="text-gray-300">Amount ($) *</Label>
                    <Input name="amount" type="number" step="0.01" required className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Payment Type *</Label>
                    <Select name="payment_type" defaultValue="One-time">
                      <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                        <SelectItem value="One-time">One-time</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Setup Fee">Setup Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Status *</Label>
                    <Select name="status" defaultValue="Succeeded">
                      <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Succeeded">Succeeded</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Input name="description" className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white" placeholder="Payment description..." />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-[#C6A45E]/30">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#10B981] hover:bg-[#10B981]/90 text-white">
                      Record Payment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#10B981] flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">This Month</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B] flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {pendingPayments}
                  </div>
                  <div className="text-sm text-gray-400">Pending Payments</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Client</Label>
                  <Select value={filterClient} onValueChange={setFilterClient}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Clients</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
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
                      <SelectItem value="Succeeded">Succeeded</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Setup Fee">Setup Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment List */}
          <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#10B981] flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{getClientName(payment.client_id)}</div>
                        <div className="text-sm text-gray-400">
                          {payment.description || payment.payment_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          ${payment.amount?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {moment(payment.payment_date || payment.created_date).format('MMM D, YYYY')}
                        </div>
                      </div>
                      <Badge style={{backgroundColor: getStatusColor(payment.status)}} className="text-white">
                        {payment.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
                {filteredPayments.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-lg">No payments found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}