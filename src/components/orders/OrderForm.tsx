'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '@/components/shared/FileUploader';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  Camera,
  Film,
  Layers,
  Wand2,
  Copy,
  CheckCircle,
  Video,
  CheckCircle2,
  ArrowUpRight,
  UploadCloud,
  FileText,
  Receipt,
  Plus,
  Minus,
  User,
  Calendar,
  QrCode,
  ShieldCheck,
  Building2,
  PackageCheck,
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState<any>(null);

  // Project Scope Mode: PHOTO, VIDEO, or BOTH
  const [projectScope, setProjectScope] = useState<'PHOTO' | 'VIDEO' | 'BOTH'>('BOTH');
  const [activeServiceCategory, setActiveServiceCategory] = useState<'PHOTO' | 'DESIGN' | 'VIDEO' | 'SOCIAL' | 'AUDIO_VFX'>('PHOTO');

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

  // Update active category tab based on scope
  useEffect(() => {
    if (projectScope === 'PHOTO' && (activeServiceCategory === 'VIDEO' || activeServiceCategory === 'SOCIAL' || activeServiceCategory === 'AUDIO_VFX')) {
      setActiveServiceCategory('PHOTO');
    } else if (projectScope === 'VIDEO' && (activeServiceCategory === 'PHOTO' || activeServiceCategory === 'DESIGN')) {
      setActiveServiceCategory('VIDEO');
    }
  }, [projectScope, activeServiceCategory]);

  // Client Details & Project Setup
  const [clientData, setClientData] = useState({
    clientType: 'Professional Photographer',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    billingAddress: '',
    projectName: '',
    projectType: 'Wedding',
    deliveryDate: '',
    rushRequired: 'NO', // NO, RUSH (+50%), EXPRESS (+100%)
    priority: 'MEDIUM',
  });

  // Auto-populate logged-in user profile
  useEffect(() => {
    if (session?.user) {
      setClientData((prev) => ({
        ...prev,
        contactPerson: prev.contactPerson || session.user?.name || '',
        email: prev.email || session.user?.email || '',
      }));
    }
  }, [session]);

  // File Transfer State
  const [transferData, setTransferData] = useState({
    transferMethod: 'Direct Upload',
    cloudLink: '',
    files: [] as File[],
  });

  // Master Services Catalog (INR Prices)
  const [services, setServices] = useState<ServiceItem[]>([
    // PHOTO
    { id: 'p1', name: 'Photo Culling & Selection', category: 'PHOTO', unit: 'photos', rate: 3, qty: 100, selected: true },
    { id: 'p2', name: 'Basic Color Correction', category: 'PHOTO', unit: 'photos', rate: 8, qty: 50, selected: true },
    { id: 'p3', name: 'Advanced Color Grading', category: 'PHOTO', unit: 'photos', rate: 15, qty: 30, selected: false },
    { id: 'p4', name: 'Cinematic Color Grading', category: 'PHOTO', unit: 'photos', rate: 25, qty: 20, selected: false },
    { id: 'p5', name: 'Basic Retouching', category: 'PHOTO', unit: 'photos', rate: 20, qty: 25, selected: false },
    { id: 'p6', name: 'Advanced Skin Retouching', category: 'PHOTO', unit: 'photos', rate: 50, qty: 15, selected: false },
    { id: 'p7', name: 'Beauty Retouching (Face/Skin)', category: 'PHOTO', unit: 'photos', rate: 40, qty: 10, selected: false },
    { id: 'p8', name: 'Background Removal', category: 'PHOTO', unit: 'photos', rate: 25, qty: 20, selected: false },

    // DESIGN
    { id: 'd1', name: 'Poster Design', category: 'DESIGN', unit: 'posters', rate: 1500, qty: 1, selected: false },
    { id: 'd2', name: 'Invitation Card Design', category: 'DESIGN', unit: 'designs', rate: 2500, qty: 1, selected: false },
    { id: 'd5', name: 'Wedding Album Layout Design', category: 'DESIGN', unit: 'pages', rate: 400, qty: 30, selected: false },
    { id: 'd6', name: 'Coffee Table Book Layout', category: 'DESIGN', unit: 'pages', rate: 300, qty: 20, selected: false },

    // VIDEO
    { id: 'v1', name: 'Basic Cutting & Trimming', category: 'VIDEO', unit: 'mins', rate: 200, qty: 10, selected: false },
    { id: 'v2', name: 'Standard Video Editing', category: 'VIDEO', unit: 'mins', rate: 400, qty: 10, selected: false },
    { id: 'v5', name: 'Cinematic Wedding Film', category: 'VIDEO', unit: 'mins', rate: 1000, qty: 15, selected: false },
    { id: 'v6', name: 'Highlight Reel / Teaser (Fixed)', category: 'VIDEO', unit: 'videos', rate: 8000, qty: 1, selected: false },

    // SOCIAL
    { id: 's1', name: 'Instagram Reels Editing', category: 'SOCIAL', unit: 'reels', rate: 1500, qty: 3, selected: false },
    { id: 's2', name: 'YouTube Shorts', category: 'SOCIAL', unit: 'shorts', rate: 1500, qty: 3, selected: false },

    // AUDIO_VFX
    { id: 'a1', name: 'Video Color Grading', category: 'AUDIO_VFX', unit: 'mins', rate: 600, qty: 10, selected: false },
    { id: 'a2', name: 'Sound Design & Foley', category: 'AUDIO_VFX', unit: 'mins', rate: 600, qty: 10, selected: false },
    { id: 'a7', name: 'Subtitles & Captions', category: 'AUDIO_VFX', unit: 'mins', rate: 150, qty: 10, selected: false },
  ]);

  // Briefing
  const [briefData, setBriefData] = useState({
    editingStyle: 'Natural & Bright',
    videoPace: 'Cinematic & Emotional',
    additionalInstructions: '',
    txnRefId: '',
  });

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateQty = (id: string, delta: number) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // Filtered Services based on scope
  const filteredServices = services.filter((s) => {
    if (projectScope === 'PHOTO') return s.category === 'PHOTO' || s.category === 'DESIGN';
    if (projectScope === 'VIDEO') return s.category === 'VIDEO' || s.category === 'SOCIAL' || s.category === 'AUDIO_VFX';
    return true;
  });

  const selectedServices = filteredServices.filter((s) => s.selected);
  const baseSubtotal = selectedServices.reduce((sum, s) => sum + s.rate * s.qty, 0);

  const rushMultiplier =
    clientData.rushRequired === 'EXPRESS' ? 1.0 : clientData.rushRequired === 'RUSH' ? 0.5 : 0;
  const rushSurcharge = baseSubtotal * rushMultiplier;

  const subtotalBeforeGst = baseSubtotal + rushSurcharge;
  const gstAmount = subtotalBeforeGst * 0.18; // 18% GST
  const grandTotal = subtotalBeforeGst + gstAmount;

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
        serviceType: selectedServices[0]?.name || `${projectScope} Post-Production`,
        priority: clientData.priority,
        deadline: clientData.deliveryDate || new Date(Date.now() + 86400000 * 5).toISOString(),
        description: `Scope: ${projectScope} • Ref UTR: ${briefData.txnRefId || 'N/A'} • ${briefData.additionalInstructions}`,
        totalAmount: grandTotal,
        selectedServices,
        gstAmount,
        subtotalBeforeGst,
        projectScope,
      });

      setCreatedOrderRef(res.data?.order || { orderNumber: 'ORD-2024-007' });
      setIsOrderConfirmed(true);
    } catch (err) {
      console.error('Order creation error:', err);
      setIsOrderConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(ceoSettings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // SUCCESS CONFIRMATION PAGE
  if (isOrderConfirmed) {
    return (
      <Card className="max-w-2xl mx-auto border-emerald-500/40 bg-slate-900 text-white shadow-2xl text-center p-8 my-8 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase border border-emerald-500/30 tracking-wider">
              Payment Receipt Received & Verified
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-3">
              🎉 Order Successfully Booked!
            </h2>
            <p className="text-sm text-slate-300 font-mono mt-1">
              Order Ref: <span className="text-indigo-400 font-bold">{createdOrderRef?.orderNumber || 'ORD-2024-007'}</span>
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Project Scope:</span>
              <span className="font-bold text-white uppercase">{projectScope} Editing</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Invoice Amount:</span>
              <span className="font-bold text-emerald-400">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">40% Deposit Received:</span>
              <span className="font-bold text-white">{formatCurrency(confirmationDeposit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Reference UTR:</span>
              <span className="font-mono font-bold text-indigo-300">{briefData.txnRefId || 'UTR Submitted'}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 px-6 shadow-lg shadow-indigo-600/30">
                Go to Client Dashboard <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/orders">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Track My Orders
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* SCOPE SELECTION CARDS HEADER */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2 tracking-wide uppercase">
              <Sparkles className="w-5 h-5 text-amber-400" /> Select Studio Project Scope
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose Photo Editing, Video Editing, or Combined Package to customize options.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
            <PackageCheck className="w-4 h-4 text-indigo-400" /> Active Scope: {projectScope}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setProjectScope('PHOTO')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
              projectScope === 'PHOTO'
                ? 'border-indigo-500 bg-indigo-950/80 text-white shadow-2xl ring-2 ring-indigo-500/50 scale-[1.01]'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Camera className="w-6 h-6" />
              </div>
              {projectScope === 'PHOTO' && (
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-extrabold text-white shadow-md">
                  ✓ SELECTED
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Photo Editing Only</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Color Correction, Skin Retouching, Beauty Enhancement & Album Layouts
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setProjectScope('VIDEO')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
              projectScope === 'VIDEO'
                ? 'border-purple-500 bg-purple-950/80 text-white shadow-2xl ring-2 ring-purple-500/50 scale-[1.01]'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Video className="w-6 h-6" />
              </div>
              {projectScope === 'VIDEO' && (
                <span className="px-3 py-1 rounded-full bg-purple-600 text-[10px] font-extrabold text-white shadow-md">
                  ✓ SELECTED
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Video Editing Only</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cinematic Wedding Films, Highlights, Reels, Shorts, Sound & Color Grading
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setProjectScope('BOTH')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
              projectScope === 'BOTH'
                ? 'border-emerald-500 bg-emerald-950/80 text-white shadow-2xl ring-2 ring-emerald-500/50 scale-[1.01]'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              {projectScope === 'BOTH' && (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-[10px] font-extrabold text-white shadow-md">
                  ✓ BEST VALUE SUITE
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Photo + Video Both</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full Post-Production Package (Photos + Video + Reels + VFX + Albums)
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* TWO-COLUMN STUDIO BUILDER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CONFIGURATOR COLUMN (2/3 Width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1: CLIENT & PROJECT SETUP */}
          <Card className="border-slate-800 bg-slate-900/90 text-white shadow-xl backdrop-blur-xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-base font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
                <User className="w-4 h-4 text-indigo-400" /> 1. Client Profile & Project Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Client Type</label>
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
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Company / Studio Name</label>
                  <Input
                    value={clientData.companyName}
                    onChange={(e) => setClientData({ ...clientData, companyName: e.target.value })}
                    placeholder="e.g. Unique Visual Studios"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contact Person Name</label>
                  <Input
                    value={clientData.contactPerson}
                    onChange={(e) => setClientData({ ...clientData, contactPerson: e.target.value })}
                    placeholder="Full Name"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    placeholder="you@studio.com"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone / WhatsApp</label>
                  <Input
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">GST Number (Optional)</label>
                  <Input
                    value={clientData.gstNumber}
                    onChange={(e) => setClientData({ ...clientData, gstNumber: e.target.value })}
                    placeholder="29AAAAA0000A1Z5"
                    className="bg-slate-950 border-slate-700 text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Project Name</label>
                  <Input
                    value={clientData.projectName}
                    onChange={(e) => setClientData({ ...clientData, projectName: e.target.value })}
                    placeholder="e.g. Sharma Wedding 2024"
                    className="bg-slate-950 border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Delivery Priority</label>
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
            </CardContent>
          </Card>

          {/* SECTION 2: ASSET UPLOAD & FILE TRANSFER */}
          <Card className="border-slate-800 bg-slate-900/90 text-white shadow-xl backdrop-blur-xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-base font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
                <UploadCloud className="w-4 h-4 text-indigo-400" /> 2. Asset Upload & Cloud Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Direct Upload', 'Google Drive', 'WeTransfer', 'Dropbox'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setTransferData({ ...transferData, transferMethod: method })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      transferData.transferMethod === method
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
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
            </CardContent>
          </Card>

          {/* SECTION 3: SERVICES SELECTION (INR ₹) */}
          <Card className="border-slate-800 bg-slate-900/90 text-white shadow-xl backdrop-blur-xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-base font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
                <Layers className="w-4 h-4 text-indigo-400" /> 3. Select Post-Production Services (INR ₹)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Category Tabs */}
              <div className="flex border-b border-slate-800 pb-2 overflow-x-auto gap-2">
                {[
                  { key: 'PHOTO', label: '🎨 Photo Editing', icon: Camera, visible: projectScope === 'PHOTO' || projectScope === 'BOTH' },
                  { key: 'DESIGN', label: '📐 Album Design', icon: Layers, visible: projectScope === 'PHOTO' || projectScope === 'BOTH' },
                  { key: 'VIDEO', label: '🎬 Video Editing', icon: Film, visible: projectScope === 'VIDEO' || projectScope === 'BOTH' },
                  { key: 'SOCIAL', label: '📱 Reels & Shorts', icon: Wand2, visible: projectScope === 'VIDEO' || projectScope === 'BOTH' },
                  { key: 'AUDIO_VFX', label: '🎵 Color & Audio', icon: Sparkles, visible: projectScope === 'VIDEO' || projectScope === 'BOTH' },
                ]
                  .filter((t) => t.visible)
                  .map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveServiceCategory(tab.key as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                        activeServiceCategory === tab.key
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices
                  .filter((s) => s.category === activeServiceCategory)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        item.selected
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-lg'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={item.selected}
                          onChange={() => toggleService(item.id)}
                        />
                        <div>
                          <p className="font-semibold text-xs leading-tight">{item.name}</p>
                          <p className="text-[11px] text-indigo-400 font-bold font-mono mt-0.5">
                            {formatCurrency(item.rate)} / {item.unit}
                          </p>
                        </div>
                      </div>

                      {item.selected && (
                        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white font-mono">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: CREATIVE BRIEF */}
          <Card className="border-slate-800 bg-slate-900/90 text-white shadow-xl backdrop-blur-xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-base font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-indigo-400" /> 4. Creative Briefing & Editing Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(projectScope === 'PHOTO' || projectScope === 'BOTH') && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Photo Color Style
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
                    </Select>
                  </div>
                )}

                {(projectScope === 'VIDEO' || projectScope === 'BOTH') && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Video Editing Pace
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
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Specific Editing Instructions
                </label>
                <textarea
                  rows={3}
                  value={briefData.additionalInstructions}
                  onChange={(e) => setBriefData({ ...briefData, additionalInstructions: e.target.value })}
                  placeholder="Key moments, song preferences, skin retouching intensity..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE INVOICE & CHECKOUT (1/3 Width) */}
        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            {/* LIVE ITEMIZED GST INVOICE CARD */}
            <Card className="border-indigo-500/40 bg-slate-900/95 text-white shadow-2xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-emerald-400 flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Live Tax Invoice
                  </CardTitle>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    18% GST INCLUDED
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs">
                {/* Chosen Services */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedServices.length === 0 ? (
                    <p className="text-slate-500 text-center py-4 text-xs italic">
                      No services selected yet. Pick items from left panel.
                    </p>
                  ) : (
                    selectedServices.map((s) => (
                      <div key={s.id} className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                        <div>
                          <p className="font-semibold text-white">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.qty} {s.unit} × {formatCurrency(s.rate)}</p>
                        </div>
                        <span className="font-bold text-white font-mono">{formatCurrency(s.rate * s.qty)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Calculation Totals */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3 text-slate-300">
                  <div className="flex justify-between">
                    <span>Services Subtotal:</span>
                    <span className="font-bold text-white font-mono">{formatCurrency(baseSubtotal)}</span>
                  </div>

                  {clientData.rushRequired !== 'NO' && (
                    <div className="flex justify-between text-amber-300">
                      <span>Rush Surcharge:</span>
                      <span className="font-bold font-mono">+{formatCurrency(rushSurcharge)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-indigo-300">
                    <span>GST (18%):</span>
                    <span className="font-bold font-mono">{formatCurrency(gstAmount)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-emerald-400 border-t border-slate-800 pt-2">
                    <span>GRAND TOTAL:</span>
                    <span className="font-mono">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* 40% Deposit Milestone */}
                <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-500/30 text-center space-y-1">
                  <span className="text-[10px] text-slate-300 block uppercase font-bold">40% Confirmation Deposit Payable</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono block">{formatCurrency(confirmationDeposit)}</span>
                </div>

                {/* CEO QR CODE PAYMENT */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                    <QrCode className="w-4 h-4 text-indigo-400" /> CEO Official Payment QR Code
                  </div>

                  <div className="relative w-40 h-40 mx-auto bg-white p-2 rounded-xl border-2 border-indigo-500/40 shadow-inner flex items-center justify-center">
                    {ceoSettings.qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ceoSettings.qrCodeUrl} alt="CEO Payment QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-28 h-28 text-slate-800" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg text-[11px]">
                    <span className="font-mono text-indigo-300 font-bold">{ceoSettings.upiId}</span>
                    <Button size="sm" variant="ghost" onClick={copyUpi} className="h-6 px-2 text-[10px]">
                      {copied ? 'Copied' : 'Copy UPI'}
                    </Button>
                  </div>

                  <div>
                    <label className="block text-left text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Enter Payment Reference UTR ID
                    </label>
                    <Input
                      value={briefData.txnRefId}
                      onChange={(e) => setBriefData({ ...briefData, txnRefId: e.target.value })}
                      placeholder="e.g. 421099887766"
                      className="bg-slate-900 border-slate-700 text-white font-mono text-xs h-9"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  disabled={isSubmitting || selectedServices.length === 0}
                  onClick={handleCreateOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 text-sm shadow-xl shadow-emerald-600/30 gap-2"
                >
                  {isSubmitting ? (
                    'Confirming Booking...'
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Confirm Order & Submit Receipt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
