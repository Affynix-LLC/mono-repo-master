import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Play, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Zap,
  TrendingUp,
  FileText,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";

export default function AgentControl() {
  const [user, setUser] = useState(null);
  const [runningAgent, setRunningAgent] = useState(null);

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

  // Fetch command logs
  const { data: commandLogs = [] } = useQuery({
    queryKey: ['commandLogs'],
    queryFn: () => base44.entities.CommandLog.list('-created_date', 50),
    enabled: !!user,
    refetchInterval: 10000 // Auto-refresh every 10 seconds
  });

  // Fetch pending ZeroX commands
  const { data: pendingCommands = [] } = useQuery({
    queryKey: ['zeroXCommands'],
    queryFn: () => base44.entities.ZeroXControl.filter({ execution_status: 'Pending' }),
    enabled: !!user,
  });

  const agents = [
    {
      name: 'IntakeSyncAgent',
      icon: FileText,
      color: '#3B82F6',
      description: 'Syncs new intake submissions to HubSpot CRM',
      trigger: 'On new IntakeSubmission',
      endpoint: 'intakeSyncAgent'
    },
    {
      name: 'BillingMonitorAgent',
      icon: DollarSign,
      color: '#10B981',
      description: 'Monitors payments and updates client billing status',
      trigger: 'Schedule (every 15 min)',
      endpoint: 'billingMonitorAgent'
    },
    {
      name: 'AIAssistantAgent',
      icon: Zap,
      color: '#F59E0B',
      description: 'AI-powered content generation and admin assistance',
      trigger: 'Manual trigger',
      endpoint: 'aiAssistantAgent'
    },
    {
      name: 'ZeroXOrchestrator',
      icon: Activity,
      color: '#8B5CF6',
      description: 'Meta-agent that coordinates other agents autonomously',
      trigger: 'Schedule (every 30 min) or manual',
      endpoint: 'zeroXOrchestrator'
    }
  ];

  const handleRunAgent = async (agentEndpoint, agentName) => {
    setRunningAgent(agentName);
    try {
      const payload = {};
      
      // Special payload for AI Assistant (example)
      if (agentEndpoint === 'aiAssistantAgent') {
        payload.prompt = 'Provide a summary of the current system status based on recent activity.';
        payload.task_type = 'system_summary';
      }

      const result = await base44.functions.invoke(agentEndpoint, payload);
      
      if (result.data.success) {
        alert(`✓ ${agentName} executed successfully!`);
      } else {
        alert(`✗ ${agentName} failed: ${result.data.error || 'Unknown error'}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['commandLogs'] });
      queryClient.invalidateQueries({ queryKey: ['zeroXCommands'] });
    } catch (error) {
      alert(`✗ Error: ${error.message}`);
    } finally {
      setRunningAgent(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Partial':
        return <Activity className="w-5 h-5 text-yellow-500" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAgentStats = () => {
    const last24h = commandLogs.filter(log => {
      const logDate = new Date(log.created_date);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return logDate > dayAgo;
    });

    return {
      total_executions: last24h.length,
      successful: last24h.filter(log => log.status === 'Success').length,
      failed: last24h.filter(log => log.status === 'Failed').length,
      avg_execution_time: last24h.length > 0 
        ? Math.round(last24h.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / last24h.length)
        : 0
    };
  };

  const stats = getAgentStats();

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
            <h1 className="text-4xl font-bold text-white mb-2">AI Agent Control Center</h1>
            <p className="text-gray-400">Monitor and control autonomous agents</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm">Executions (24h)</div>
                    <div className="text-3xl font-bold text-white mt-1">{stats.total_executions}</div>
                  </div>
                  <Bot className="w-10 h-10 text-[#C6A45E]" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm">Successful</div>
                    <div className="text-3xl font-bold text-green-500 mt-1">{stats.successful}</div>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm">Failed</div>
                    <div className="text-3xl font-bold text-red-500 mt-1">{stats.failed}</div>
                  </div>
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm">Avg Time</div>
                    <div className="text-3xl font-bold text-white mt-1">{stats.avg_execution_time}ms</div>
                  </div>
                  <TrendingUp className="w-10 h-10 text-[#12F4FF]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agents Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: agent.color }}
                        >
                          <agent.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{agent.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {agent.trigger}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleRunAgent(agent.endpoint, agent.name)}
                        disabled={runningAgent === agent.name}
                        className="bg-[#C6A45E] hover:bg-[#C6A45E]/90 text-white"
                      >
                        {runningAgent === agent.name ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Run
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">{agent.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs for Logs and Commands */}
          <Tabs defaultValue="logs" className="space-y-6">
            <TabsList className="bg-[#111111]/60 border border-[#C6A45E]/20">
              <TabsTrigger value="logs" className="data-[state=active]:bg-[#C6A45E]">
                Command Logs ({commandLogs.length})
              </TabsTrigger>
              <TabsTrigger value="commands" className="data-[state=active]:bg-[#C6A45E]">
                Pending Commands ({pendingCommands.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="space-y-4">
              {commandLogs.length === 0 ? (
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                  <CardContent className="p-12 text-center">
                    <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No command logs yet</p>
                  </CardContent>
                </Card>
              ) : (
                commandLogs.map((log) => (
                  <Card key={log.id} className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {getStatusIcon(log.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold">{log.agent_name}</h3>
                              <Badge 
                                className={
                                  log.status === 'Success' ? 'bg-green-500/20 text-green-400' :
                                  log.status === 'Failed' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }
                              >
                                {log.status}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{log.action}</p>
                            <div className="text-xs text-gray-500">
                              <span>Executed by: {log.triggered_by}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(log.created_date).toLocaleString()}</span>
                              <span className="mx-2">•</span>
                              <span>{log.execution_time_ms}ms</span>
                            </div>
                            {log.error_message && (
                              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                                {log.error_message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="commands" className="space-y-4">
              {pendingCommands.length === 0 ? (
                <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No pending commands</p>
                  </CardContent>
                </Card>
              ) : (
                pendingCommands.map((command) => (
                  <Card key={command.id} className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{command.command_type}</h3>
                            <Badge variant="outline">{command.target_agent}</Badge>
                            <Badge 
                              className={
                                command.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                command.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-blue-500/20 text-blue-400'
                              }
                            >
                              {command.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            Authorized by: {command.authorized_by || 'System'}
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          {command.execution_status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}