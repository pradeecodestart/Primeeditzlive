'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Film, Image as ImageIcon, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  category: 'Video' | 'Photography' | 'Real Estate' | 'Wedding';
  title: string;
  client: string;
  before: string;
  after: string;
  videoUrl?: string;
  rating: number;
  description: string;
  tags: string[];
}

const GALLERY_SHOWCASE: GalleryItem[] = [
  {
    id: 'g1',
    category: 'Wedding',
    title: 'Smith & Co. Cinematic Wedding Highlight Reel',
    client: 'Martinez Weddings',
    before: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    description: '4K Color grading, skin tone normalization, and audio soundscape design for a 12-hour wedding event.',
    tags: ['Color Grading', 'DaVinci Resolve', 'Audio Master', '4K Render'],
  },
  {
    id: 'g2',
    category: 'Photography',
    title: 'High-Fashion Vogue Beauty Retouching Pass',
    client: 'Apex Fashion Magazine',
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'High-end frequency separation skin retouching, stray hair cleanup, and dynamic color balance.',
    tags: ['Frequency Separation', 'Beauty Skin Pass', 'Dodge & Burn'],
  },
  {
    id: 'g3',
    category: 'Real Estate',
    title: 'Luxury Beverly Hills Mansion HDR Sky Replacement',
    client: 'Skyline Architecture',
    before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    description: 'Multi-exposure HDR flash blending, window view pull, grass greening, and dusk sky replacement.',
    tags: ['HDR Blending', 'Window Pull', 'Sky Replacement'],
  },
  {
    id: 'g4',
    category: 'Video',
    title: 'Commercial Nike Brand Promo Worked Footage',
    client: 'Apex Creative Agency',
    before: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'High-energy motion graphics cut, kinetic lower thirds, speed ramps, and LUT application.',
    tags: ['Motion Graphics', 'Speed Ramp', 'Commercial Edit'],
  },
];

export const PortfolioSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeItem, setActiveItem] = useState<GalleryItem>(GALLERY_SHOWCASE[0]);

  const filteredItems = activeCategory === 'All'
    ? GALLERY_SHOWCASE
    : GALLERY_SHOWCASE.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 inline" /> Official Company Showcase Gallery
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Worked Footages & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Post-Production Proofs</span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed">
            Explore recent completed projects delivered by our post-production studio. Slide to compare raw source clips with final color-graded and retouched master renders.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {['All', 'Wedding', 'Photography', 'Real Estate', 'Video'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const firstMatch = cat === 'All' ? GALLERY_SHOWCASE[0] : GALLERY_SHOWCASE.find((i) => i.category === cat);
                  if (firstMatch) setActiveItem(firstMatch);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat === 'All' ? '🎥 All Worked Footages' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Interactive Before/After Worked Footage Player */}
        <div className="max-w-5xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">{activeItem.category} SHOWCASE</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeItem.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {activeItem.rating.toFixed(1)} Client Rating
                </span>
              </div>
            </div>

            {/* Interactive Image/Video Slider Box */}
            <div className="relative h-[360px] sm:h-[480px] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl select-none group">
              {/* After Image */}
              <img
                src={activeItem.after}
                alt="After Final Master Edit"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Before Image with Clip Width */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={activeItem.before}
                  alt="Before Raw Footage"
                  className="h-full w-full object-cover max-w-none"
                  style={{ width: '100%', minWidth: '900px' }}
                />
              </div>

              {/* Slider Line Divider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl flex items-center justify-center z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="h-10 w-10 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-2xl text-sm border-2 border-indigo-600">
                  ↔
                </div>
              </div>

              {/* Range Input Slider Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              />

              {/* Badges Overlay */}
              <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 border border-white/20">
                RAW SOURCE FOOTAGE
              </span>
              <span className="absolute bottom-4 right-4 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                FINAL PROOF & COLOR GRADE ✓
              </span>
            </div>

            {/* Description & Tags */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
              <p className="text-sm text-slate-300 max-w-2xl">{activeItem.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {activeItem.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-400 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto pt-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                activeItem.id === item.id
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg scale-[1.02]'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                <img src={item.after} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  {item.category}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-1 truncate">{item.client}</p>
            </div>
          ))}
        </div>

        {/* Booking CTA Banner */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-bold text-white">Ready to Elevate Your Photo & Video Projects?</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Book your post-production order now. Upload raw camera files and get instant live SLA price estimates.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold gap-2">
                Client Portal Login <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/staff/login">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                Staff Portal Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
