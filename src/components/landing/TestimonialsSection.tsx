'use client';
import React from 'react';
import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'David Miller',
    company: 'Apex Media Studio',
    review: 'PostProd Pro saved us over 20 hours per week in editor communication and file delivery tracking. Unmatched quality!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Elena Rostova',
    company: 'Vogue Motion Lab',
    review: 'The turnaround speed for high-end fashion retouching is extraordinary. Clients love using the real-time chat dashboard.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Marcus Vance',
    company: 'Vance Real Estate Photography',
    review: 'HDR sky replacements and real estate edits are delivered in under 12 hours cleanly every single time.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sarah Jenkins',
    company: 'Bliss Wedding Films',
    review: 'Our wedding highlight edits went from 2 weeks delivery to 3 days! My clients praise the fast turnaround.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Carlos Ruiz',
    company: 'SoleStyle E-commerce',
    review: 'Clean background removals for thousands of footwear products without missing a single deadline.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Amanda Lin',
    company: 'Lumina Creative Agency',
    review: 'Invoicing, editor assignments, client approvals—everything is seamlessly automated. Best software investment we made.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Trusted by Top Creative Studios
          </h2>
          <p className="text-slate-400">
            Hear from real creative directors, studio leads, and agency owners about their PostProd Pro experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic">"{t.review}"</p>
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <Avatar src={t.avatar} fallback={t.name.slice(0, 2)} />
                <div>
                  <h4 className="font-semibold text-sm text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
