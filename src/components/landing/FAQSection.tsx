'use client';
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the ordering process work?',
    answer: 'Simply log in to your PostProd Pro dashboard, select the service type (Photo, Video, Real Estate, etc.), configure custom editing options, drag & drop your RAW or preview files, and submit. You will track live timeline progress in real time.',
  },
  {
    question: 'What file formats do you accept?',
    answer: 'We accept all major camera RAW formats (CR2, CR3, NEF, ARW, DNG), high-res JPEG, PNG, TIFF, and video formats including MP4, MOV, and ProRes files.',
  },
  {
    question: 'What are your standard turnaround times?',
    answer: 'Standard photo retouching is delivered within 24 to 48 hours. Urgent rush turnaround (12h) is available for pro subscribers.',
  },
  {
    question: 'How do revisions work?',
    answer: 'If you need any adjustments, click "Request Revision" on your order page with specific line notes. Revisions are free of charge within 7 days of delivery.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, Amex), PayPal, bank transfers, and automated invoice payments.',
  },
  {
    question: 'Is my raw media data secure?',
    answer: 'Yes! All uploaded files are stored in encrypted cloud storage buckets and deleted automatically after 30 days of completion unless archived.',
  },
  {
    question: 'Do you offer custom enterprise packages?',
    answer: 'Absolutely. High-volume studios can request dedicated editing teams, custom SLAs, and custom API access.',
  },
  {
    question: 'How do I track my order status?',
    answer: 'You will receive real-time dashboard timeline updates, email notifications, and optional SMS alerts as your order moves from Pending to Review and Completed.',
  },
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">
            Got questions? We have answers. If you need further help, feel free to contact our support team.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="bg-slate-800/50 border-slate-700/80 rounded-xl px-6">
              <AccordionTrigger className="text-white hover:text-indigo-400 font-semibold text-left py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
