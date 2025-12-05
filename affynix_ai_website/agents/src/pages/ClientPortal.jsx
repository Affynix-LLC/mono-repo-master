import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, TrendingUp, DollarSign, Clock, BarChart3, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ClientPortal() {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Find client record by email
        const clients = await base44.entities.Client.filter({ email: currentUser.email });
        if (clients.length > 0) {
          setClient(clients[0]);
        }
      } catch (error) {
        console.error("Auth error:", error);
        base44.auth.redirectToLogin(window.location.pathname);
      }
    };
    loadUser();
  }, []);

  const { data: agents = [] } = useQuery({
    queryKey: ['client-agents', client?.id],
    queryFn: () => client ? base44.entities.Agent.filter({ client_id: client.id }) : [],
    enabled: !!client
  });

  const { data: callLogs = [] } = useQuery({
    queryKey: ['client-calls', client?.id],
    queryFn: () => client ? base44.entities.CallLog.filter({ client_id: client.id }) : [],
    enabled: !!client
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['client-payments', client?.id],
    queryFn: () => client ? base44.entities.Payment.filter({ client_id: client.id }) : [],
    enabled: !!client
  });

  if (!user || !client) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  // Calculate stats
  const totalCalls = callLogs.length;
  const totalCallMinutes = callLogs.reduce((sum, log) => sum + (log.call_duration || 0), 0) / 60;
  const qualifiedLeads = callLogs.filter(log => log.lead_qualified).length;
  const appointmentsBooked = callLogs.filter(log => log.appointment_booked).length;
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const activeAgents = agents.filter(a => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.full_name || client.name}
          </h1>
          <p className="text-gray-400 text-lg">{client.company}</p>
          <Badge className="mt-2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
            {client.plan} Plan
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Agents</p>
                  <p className="text-3xl font-bold text-white">{activeAgents}</p>
                </div>
                <Phone className="w-10 h-10 text-[#D4AF37]" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Calls</p>
                  <p className="text-3xl font-bold text-white">{totalCalls}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Qualified Leads</p>
                  <p className="text-3xl font-bold text-white">{qualifiedLeads}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Appointments</p>
                  <p className="text-3xl font-bold text-white">{appointmentsBooked}</p>
                </div>
                <Calendar className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#0E0E0E] border border-[#D4AF37]/20 mb-8">
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calls">Call History</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <div className="space-y-6">
              {agents.length === 0 ? (
                <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                  <CardContent className="p-12 text-center">
                    <Phone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Agents Yet</h3>
                    <p className="text-gray-400 mb-6">Get started by deploying your first AI agent</p>
                    <Link to={createPageUrl("Agents")}>
                      <Button className="bg-[#D4AF37] hover:bg-[#E6C878] text-black">
                        Browse Agent Marketplace
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                agents.map((agent) => (
                  <Card key={agent.id} className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{agent.agent_name}</CardTitle>
                          <p className="text-sm text-gray-400 mt-1">{agent.agent_type}</p>
                        </div>
                        <Badge className={
                          agent.status === "Active" ? "bg-green-500/20 text-green-400" :
                          agent.status === "Paused" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-gray-500/20 text-gray-400"
                        }>
                          {agent.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Total Interactions</p>
                          <p className="text-2xl font-bold text-white">{agent.total_interactions || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Success Rate</p>
                          <p className="text-2xl font-bold text-white">{agent.success_rate || 0}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Performance</p>
                          <p className="text-2xl font-bold text-white">{agent.performance_score || 0}/100</p>
                        </div>
                      </div>
                      {agent.notes && (
                        <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-[#D4AF37]/20">
                          {agent.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                    Call Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#D4AF37]/10">
                    <span className="text-gray-400">Total Calls Handled</span>
                    <span className="text-white font-bold">{totalCalls}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#D4AF37]/10">
                    <span className="text-gray-400">Total Minutes</span>
                    <span className="text-white font-bold">{Math.round(totalCallMinutes)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#D4AF37]/10">
                    <span className="text-gray-400">Lead Qualification Rate</span>
                    <span className="text-green-400 font-bold">
                      {totalCalls > 0 ? Math.round((qualifiedLeads / totalCalls) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-400">Appointment Booking Rate</span>
                    <span className="text-blue-400 font-bold">
                      {totalCalls > 0 ? Math.round((appointmentsBooked / totalCalls) * 100) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    Time Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <p className="text-5xl font-bold text-[#D4AF37] mb-2">
                      {Math.round(totalCallMinutes * 1.5)}
                    </p>
                    <p className="text-gray-400">Hours Saved This Month</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Based on avg 1.5x human handling time
                    </p>
                  </div>
                  <div className="pt-6 border-t border-[#D4AF37]/20 text-center">
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      ${Math.round(totalCallMinutes * 1.5 * 25)}
                    </p>
                    <p className="text-gray-400">Estimated Labor Cost Savings</p>
                    <p className="text-sm text-gray-500 mt-2">
                      @ $25/hr average labor cost
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calls">
            <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Call History</CardTitle>
              </CardHeader>
              <CardContent>
                {callLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No call history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {callLogs.slice(0, 20).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0E0E0E] border border-[#D4AF37]/10">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Phone className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-white font-medium">{log.from_number || 'Unknown'}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.outcome || log.call_status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            Duration: {Math.round((log.call_duration || 0) / 60)}m {(log.call_duration || 0) % 60}s
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {new Date(log.created_date).toLocaleDateString()}
                          </p>
                          {log.lead_qualified && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs mt-1">
                              Qualified Lead
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="space-y-6">
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-2xl font-bold text-white">{client.plan}</p>
                      <p className="text-gray-400">Monthly: ${client.monthly_revenue || 0}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {client.payment_status}
                    </Badge>
                  </div>
                  <Link to={createPageUrl("Pricing")}>
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black">
                      Upgrade Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No payment history</p>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0E0E0E] border border-[#D4AF37]/10">
                          <div>
                            <p className="text-white font-medium">${payment.amount}</p>
                            <p className="text-sm text-gray-400">{payment.description || payment.payment_type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {new Date(payment.payment_date || payment.created_date).toLocaleDateString()}
                            </p>
                            <Badge className={
                              payment.status === "Succeeded" ? "bg-green-500/20 text-green-400" :
                              payment.status === "Failed" ? "bg-red-500/20 text-red-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}