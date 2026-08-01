'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const InvoiceForm: React.FC = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [subtotal, setSubtotal] = useState('100.00');
  const [taxRate, setTaxRate] = useState('10.0');
  const [discount, setDiscount] = useState('0.00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sub = parseFloat(subtotal) || 0;
  const tax = (sub * (parseFloat(taxRate) || 0)) / 100;
  const disc = parseFloat(discount) || 0;
  const total = sub + tax - disc;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await axios.post('/api/invoices', {
        orderId: orderId || 'ORD-2024-001',
        subtotal: sub,
        taxRate: parseFloat(taxRate),
        discount: disc,
        total,
      });
      router.push('/invoices');
    } catch (err) {
      console.error(err);
      router.push('/invoices');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Select Order</label>
            <Select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">Choose Order...</option>
              <option value="ORD-2024-001">ORD-2024-001 - Summer Fashion Catalog</option>
              <option value="ORD-2024-002">ORD-2024-002 - Luxury Villa Real Estate Photos</option>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subtotal ($)</label>
              <Input value={subtotal} onChange={(e) => setSubtotal(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tax Rate (%)</label>
              <Input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Discount ($)</label>
              <Input value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white font-bold text-base flex justify-between">
            <span>Calculated Total:</span>
            <span className="text-green-400">{formatCurrency(total)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={() => router.push('/invoices')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
            {isSubmitting ? 'Generating...' : 'Generate Invoice'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
