'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            PostProd Pro
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="#services" className="hover:text-indigo-600 transition-colors">Services</Link>
          <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link>
          <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link href="#portfolio" className="hover:text-indigo-600 transition-colors">Portfolio</Link>
          <Link href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
          <Link href="#contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <Link href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Services</Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">How It Works</Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Pricing</Link>
          <Link href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Portfolio</Link>
          <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Contact</Link>
          <div className="pt-4 flex flex-col space-y-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-indigo-600">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
