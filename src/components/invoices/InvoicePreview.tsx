'use client';

import React, { useEffect, useState } from 'react';
import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sparkles, Printer, CheckCircle, QrCode, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const InvoicePreview: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
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

  const handlePrint = () => {
    window.print();
  };

  const taxRate = invoice.taxRate || 18;
  const taxAmount = invoice.taxAmount || invoice.subtotal * 0.18;
  const totalAmount = invoice.total || invoice.subtotal + taxAmount;

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between no-print">
        <Badge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>
          STATUS: {invoice.status}
        </Badge>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print / Save PDF
          </Button>
          {invoice.status !== 'PAID' && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Styled Invoice Frame */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-slate-900 dark:text-slate-100 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">PostProd Pro India</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Post-Production & Creative Studio</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {invoice.invoiceNumber}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Issue Date: {formatDate(invoice.createdAt)}</p>
            <p className="text-xs text-slate-400">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">From:</span>
            <p className="font-semibold text-slate-900 dark:text-white">PostProd Pro India HQ</p>
            <p className="text-slate-500 text-xs">Indiranagar 100ft Road, Studio Tower</p>
            <p className="text-slate-500 text-xs">Bangalore, Karnataka - 560038, India</p>
            <p className="text-slate-500 text-xs font-mono">GSTIN: 29AAAAA0000A1Z5</p>
            <p className="text-slate-500 text-xs">billing@postprodpro.com</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To:</span>
            <p className="font-semibold text-slate-900 dark:text-white">
              {invoice.client ? `${invoice.client.firstName} ${invoice.client.lastName}` : 'Valued Client'}
            </p>
            <p className="text-slate-500 text-xs">{invoice.client?.company || 'Client Account'}</p>
            <p className="text-slate-500 text-xs">{invoice.client?.email}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border rounded-xl overflow-hidden border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-xs font-semibold uppercase">
              <tr>
                <th className="p-3 text-left">Description & Service</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price (INR ₹)</th>
                <th className="p-3 text-right">Total (INR ₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {invoice.order?.serviceType || 'Post-Production Photo & Video Retouching'}
                  </p>
                  <p className="text-xs text-slate-400">{invoice.order?.projectName}</p>
                </td>
                <td className="p-3 text-center">1</td>
                <td className="p-3 text-right">{formatCurrency(invoice.subtotal)}</td>
                <td className="p-3 text-right font-semibold">{formatCurrency(invoice.subtotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation Summary & CEO QR Code Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 dark:border-slate-800 pt-4">
          {/* CEO QR Code Picture Section */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-2">
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border-2 border-indigo-500/40 flex items-center justify-center">
              {ceoSettings.qrCodeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ceoSettings.qrCodeUrl}
                  alt="CEO Payment QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <QrCode className="w-24 h-24 text-slate-800" />
              )}
            </div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Scan to Pay via UPI (GPay/Paytm)</p>
            <p className="text-xs font-mono font-bold text-indigo-500">{ceoSettings.upiId}</p>
          </div>

          {/* Subtotal & Tax Breakdown */}
          <div className="w-full sm:w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal Before Tax:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-indigo-500 font-medium">
              <span>GST @ {taxRate}%:</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Discount:</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-base font-bold text-slate-900 dark:text-slate-100">
              <span>Total Amount (INR ₹):</span>
              <span className="text-emerald-500 font-extrabold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Bank Account Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <Building2 className="w-4 h-4 text-indigo-500" /> NEFT / RTGS / IMPS Direct Bank Transfer:
          </div>
          <p>
            Payee: <span className="font-semibold text-slate-900 dark:text-white">{ceoSettings.payeeName}</span> • Bank: <span className="font-semibold text-slate-900 dark:text-white">{ceoSettings.bankName}</span>
          </p>
          <p className="font-mono">
            Account No: <span className="font-bold text-emerald-500">{ceoSettings.accountNumber}</span> • IFSC: <span className="font-semibold text-slate-900 dark:text-white">{ceoSettings.ifscCode}</span>
          </p>
          <p className="pt-1 italic">Thank you for choosing PostProd Pro for your post-production creative workflow!</p>
        </div>
      </div>
    </div>
  );
};
