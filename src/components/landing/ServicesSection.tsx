'use client';
import React from 'react';
import { Camera, Video, Scissors, Home, Heart, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const services = [
  {
    icon: Camera,
    title: 'Photo Editing & Retouching',
    description: 'High-end color correction, skin retouching, background enhancement for portrait & fashion photography.',
    price: 'Starting at $0.50 / photo',
  },
  {
    icon: Video,
    title: 'Video Editing & Color Grading',
    description: 'Cinematic video cutting, timeline assembly, color grading LUT application, and audio balancing.',
    price: 'Starting at $50.00 / minute',
  },
  {
    icon: Scissors,
    title: 'Background Removal',
    description: 'Precise clipping path isolation, white background swaps, and transparent PNG export.',
    price: 'Starting at $1.50 / photo',
  },
  {
    icon: Package,
    title: 'Product Photography Editing',
    description: 'E-commerce standard editing, ghost mannequin, shadow creation, and color matching.',
    price: 'Starting at $1.00 / photo',
  },
  {
    icon: Home,
    title: 'Real Estate Photo Editing',
    description: 'HDR bracket merging, sky replacement, grass greening, and window exposure balancing.',
    price: 'Starting at $3.00 / photo',
  },
  {
    icon: Heart,
    title: 'Wedding Photo & Video Editing',
    description: 'Complete wedding story editing, highlight films, color consistency across hundreds of shots.',
    price: 'Starting at $500.00 / package',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Professional Post-Production Services
          </h2>
          <p className="text-slate-400">
            Tailored creative services powered by industry-leading editors and seamless client review tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card key={idx} className="bg-slate-800/60 border-slate-700 hover:border-indigo-500 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-slate-300 text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <p className="text-indigo-400 font-semibold text-sm">{service.price}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
