import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Mail, Phone, Building, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";
import moment from "moment";

export default function IntakeViewer() {
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const { data: intakes = [] } = useQuery({
    queryKey: ['intakes'],
    queryFn: () => base44.entities.IntakeSubmission.list('-created_date'),
    enabled: !!user,
  });

  const updateIntakeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.IntakeSubmission.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      setDetailsOpen(false);
      setSelectedIntake(null);
    },
  });

  const handleStatusChange = (intake, newStatus) => {
    updateIntakeMutation.mutate({
      id: intake.id,
      data: { ...intake, status: newStatus }
    });
  };

  const viewDetails = (intake) => {
    setSelectedIntake(intake);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      "New": "#3B82F6",
      "Contacted": "#F59E0B",
      "Qualified": "#8B5CF6",
      "Converted": "#10B981",
      "Rejected": "#EF4444"
    };
    return colors[status] || "#6B7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "New": Clock,
      "Contacted": Mail,
      "Qualified": CheckCircle,
      "Converted": CheckCircle,
      "Rejected": XCircle
    };
    return icons[status] || Clock;
  };

  const filteredIntakes = intakes.filter(intake => {
    const matchesStatus = filterStatus === 'all' || intake.status === filterStatus;
    const matchesService = filterService === 'all' || intake.service_type === filterService;
    return matchesStatus && matchesService;
  });

  // Stats
  const newIntakes = intakes.filter(i => i.status === 'New').length;
  const qualifiedIntakes = intakes.filter(i => i.status === 'Qualified').length;
  const convertedIntakes = intakes.filter(i => i.status === 'Converted').length;

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
            <h1 className="text-4xl font-bold text-white mb-2">Intake Submissions</h1>
            <p className="text-gray-400">Review and manage incoming leads</p>
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
                    <div className="w-12 h-12 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{newIntakes}</div>
                  <div className="text-sm text-gray-400">New Submissions</div>
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
                    <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{qualifiedIntakes}</div>
                  <div className="text-sm text-gray-400">Qualified Leads</div>
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
                    <div className="w-12 h-12 rounded-xl bg-[#10B981] flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{convertedIntakes}</div>
                  <div className="text-sm text-gray-400">Converted</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Filter by Service</Label>
                  <Select value={filterService} onValueChange={setFilterService}>
                    <SelectTrigger className="bg-[#0B0B0B] border-[#C6A45E]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#C6A45E]/30">
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="Full Infrastructure">Full Infrastructure</SelectItem>
                      <SelectItem value="Single Agent">Single Agent</SelectItem>
                      <SelectItem value="Diagnostic Only">Diagnostic Only</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intake List */}
          <div className="space-y-4">
            {filteredIntakes.map((intake, index) => {
              const StatusIcon = getStatusIcon(intake.status);
              
              return (
                <motion.div
                  key={intake.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20 hover:border-[#12F4FF]/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{intake.client_name}</h3>
                              <Badge style={{backgroundColor: getStatusColor(intake.status)}} className="text-white">
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {intake.status}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3 text-sm mb-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4" />
                                {intake.client_email}
                              </div>
                              {intake.phone && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Phone className="w-4 h-4" />
                                  {intake.phone}
                                </div>
                              )}
                              {intake.company && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Building className="w-4 h-4" />
                                  {intake.company}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4" />
                                {moment(intake.created_date).fromNow()}
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="text-sm text-gray-500 mb-1">Service Interest:</div>
                              <div className="text-[#C6A45E] font-semibold">{intake.service_type}</div>
                            </div>
                            {intake.business_challenges && (
                              <div className="text-sm text-gray-400 line-clamp-2">
                                {intake.business_challenges}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-[#C6A45E]/20">
                        <Button
                          size="sm"
                          onClick={() => viewDetails(intake)}
                          className="bg-[#12F4FF] hover:bg-[#12F4FF]/90 text-black"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(intake, 'Contacted')}
                          className="border-[#C6A45E]/30 text-gray-300"
                          disabled={intake.status !== 'New'}
                        >
                          Mark Contacted
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(intake, 'Qualified')}
                          className="border-[#C6A45E]/30 text-gray-300"
                          disabled={intake.status === 'Converted' || intake.status === 'Rejected'}
                        >
                          Mark Qualified
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(intake, 'Converted')}
                          className="border-[#10B981] text-[#10B981]"
                          disabled={intake.status === 'Converted'}
                        >
                          Convert to Client
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {filteredIntakes.length === 0 && (
              <Card className="backdrop-blur-xl bg-[#111111]/60 border border-[#C6A45E]/20">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No intake submissions found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Details Dialog */}
          {selectedIntake && (
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogContent className="bg-[#111111] border-[#C6A45E]/30 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Intake Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500 text-sm">Name</Label>
                      <div className="text-white font-semibold">{selectedIntake.client_name}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Email</Label>
                      <div className="text-white font-semibold">{selectedIntake.client_email}</div>
                    </div>
                    {selectedIntake.company && (
                      <div>
                        <Label className="text-gray-500 text-sm">Company</Label>
                        <div className="text-white font-semibold">{selectedIntake.company}</div>
                      </div>
                    )}
                    {selectedIntake.phone && (
                      <div>
                        <Label className="text-gray-500 text-sm">Phone</Label>
                        <div className="text-white font-semibold">{selectedIntake.phone}</div>
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-500 text-sm">Service Type</Label>
                      <div className="text-[#C6A45E] font-semibold">{selectedIntake.service_type}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Status</Label>
                      <Badge style={{backgroundColor: getStatusColor(selectedIntake.status)}} className="text-white">
                        {selectedIntake.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedIntake.current_revenue && (
                    <div>
                      <Label className="text-gray-500 text-sm">Current Revenue</Label>
                      <div className="text-white font-semibold">{selectedIntake.current_revenue}</div>
                    </div>
                  )}
                  {selectedIntake.team_size && (
                    <div>
                      <Label className="text-gray-500 text-sm">Team Size</Label>
                      <div className="text-white font-semibold">{selectedIntake.team_size}</div>
                    </div>
                  )}
                  {selectedIntake.business_challenges && (
                    <div>
                      <Label className="text-gray-500 text-sm">Business Challenges</Label>
                      <div className="text-white bg-[#0B0B0B] p-4 rounded-lg border border-[#C6A45E]/20">
                        {selectedIntake.business_challenges}
                      </div>
                    </div>
                  )}
                  {selectedIntake.notes && (
                    <div>
                      <Label className="text-gray-500 text-sm">Notes</Label>
                      <div className="text-white bg-[#0B0B0B] p-4 rounded-lg border border-[#C6A45E]/20">
                        {selectedIntake.notes}
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-500 text-sm">Submitted</Label>
                    <div className="text-white">{moment(selectedIntake.created_date).format('MMMM D, YYYY [at] h:mm A')}</div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}