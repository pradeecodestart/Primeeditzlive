'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '@/components/shared/FileUploader';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check, DollarSign, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export const OrderForm: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clientId: 'bob-martinez-id',
    projectName: '',
    serviceType: 'Photo Editing',
    priority: 'MEDIUM',
    deadline: '',
    description: '',
    // Customization Photo
    photoCount: 50,
    editingLevel: 'Standard',
    colorCorrection: true,
    backgroundRemoval: false,
    skinRetouching: 'Light',
    outputFormat: 'JPG',
    resolution: '300dpi',
    // Customization Video
    videoDuration: 5,
    videoColorGrading: 'Cinematic',
    audioMixing: true,
    motionGraphics: false,
    // Files
    files: [] as File[],
    specialInstructions: '',
    agreeTerms: false,
  });

  // Calculate live total amount
  const calculateTotal = () => {
    let base = 0;
    if (formData.serviceType.includes('Photo') || formData.serviceType === 'Background Removal' || formData.serviceType === 'Real Estate Editing') {
      const perPhoto = formData.editingLevel === 'Basic' ? 0.50 : formData.editingLevel === 'Standard' ? 1.00 : 2.00;
      base = formData.photoCount * perPhoto;
      if (formData.backgroundRemoval) base += formData.photoCount * 0.5;
    } else if (formData.serviceType.includes('Video') || formData.serviceType === 'Color Grading') {
      base = formData.videoDuration * 50;
      if (formData.motionGraphics) base += 100;
    } else if (formData.serviceType === 'Wedding Package') {
      base = 500;
    }
    if (formData.priority === 'URGENT') base *= 1.3;
    return base;
  };

  const currentTotal = calculateTotal();

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.post('/api/orders', {
        clientId: formData.clientId,
        projectName: formData.projectName || 'Untitled Order',
        serviceType: formData.serviceType,
        priority: formData.priority,
        deadline: formData.deadline || new Date(Date.now() + 86400000 * 3).toISOString(),
        description: formData.description,
        totalAmount: currentTotal,
        customizations: {
          photoCount: formData.photoCount,
          editingLevel: formData.editingLevel,
          skinRetouching: formData.skinRetouching,
          outputFormat: formData.outputFormat,
        },
      });

      const invoiceId = res.data?.invoice?.id || 'inv-2';
      // Directly connect order booking to Payment Gateway page for instant client checkout!
      router.push(`/billing/invoices/${invoiceId}/pay`);
    } catch (err) {
      console.error(err);
      // Fallback redirect to payment gateway
      router.push('/billing/invoices/inv-2/pay');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between">
        {[
          { num: 1, label: 'Client & Project' },
          { num: 2, label: 'Customization & Pricing' },
          { num: 3, label: 'File Upload' },
          { num: 4, label: 'Review & Pay' },
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2">
            <div
              className={`h-9 w-9 rounded-full font-bold flex items-center justify-center text-sm transition-colors ${
                step === s.num
                  ? 'bg-indigo-600 text-white'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {step > s.num ? <Check className="h-5 w-5" /> : s.num}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-300">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">
            {step === 1 && 'Step 1: Client & Project Info'}
            {step === 2 && 'Step 2: Customization Options & Live Price'}
            {step === 3 && 'Step 3: Asset Upload'}
            {step === 4 && 'Step 4: Order Review & Direct Payment Checkout'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Project Name</label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Summer Fashion Collection 2024"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Service Type</label>
                  <Select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="Photo Editing">Photo Editing & Retouching</option>
                    <option value="Video Editing (Basic)">Video Editing (Basic)</option>
                    <option value="Color Grading">Color Grading</option>
                    <option value="Background Removal">Background Removal</option>
                    <option value="Real Estate Editing">Real Estate Photo Editing</option>
                    <option value="Wedding Package">Wedding Package</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority</label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low (Flexible SLA)</option>
                    <option value="MEDIUM">Medium (Standard 48h)</option>
                    <option value="HIGH">High (Fast 24h)</option>
                    <option value="URGENT">Urgent (Rush 12h +30%)</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Deadline</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Project Overview</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide context about shooting environment, desired style, guidelines..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {formData.serviceType.includes('Photo') || formData.serviceType === 'Background Removal' ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                          Number of Photos ({formData.photoCount})
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="500"
                          step="5"
                          value={formData.photoCount}
                          onChange={(e) => setFormData({ ...formData, photoCount: Number(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Editing Level</label>
                        <Select
                          value={formData.editingLevel}
                          onChange={(e) => setFormData({ ...formData, editingLevel: e.target.value })}
                        >
                          <option value="Basic">Basic ($0.50/photo)</option>
                          <option value="Standard">Standard ($1.00/photo)</option>
                          <option value="Advanced">Advanced ($2.00/photo)</option>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Skin Retouching Pass</label>
                        <Select
                          value={formData.skinRetouching}
                          onChange={(e) => setFormData({ ...formData, skinRetouching: e.target.value })}
                        >
                          <option value="None">None</option>
                          <option value="Light">Light & Natural</option>
                          <option value="Heavy">Heavy Beauty Retouch</option>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                          Video Duration ({formData.videoDuration} mins)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="60"
                          value={formData.videoDuration}
                          onChange={(e) => setFormData({ ...formData, videoDuration: Number(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Live Price Calculator Widget */}
                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-indigo-500/40 shadow-xl">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-bold text-sm uppercase">Live Price Calculator</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span>Service: {formData.serviceType}</span>
                      <span>Estimated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority Surge ({formData.priority}):</span>
                      <span>{formData.priority === 'URGENT' ? '+30%' : 'Standard'}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-bold text-white">
                      <span>Total Estimated Cost:</span>
                      <span className="text-emerald-400">{formatCurrency(currentTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Upload your raw photos, video clips, or ZIP archive for the editing team.
              </p>
              <FileUploader onFilesSelected={(files) => setFormData({ ...formData, files })} />
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-indigo-300">{formData.projectName || 'Untitled Order'}</h4>
                    <p className="text-xs text-slate-400">Service: {formData.serviceType} • Priority: {formData.priority}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Order Amount</div>
                    <div className="text-2xl font-bold text-emerald-400">{formatCurrency(currentTotal)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Instant payment via Credit Card, UPI, PayPal, Apple Pay, Net Banking or EMI
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e: any) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  I accept the PostProd Pro Terms of Service & SLA Delivery Agreement.
                </span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              disabled={isSubmitting}
              onClick={handleSubmitOrder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base gap-2 px-6 h-12 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? (
                'Processing Order...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Proceed to Pay {formatCurrency(currentTotal * 1.1)} <Lock className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
