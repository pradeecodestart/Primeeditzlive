'use client';
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PortfolioSection } from '@/components/landing/PortfolioSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
