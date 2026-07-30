'use client';
import React from 'react';
import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sparkles, Printer, Download, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const InvoicePreview: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const handlePrint = () => {
    window.print();
  };

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
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
              <h2 className="text-xl font-bold">PostProd Pro Inc.</h2>
              <p className="text-xs text-slate-400">Professional Creative Services</p>
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
            <p className="font-semibold">PostProd Pro HQ</p>
            <p className="text-slate-500 text-xs">123 Studio Street, Suite 400</p>
            <p className="text-slate-500 text-xs">New York, NY 10001</p>
            <p className="text-slate-500 text-xs">billing@postprodpro.com</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To:</span>
            <p className="font-semibold">{invoice.client ? `${invoice.client.firstName} ${invoice.client.lastName}` : 'Client Name'}</p>
            <p className="text-slate-500 text-xs">{invoice.client?.company || 'Personal Account'}</p>
            <p className="text-slate-500 text-xs">{invoice.client?.email}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border rounded-xl overflow-hidden border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-xs font-semibold uppercase">
              <tr>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {invoice.order?.serviceType || 'Post-Production Retouching'}
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

        {/* Calculation Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax ({invoice.taxRate}%):</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Discount:</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-base font-bold text-slate-900 dark:text-slate-100">
              <span>Total Amount:</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-600 dark:text-slate-300">Payment Terms: Net 15</p>
          <p>Bank Transfer: First National Bank • Account: XXXX-XXXX-1234 • SWIFT: FNBUS33</p>
          <p>Thank you for choosing PostProd Pro for your creative workflows!</p>
        </div>
      </div>
    </div>
  );
};
