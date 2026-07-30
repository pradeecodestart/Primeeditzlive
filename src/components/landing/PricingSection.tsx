'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const discount = billingCycle === 'yearly' ? 0.8 : 1;

  const plans = [
    {
      name: 'Basic',
      price: Math.round(29 * discount),
      description: 'Ideal for freelance photographers and small studio setups.',
      features: [
        '50 photos / month',
        'Basic color & lighting correction',
        '48h turnaround time',
        'Email & portal support',
        'Standard JPEG & PNG output',
      ],
      cta: 'Start Basic Plan',
      popular: false,
    },
    {
      name: 'Professional',
      price: Math.round(79 * discount),
      description: 'For busy media agencies & professional photography studios.',
      features: [
        '200 photos / month',
        'Advanced skin retouching & background edit',
        '24h turnaround time',
        'Priority chat support',
        '5 min video editing included',
        'RAW & TIFF export options',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Full-scale post-production solution for high volume teams.',
      features: [
        'Unlimited monthly projects',
        'Dedicated senior editor team',
        'Custom 12h turnaround SLAs',
        '24/7 dedicated manager & API access',
        'Custom workflow integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-950 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Transparent Pricing Plans
          </h2>
          <p className="text-slate-400">
            Choose the perfect post-production tier for your business scale. No hidden fees.
          </p>

          {/* Billing Cycle Selector */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Yearly Billing <span className="ml-1 text-xs text-green-400 font-bold">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 shadow-2xl scale-105'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === 'number' && <span className="text-slate-400 text-sm"> / month</span>}
                </div>

                <ul className="space-y-3 mb-8 text-sm text-slate-300">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center">
                      <Check className="h-4 w-4 text-indigo-400 mr-3 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register">
                <Button
                  className={`w-full h-11 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
