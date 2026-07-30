'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, CheckCircle2, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-slate-950 text-white">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 blur-3xl pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Next-Gen Creative Operations Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
          >
            Transform Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Post-Production
            </span>{' '}
            Workflow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Manage photo retouching, video editing, invoicing, real-time client chat, and editor teams in one beautifully integrated system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-13 px-8 text-base shadow-xl hover:opacity-90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#portfolio">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 h-13 px-8 text-base">
                <Play className="h-4 w-4 mr-2 text-indigo-400" /> Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Floating Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto"
          >
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-slate-400">Happy Clients</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <CheckCircle2 className="mx-auto h-6 w-6 text-green-400 mb-2" />
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-sm text-slate-400">Projects Delivered</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <Sparkles className="mx-auto h-6 w-6 text-purple-400 mb-2" />
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-slate-400">Satisfaction Rate</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
