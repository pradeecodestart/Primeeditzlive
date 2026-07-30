import React from 'react';
import Link from 'next/link';
import { Sparkles, Twitter, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PostProd Pro</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              The premier all-in-one management platform for photo, video, and creative post-production teams and clients.
            </p>
            <div className="flex space-x-4 pt-2 text-slate-400">
              <a href="#" className="hover:text-indigo-400"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-indigo-400"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-indigo-400"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-indigo-400"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Press</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">Photo Retouching</Link></li>
              <li><Link href="#" className="hover:text-white">Video Editing</Link></li>
              <li><Link href="#" className="hover:text-white">Color Grading</Link></li>
              <li><Link href="#" className="hover:text-white">Real Estate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Security</Link></li>
              <li><Link href="#" className="hover:text-white">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PostProd Pro. All rights reserved.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 text-slate-400 hover:text-white"
          >
            Back to top <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};
