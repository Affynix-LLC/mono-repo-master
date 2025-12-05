import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, FileText, TrendingUp, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

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

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
    enabled: !!user,
  });

  const { data: intakes = [] } = useQuery({
    queryKey: ['intakes'],
    queryFn: () => base44.entities.IntakeSubmission.list(),
    enabled: !!user,
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: () => base44.entities.Agent.list(),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-[#C6A45E] text-xl">Loading...</div>
      </div>
    );
  }

  const totalClients = clients.length;
  const pendingIntakes = intakes.filter(i => i.status === 'New').length;
  const monthlyRevenue = clients.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0);
  const activeAgents = agents.filter(a => a.status === 'Active').length;
  const totalAgents = agents.length;

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "#3B82F6",
      link: createPageUrl("ClientManager")
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "#10B981",
      link: createPageUrl("Payments")
    },
    {
      title: "Active Agents",
      value: `${activeAgents}/${totalAgents}`,
      icon: Bot,
      color: "#8B5CF6",
      link: createPageUrl("AgentManager")
    },
    {
      title: "Pending Intakes",
      value: pendingIntakes,
      icon: FileText,
      color: "#F59E0B",
      link: createPageUrl("IntakeViewer")
    }
  ];

  const recentClients = clients.slice(0, 5);
  const recentIntakesList = intakes.filter(i => i.status === 'New').slice(0, 5);

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">Monitor your business metrics and recent activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={stat.link}>
                  <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(18,244,255,0.2)] cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(198,164,94,0.3)] group-hover:scale-110 transition-all duration-300" style={{backgroundColor: stat.color}}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-[#12F4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.title}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Clients */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Recent Clients</span>
                    <Link to={createPageUrl("ClientManager")}>
                      <Button variant="ghost" size="sm" className="text-[#12F4FF] hover:text-[#12F4FF]/80">
                        View All →
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 rounded-lg backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/10">
                        <div>
                          <div className="font-semibold text-white">{client.name}</div>
                          <div className="text-sm text-gray-400">{client.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold" style={{color: client.payment_status === 'Paid' ? '#10B981' : '#F59E0B'}}>
                            {client.payment_status}
                          </div>
                          <div className="text-xs text-gray-500">{client.plan}</div>
                        </div>
                      </div>
                    ))}
                    {recentClients.length === 0 && (
                      <div className="text-center text-gray-500 py-8">No clients yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pending Intakes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>New Intake Submissions</span>
                    <Link to={createPageUrl("IntakeViewer")}>
                      <Button variant="ghost" size="sm" className="text-[#12F4FF] hover:text-[#12F4FF]/80">
                        View All →
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentIntakesList.map((intake) => (
                      <div key={intake.id} className="flex items-center justify-between p-3 rounded-lg backdrop-blur-xl bg-[#111111]/40 border border-[#C6A45E]/10">
                        <div>
                          <div className="font-semibold text-white">{intake.client_name}</div>
                          <div className="text-sm text-gray-400">{intake.company || intake.client_email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#F59E0B]">
                            {intake.service_type}
                          </div>
                          <div className="text-xs text-gray-500">New</div>
                        </div>
                      </div>
                    ))}
                    {recentIntakesList.length === 0 && (
                      <div className="text-center text-gray-500 py-8">No pending intakes</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}