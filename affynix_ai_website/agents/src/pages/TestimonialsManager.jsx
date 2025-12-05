import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, XCircle, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialsManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Testimonial.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setShowForm(false);
      setEditingTestimonial(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Testimonial.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setShowForm(false);
      setEditingTestimonial(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['testimonials'])
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      client_name: formData.get('client_name'),
      client_company: formData.get('client_company'),
      client_title: formData.get('client_title'),
      testimonial_text: formData.get('testimonial_text'),
      rating: parseFloat(formData.get('rating')),
      avatar_url: formData.get('avatar_url'),
      video_url: formData.get('video_url'),
      results_achieved: formData.get('results_achieved'),
      featured: formData.get('featured') === 'on',
      approved: formData.get('approved') === 'on'
    };

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleFeatured = (testimonial) => {
    updateMutation.mutate({
      id: testimonial.id,
      data: { ...testimonial, featured: !testimonial.featured }
    });
  };

  const toggleApproved = (testimonial) => {
    updateMutation.mutate({
      id: testimonial.id,
      data: { ...testimonial, approved: !testimonial.approved }
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Testimonials Manager</h1>
            <p className="text-gray-400">Manage client testimonials and reviews</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTestimonial(null);
            }}
            className="bg-[#D4AF37] hover:bg-[#E6C878] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Client Name *</Label>
                        <Input
                          name="client_name"
                          required
                          defaultValue={editingTestimonial?.client_name}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Company *</Label>
                        <Input
                          name="client_company"
                          required
                          defaultValue={editingTestimonial?.client_company}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Job Title</Label>
                        <Input
                          name="client_title"
                          defaultValue={editingTestimonial?.client_title}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Rating (1-5) *</Label>
                        <Input
                          name="rating"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          required
                          defaultValue={editingTestimonial?.rating || 5}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Testimonial Text *</Label>
                      <Textarea
                        name="testimonial_text"
                        required
                        rows={4}
                        defaultValue={editingTestimonial?.testimonial_text}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Results Achieved</Label>
                      <Input
                        name="results_achieved"
                        placeholder="e.g., 80% cost savings, 200+ hours saved/month"
                        defaultValue={editingTestimonial?.results_achieved}
                        className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Avatar URL</Label>
                        <Input
                          name="avatar_url"
                          placeholder="https://..."
                          defaultValue={editingTestimonial?.avatar_url}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Video URL</Label>
                        <Input
                          name="video_url"
                          placeholder="https://youtube.com/..."
                          defaultValue={editingTestimonial?.video_url}
                          className="bg-[#0E0E0E] border-[#D4AF37]/20 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={editingTestimonial?.featured}
                          className="w-4 h-4"
                        />
                        Feature on Homepage
                      </label>
                      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="approved"
                          defaultChecked={editingTestimonial?.approved}
                          className="w-4 h-4"
                        />
                        Approved for Display
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="bg-[#D4AF37] hover:bg-[#E6C878] text-black"
                      >
                        {editingTestimonial ? 'Update' : 'Create'} Testimonial
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setEditingTestimonial(null);
                        }}
                        className="border-[#D4AF37]/30 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{testimonial.client_name}</h3>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(testimonial.rating)
                                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        {testimonial.client_title && `${testimonial.client_title}, `}
                        {testimonial.client_company}
                      </p>
                      {testimonial.results_achieved && (
                        <Badge className="bg-green-500/20 text-green-400 mb-3">
                          {testimonial.results_achieved}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {testimonial.featured && (
                        <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {testimonial.approved ? (
                        <Badge className="bg-green-500/20 text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 italic">"{testimonial.testimonial_text}"</p>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setShowForm(true);
                      }}
                      className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFeatured(testimonial)}
                      className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10"
                    >
                      {testimonial.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleApproved(testimonial)}
                      className={testimonial.approved ? "border-yellow-500/30 text-yellow-400" : "border-green-500/30 text-green-400"}
                    >
                      {testimonial.approved ? 'Unapprove' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Delete this testimonial?')) {
                          deleteMutation.mutate(testimonial.id);
                        }
                      }}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {testimonials.length === 0 && !isLoading && (
          <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20">
            <CardContent className="p-12 text-center">
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No testimonials yet. Add your first one!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}