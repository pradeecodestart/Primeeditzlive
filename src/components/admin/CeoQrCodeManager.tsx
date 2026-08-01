'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QrCode, Upload, Save, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

export const CeoQrCodeManager: React.FC = () => {
  const [settings, setSettings] = useState({
    upiId: 'postprodpro@okicici',
    payeeName: 'Antigravity PostProd Pro Studio',
    bankName: 'HDFC Bank',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0001234',
    qrCodeUrl: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/settings/qr-code');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error fetching CEO QR settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, qrCodeUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSaveSuccess(false);

      const res = await fetch('/api/settings/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setError(data.error || 'Failed to update payment QR Code settings');
      }
    } catch (err: any) {
      setError(err.message || 'Server error while saving QR settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-indigo-500/30 bg-slate-900 text-white shadow-2xl">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">CEO Payment QR Code & Bank Setup</CardTitle>
              <p className="text-xs text-slate-400">
                Upload or modify official studio UPI QR Code & bank details visible on client invoices.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CEO Exclusive Authorization
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            Payment QR Code & Bank details successfully updated live! Clients will see this on all bills.
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Upload & Preview */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Official Payment QR Code Image
            </label>

            <div className="border-2 border-dashed border-indigo-500/40 rounded-2xl p-6 text-center bg-slate-950/60 hover:border-indigo-400 transition-all">
              {settings.qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="w-48 h-48 mx-auto bg-white p-2 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={settings.qrCodeUrl} alt="CEO Payment QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Active Custom QR Code Image Loaded
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <QrCode className="w-12 h-12 text-indigo-400 mx-auto opacity-80" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Upload CEO Official Payment QR Code</p>
                    <p className="text-xs text-slate-400">GPay, PhonePe, Paytm, PhonePe Merchant QR (.png, .jpg)</p>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all">
                  <Upload className="w-4 h-4" />
                  {settings.qrCodeUrl ? 'Change QR Code Picture' : 'Upload QR Code Picture'}
                  <input type="file" accept="image/*" onChange={handleQrFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* UPI & Bank Details Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                UPI VPA ID (Google Pay / PhonePe)
              </label>
              <Input
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="e.g. postprodpro@okicici"
                className="bg-slate-950 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Payee Account Holder Name
              </label>
              <Input
                value={settings.payeeName}
                onChange={(e) => setSettings({ ...settings, payeeName: e.target.value })}
                placeholder="e.g. Antigravity PostProd Studio"
                className="bg-slate-950 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Bank Name</label>
                <Input
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                  placeholder="e.g. HDFC Bank"
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">IFSC Code</label>
                <Input
                  value={settings.ifscCode}
                  onChange={(e) => setSettings({ ...settings, ifscCode: e.target.value })}
                  placeholder="e.g. HDFC0001234"
                  className="bg-slate-950 border-slate-700 text-white uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Account Number (NEFT/RTGS)
              </label>
              <Input
                value={settings.accountNumber}
                onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                placeholder="e.g. 50200088991122"
                className="bg-slate-950 border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-800 pt-4 flex justify-between">
        <p className="text-xs text-slate-400">
          Last Updated by: <span className="text-slate-200 font-medium">{settings.payeeName}</span>
        </p>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 px-6 shadow-lg shadow-emerald-600/30"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving Payment Settings...' : 'Save & Publish QR Code'}
        </Button>
      </CardFooter>
    </Card>
  );
};
