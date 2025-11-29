import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function FeaturedTestimonials() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: async () => {
      const all = await base44.entities.Testimonial.filter({ featured: true, approved: true });
      return all.slice(0, 3);
    }
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0B0B0B] to-[#0E0E0E]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-400">
            Real results from real businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/20 h-full">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-[#D4AF37] mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(testimonial.rating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.testimonial_text}"
                  </p>

                  {testimonial.results_achieved && (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-green-400 font-semibold text-sm">
                        {testimonial.results_achieved}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {testimonial.avatar_url && (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.client_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-semibold">{testimonial.client_name}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.client_title && `${testimonial.client_title}, `}
                        {testimonial.client_company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}