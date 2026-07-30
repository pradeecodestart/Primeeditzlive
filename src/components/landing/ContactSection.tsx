'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '@/lib/validations';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
import { Mail, Phone, Clock, Send } from 'lucide-react';

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactSection: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setToastMessage('Thank you! Your message has been sent successfully.');
    reset();
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 text-white relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Get In Touch With Our Studio
              </h2>
              <p className="text-slate-400">
                Have a large project or special post-production requirement? Send us a message and our production lead will respond within 1 hour.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Email Us</h4>
                  <p className="text-xs text-slate-400">hello@postprodpro.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Call Direct</h4>
                  <p className="text-xs text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Studio Hours</h4>
                  <p className="text-xs text-slate-400">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                <Input {...register('name')} placeholder="John Smith" className="bg-slate-800 border-slate-700 text-white" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                  <Input {...register('email')} type="email" placeholder="john@example.com" className="bg-slate-800 border-slate-700 text-white" />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
                  <Input {...register('phone')} placeholder="+1 (555) 000-0000" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Service Required</label>
                <Select {...register('service')} className="bg-slate-800 border-slate-700 text-white">
                  <option value="">Select Service...</option>
                  <option value="photo">Photo Editing & Retouching</option>
                  <option value="video">Video Editing & Color Grading</option>
                  <option value="realestate">Real Estate Photo Editing</option>
                  <option value="wedding">Wedding Package Edit</option>
                  <option value="custom">Enterprise / Custom</option>
                </Select>
                {errors.service && <p className="text-xs text-red-400 mt-1">{errors.service.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Project Message</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Describe your project, deadlines, volume of files..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
    </section>
  );
};
