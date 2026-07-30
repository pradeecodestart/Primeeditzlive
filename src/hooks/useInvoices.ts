import { useState, useEffect } from 'react';
import axios from 'axios';
import { Invoice } from '@/types/invoice';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/invoices');
      setInvoices(res.data.invoices || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const markAsPaid = async (invoiceId: string) => {
    try {
      const res = await axios.post(`/api/invoices/${invoiceId}/pay`);
      setInvoices((prev) =>
        prev.map((i) => (i.id === invoiceId ? { ...i, status: 'PAID', paidAt: new Date().toISOString() } : i))
      );
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to process payment');
    }
  };

  return {
    invoices,
    isLoading,
    error,
    refetch: fetchInvoices,
    markAsPaid,
  };
}
