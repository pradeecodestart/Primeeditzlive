'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '@/components/shared/FileUploader';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  QrCode,
  Sparkles,
  Camera,
  Film,
  Layers,
  Wand2,
  FileText,
  Copy,
  Building2,
  CheckCircle,
} from 'lucide-react';
import axios from 'axios';

// Service Master Catalog with exact INR Pricing
interface ServiceItem {
  id: string;
  name: string;
  category: 'PHOTO' | 'DESIGN' | 'VIDEO' | 'SOCIAL' | 'AUDIO_VFX';
  unit: string;
  rate: number;
  qty: number;
  selected: boolean;
}

export const OrderForm: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'PHOTO' | 'DESIGN' | 'VIDEO' | 'SOCIAL' | 'AUDIO_VFX'>('PHOTO');

  // CEO QR Code & Bank State
  const [ceoSettings, setCeoSettings] = useState({
    upiId: 'postprodpro@okicici',
    payeeName: 'Antigravity PostProd Pro Studio',
    bankName: 'HDFC Bank',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0001234',
    qrCodeUrl: '',
  });

  useEffect(() => {
    fetch('/api/settings/qr-code')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) setCeoSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  // Client Profile & Project Setup (Page 1)
  const [clientData, setClientData] = useState({
    clientType: 'Professional Photographer',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    billingAddress: '',
    communication: 'Email',
    projectName: '',
    projectType: 'Wedding',
    eventDate: '',
    shootDate: '',
    deliveryDate: '',
    rushRequired: 'NO', // NO, RUSH (+50%), EXPRESS (+100%)
    priority: 'MEDIUM',
  });

  // Transfer & File State (Page 2)
  const [transferData, setTransferData] = useState({
    transferMethod: 'Direct Upload',
    cloudLink: '',
    photoCount: 0,
    videoDuration: 0,
    files: [] as File[],
  });

  // Services Master Catalog (Page 3 - INR Rates)
  const [services, setServices] = useState<ServiceItem[]>([
    // PHOTO
    { id: 'p1', name: 'Photo Culling & Selection', category: 'PHOTO', unit: 'photos', rate: 3, qty: 100, selected: false },
    { id: 'p2', name: 'Basic Color Correction', category: 'PHOTO', unit: 'photos', rate: 8, qty: 50, selected: false },
    { id: 'p3', name: 'Advanced Color Grading', category: 'PHOTO', unit: 'photos', rate: 15, qty: 30, selected: false },
    { id: 'p4', name: 'Cinematic Color Grading', category: 'PHOTO', unit: 'photos', rate: 25, qty: 20, selected: false },
    { id: 'p5', name: 'Basic Retouching', category: 'PHOTO', unit: 'photos', rate: 20, qty: 25, selected: false },
    { id: 'p6', name: 'Advanced Skin Retouching', category: 'PHOTO', unit: 'photos', rate: 50, qty: 15, selected: false },
    { id: 'p7', name: 'Beauty Retouching (Face/Skin)', category: 'PHOTO', unit: 'photos', rate: 40, qty: 10, selected: false },
    { id: 'p8', name: 'Background Removal', category: 'PHOTO', unit: 'photos', rate: 25, qty: 20, selected: false },
    { id: 'p9', name: 'Object Removal / Replacement', category: 'PHOTO', unit: 'photos', rate: 40, qty: 5, selected: false },
    { id: 'p10', name: 'HDR Blending & Real Estate', category: 'PHOTO', unit: 'photos', rate: 50, qty: 15, selected: false },
    { id: 'p11', name: 'Watermarking & Format Conversion', category: 'PHOTO', unit: 'photos', rate: 3, qty: 100, selected: false },

    // DESIGN
    { id: 'd1', name: 'Poster Design', category: 'DESIGN', unit: 'posters', rate: 1500, qty: 1, selected: false },
    { id: 'd2', name: 'Invitation Card Design', category: 'DESIGN', unit: 'designs', rate: 2500, qty: 1, selected: false },
    { id: 'd3', name: 'Thank You Card Design', category: 'DESIGN', unit: 'designs', rate: 2000, qty: 1, selected: false },
    { id: 'd4', name: 'Save the Date Design', category: 'DESIGN', unit: 'designs', rate: 2000, qty: 1, selected: false },
    { id: 'd5', name: 'Wedding Album Layout Design', category: 'DESIGN', unit: 'pages', rate: 400, qty: 30, selected: false },
    { id: 'd6', name: 'Coffee Table Book Layout', category: 'DESIGN', unit: 'pages', rate: 300, qty: 20, selected: false },
    { id: 'd7', name: 'Social Media Graphics', category: 'DESIGN', unit: 'posts', rate: 300, qty: 5, selected: false },

    // VIDEO
    { id: 'v1', name: 'Basic Cutting & Trimming', category: 'VIDEO', unit: 'mins', rate: 200, qty: 10, selected: false },
    { id: 'v2', name: 'Standard Video Editing', category: 'VIDEO', unit: 'mins', rate: 400, qty: 10, selected: false },
    { id: 'v3', name: 'Advanced Video Editing', category: 'VIDEO', unit: 'mins', rate: 600, qty: 10, selected: false },
    { id: 'v4', name: 'Traditional Wedding Edit', category: 'VIDEO', unit: 'mins', rate: 500, qty: 15, selected: false },
    { id: 'v5', name: 'Cinematic Wedding Film', category: 'VIDEO', unit: 'mins', rate: 1000, qty: 15, selected: false },
    { id: 'v6', name: 'Highlight Reel / Teaser (Fixed)', category: 'VIDEO', unit: 'videos', rate: 8000, qty: 1, selected: false },
    { id: 'v7', name: 'Wedding Trailer (3-5 min)', category: 'VIDEO', unit: 'videos', rate: 12000, qty: 1, selected: false },
    { id: 'v8', name: 'Same Day Edit Style', category: 'VIDEO', unit: 'videos', rate: 15000, qty: 1, selected: false },
    { id: 'v9', name: 'Music Video Editing', category: 'VIDEO', unit: 'mins', rate: 1200, qty: 4, selected: false },
    { id: 'v10', name: 'Corporate Promo Video', category: 'VIDEO', unit: 'mins', rate: 600, qty: 5, selected: false },

    // SOCIAL
    { id: 's1', name: 'Instagram Reels Editing', category: 'SOCIAL', unit: 'reels', rate: 1500, qty: 3, selected: false },
    { id: 's2', name: 'YouTube Shorts', category: 'SOCIAL', unit: 'shorts', rate: 1500, qty: 3, selected: false },
    { id: 's3', name: 'TikTok Videos', category: 'SOCIAL', unit: 'videos', rate: 1200, qty: 3, selected: false },
    { id: 's4', name: 'Instagram Stories (15 sec)', category: 'SOCIAL', unit: 'stories', rate: 800, qty: 5, selected: false },
    { id: 's5', name: 'Carousel Posts', category: 'SOCIAL', unit: 'posts', rate: 1000, qty: 2, selected: false },

    // AUDIO_VFX
    { id: 'a1', name: 'Video Color Grading', category: 'AUDIO_VFX', unit: 'mins', rate: 600, qty: 10, selected: false },
    { id: 'a2', name: 'Sound Design & Foley', category: 'AUDIO_VFX', unit: 'mins', rate: 600, qty: 10, selected: false },
    { id: 'a3', name: 'Dialogue Cleaning & Noise Reduction', category: 'AUDIO_VFX', unit: 'mins', rate: 150, qty: 10, selected: false },
    { id: 'a4', name: 'Lower Thirds & Titles', category: 'AUDIO_VFX', unit: 'designs', rate: 800, qty: 3, selected: false },
    { id: 'a5', name: 'Intro / Outro Animation', category: 'AUDIO_VFX', unit: 'videos', rate: 5000, qty: 1, selected: false },
    { id: 'a6', name: 'Green Screen Removal', category: 'AUDIO_VFX', unit: 'mins', rate: 1000, qty: 5, selected: false },
    { id: 'a7', name: 'Subtitles & Captions', category: 'AUDIO_VFX', unit: 'mins', rate: 150, qty: 10, selected: false },
  ]);

  // Creative Brief (Page 4)
  const [briefData, setBriefData] = useState({
    editingStyle: 'Natural & Bright',
    colorPalette: 'Warm tones, vibrant skin tones',
    videoPace: 'Cinematic & Emotional',
    musicPreference: 'Romantic / Cinematic Instrumental',
    aspectRatio: '16:9 Landscape',
    resolution: '4K Ultra HD',
    additionalInstructions: '',
    txnRefId: '',
  });

  // Toggle Service Selection
  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Update Service Quantity
  const updateQty = (id: string, qty: number) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item))
    );
  };

  // Calculate Subtotals & Itemized Invoice Total
  const selectedServices = services.filter((s) => s.selected);
  const baseSubtotal = selectedServices.reduce((sum, s) => sum + s.rate * s.qty, 0);

  // Rush Surcharge Calculation
  const rushMultiplier =
    clientData.rushRequired === 'EXPRESS' ? 1.0 : clientData.rushRequired === 'RUSH' ? 0.5 : 0;
  const rushSurcharge = baseSubtotal * rushMultiplier;

  const subtotalBeforeGst = baseSubtotal + rushSurcharge;
  const gstAmount = subtotalBeforeGst * 0.18; // 18% GST
  const grandTotal = subtotalBeforeGst + gstAmount;

  // 40% / 30% / 30% Payment Schedule Breakdown
  const confirmationDeposit = grandTotal * 0.4;
  const progressPayment = grandTotal * 0.3;
  const finalDeliveryPayment = grandTotal * 0.3;

  const handleCreateOrder = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.post('/api/orders', {
        clientId: clientData.email || 'client-new',
        clientName: clientData.contactPerson || 'Client User',
        projectName: clientData.projectName || 'New Post-Production Project',
        serviceType: selectedServices[0]?.name || 'Photo & Video Editing',
        priority: clientData.priority,
        deadline: clientData.deliveryDate || new Date(Date.now() + 86400000 * 5).toISOString(),
        description: briefData.additionalInstructions,
        totalAmount: grandTotal,
        selectedServices,
        gstAmount,
        subtotalBeforeGst,
      });

      const invoiceId = res.data?.invoice?.id || 'inv-1';
      router.push(`/billing/invoices/${invoiceId}/pay`);
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(ceoSettings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Progress Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
        {[
          { num: 1, label: 'Client & Setup' },
          { num: 2, label: 'Asset Upload' },
          { num: 3, label: 'Select Services (INR)' },
          { num: 4, label: 'Creative Brief' },
          { num: 5, label: 'Itemized Bill & GST' },
          { num: 6, label: 'CEO QR & Checkout' },
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2 shrink-0 pr-4">
            <div
              className={`h-8 w-8 rounded-full font-bold flex items-center justify-center text-xs transition-colors ${
                step === s.num
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold ${
                step === s.num ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-indigo-500/30 bg-slate-900 text-white shadow-2xl">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-300">
            {step === 1 && 'Step 1: Client Profile & Project Setup'}
            {step === 2 && 'Step 2: File Upload & Asset Transfer Options'}
            {step === 3 && 'Step 3: Select Post-Production Services (INR ₹ Rates)'}
            {step === 4 && 'Step 4: Creative Brief & Technical Specifications'}
            {step === 5 && 'Step 5: Itemized Bill & GST Tax Invoice (All in INR ₹)'}
            {step === 6 && 'Step 6: CEO Official Payment QR Code & Order Confirmation'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* STEP 1: CLIENT & PROJECT SETUP */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Client Type
                  </label>
                  <Select
                    value={clientData.clientType}
                    onChange={(e) => setClientData({ ...clientData, clientType: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  >
                    <option value="Professional Photographer">Professional Photographer</option>
                    <option value="Videographer">Videographer</option>
                    <option value="Wedding Planner">Wedding Planner</option>
                    <option value="Event Company">Event Company</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Company Name
                  </label>
                  <Input
                    value={clientData.companyName}
                    onChange={(e) => setClientData({ ...clientData, companyName: e.target.value })}
                    placeholder="e.g. Unique Visual Studios"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Contact Person Name
                  </label>
                  <Input
                    value={clientData.contactPerson}
                    onChange={(e) => setClientData({ ...clientData, contactPerson: e.target.value })}
                    placeholder="Full Name"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    placeholder="you@studio.com"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <Input
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    GST Number (Optional)
                  </label>
                  <Input
                    value={clientData.gstNumber}
                    onChange={(e) => setClientData({ ...clientData, gstNumber: e.target.value })}
                    placeholder="29AAAAA0000A1Z5"
                    className="bg-slate-950 border-slate-700 text-white uppercase"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Project Name
                  </label>
                  <Input
                    value={clientData.projectName}
                    onChange={(e) => setClientData({ ...clientData, projectName: e.target.value })}
                    placeholder="e.g. Sharma Wedding 2024 / Product Shoot"
                    className="bg-slate-950 border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Project Category
                  </label>
                  <Select
                    value={clientData.projectType}
                    onChange={(e) => setClientData({ ...clientData, projectType: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Product">Product</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Music Video">Music Video</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Desired Delivery Date
                  </label>
                  <Input
                    type="date"
                    value={clientData.deliveryDate}
                    onChange={(e) => setClientData({ ...clientData, deliveryDate: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Rush Level Delivery
                  </label>
                  <Select
                    value={clientData.rushRequired}
                    onChange={(e) => setClientData({ ...clientData, rushRequired: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white font-semibold"
                  >
                    <option value="NO">Standard Delivery (Normal Rate)</option>
                    <option value="RUSH">Rush Delivery (+50% Cost, 40% Faster)</option>
                    <option value="EXPRESS">Express Rush (+100% Cost, 60% Faster)</option>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FILE UPLOAD & ASSET TRANSFER */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Select File Transfer Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Direct Upload', 'Google Drive', 'WeTransfer', 'Dropbox'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setTransferData({ ...transferData, transferMethod: method })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        transferData.transferMethod === method
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {transferData.transferMethod !== 'Direct Upload' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Paste Cloud Storage Link ({transferData.transferMethod})
                  </label>
                  <Input
                    value={transferData.cloudLink}
                    onChange={(e) => setTransferData({ ...transferData, cloudLink: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="bg-slate-950 border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              ) : (
                <FileUploader onFilesSelected={(files) => setTransferData({ ...transferData, files })} />
              )}
            </div>
          )}

          {/* STEP 3: POST-PRODUCTION SERVICES SELECTION (ALL INR RATES) */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Category Tabs */}
              <div className="flex border-b border-slate-800 pb-2 overflow-x-auto gap-2">
                {[
                  { key: 'PHOTO', label: '🎨 Photo Editing & Retouching', icon: Camera },
                  { key: 'DESIGN', label: '📐 Album & Graphics Design', icon: Layers },
                  { key: 'VIDEO', label: '🎬 Video Editing', icon: Film },
                  { key: 'SOCIAL', label: '📱 Reels & Shorts', icon: Wand2 },
                  { key: 'AUDIO_VFX', label: '🎵 Color, VFX & Audio', icon: Sparkles },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Service Selection List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2">
                {services
                  .filter((s) => s.category === activeTab)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                        item.selected
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={item.selected}
                          onChange={() => toggleService(item.id)}
                        />
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-indigo-400 font-bold font-mono">
                            {formatCurrency(item.rate)} / {item.unit}
                          </p>
                        </div>
                      </div>

                      {item.selected && (
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">Qty:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-indigo-500/50 rounded-lg p-1 text-center font-bold text-white text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Live Selection Summary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Selected Services: <span className="font-bold text-white">{selectedServices.length} Items</span>
                </span>
                <span className="text-base font-bold text-emerald-400">
                  Base Total: {formatCurrency(baseSubtotal)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: CREATIVE BRIEF */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Photo Editing Color Style
                  </label>
                  <Select
                    value={briefData.editingStyle}
                    onChange={(e) => setBriefData({ ...briefData, editingStyle: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  >
                    <option value="Natural & Bright">Natural & Bright</option>
                    <option value="Dark & Moody">Dark & Moody</option>
                    <option value="Warm Tones">Warm Tones</option>
                    <option value="Film Look">Vintage Film Look</option>
                    <option value="High Contrast">High Contrast</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Video Editing Pace & Mood
                  </label>
                  <Select
                    value={briefData.videoPace}
                    onChange={(e) => setBriefData({ ...briefData, videoPace: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white"
                  >
                    <option value="Cinematic & Emotional">Cinematic & Emotional</option>
                    <option value="Fast-Paced & Dynamic">Fast-Paced & Dynamic</option>
                    <option value="Traditional Documentary">Traditional Documentary</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Specific Editing Instructions / Important Notes
                </label>
                <textarea
                  rows={4}
                  value={briefData.additionalInstructions}
                  onChange={(e) => setBriefData({ ...briefData, additionalInstructions: e.target.value })}
                  placeholder="Mention key shots to highlight, bride/groom priority, music tracks, logo placement..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 5: ITEMIZED BILL & GST TAX INVOICE (INR ₹) */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-300">
                      {clientData.projectName || 'Post-Production Order'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Client: {clientData.contactPerson || 'Client'} ({clientData.companyName || 'Studio'})
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
                    INR TAX INVOICE
                  </span>
                </div>

                {/* Itemized Table */}
                <div className="divide-y divide-slate-800 text-xs">
                  {selectedServices.map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{s.name}</span>
                        <p className="text-[10px] text-slate-400">
                          {s.qty} {s.unit} × {formatCurrency(s.rate)}
                        </p>
                      </div>
                      <span className="font-bold text-white font-mono">
                        {formatCurrency(s.rate * s.qty)}
                      </span>
                    </div>
                  ))}

                  {clientData.rushRequired !== 'NO' && (
                    <div className="py-2.5 flex items-center justify-between text-amber-300">
                      <span className="font-semibold">Rush Surcharge ({clientData.rushRequired})</span>
                      <span className="font-bold font-mono">+{formatCurrency(rushSurcharge)}</span>
                    </div>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal Before Tax:</span>
                    <span className="font-semibold text-white">{formatCurrency(subtotalBeforeGst)}</span>
                  </div>
                  <div className="flex justify-between text-indigo-300">
                    <span>GST @ 18%:</span>
                    <span className="font-semibold">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-emerald-400 border-t border-slate-800 pt-2">
                    <span>GRAND TOTAL AMOUNT (INR ₹):</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Milestone Schedule (40% / 30% / 30%) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">Payment Milestone Schedule</h4>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                    <span className="text-[10px] text-slate-400 block">40% Deposit</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(confirmationDeposit)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">30% Work Progress</span>
                    <span className="font-bold text-white">{formatCurrency(progressPayment)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">30% Final Delivery</span>
                    <span className="font-bold text-white">{formatCurrency(finalDeliveryPayment)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CEO PAYMENT QR CODE & CHECKOUT */}
          {step === 6 && (
            <div className="space-y-6 text-center">
              <div className="max-w-md mx-auto space-y-4 p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-2xl">
                <div className="flex items-center justify-center gap-2 text-indigo-400">
                  <QrCode className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-white">CEO Official Payment QR Code</h3>
                </div>

                {/* CEO Configured Payment QR Code Picture */}
                <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-4 border-indigo-500/50 shadow-2xl flex items-center justify-center">
                  {ceoSettings.qrCodeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ceoSettings.qrCodeUrl}
                      alt="CEO Official Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-900 space-y-2">
                      <QrCode className="w-32 h-32 text-slate-800" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase">Scan to Pay via UPI</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-200">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, or any Banking App
                  </p>
                  <p className="text-emerald-400 font-extrabold text-lg">
                    Amount Payable: {formatCurrency(grandTotal)}
                  </p>
                </div>

                {/* Copyable VPA ID Box */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Official UPI VPA ID</span>
                    <span className="text-xs font-bold text-indigo-300 font-mono">{ceoSettings.upiId}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={copyUpi} className="h-8 text-xs gap-1 border-slate-700">
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                {/* Direct Bank Account Details */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-left text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Payee Name:</span>
                    <span className="font-bold text-white">{ceoSettings.payeeName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Bank & Account:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{ceoSettings.bankName} • {ceoSettings.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>IFSC Code:</span>
                    <span className="font-mono text-white">{ceoSettings.ifscCode}</span>
                  </div>
                </div>

                {/* Transaction Reference ID Input */}
                <div>
                  <label className="block text-left text-xs font-semibold uppercase text-slate-400 mb-1">
                    Enter Transaction Reference UTR ID / Reference No.
                  </label>
                  <Input
                    value={briefData.txnRefId}
                    onChange={(e) => setBriefData({ ...briefData, txnRefId: e.target.value })}
                    placeholder="e.g. 421099887766"
                    className="bg-slate-900 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-slate-800 pt-4 flex justify-between">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
            className="border-slate-700 text-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {step < 6 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              disabled={isSubmitting}
              onClick={handleCreateOrder}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-8 text-base shadow-lg shadow-emerald-600/30 gap-2"
            >
              {isSubmitting ? (
                'Confirming Order...'
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Confirm Order & Submit Payment Receipt
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
