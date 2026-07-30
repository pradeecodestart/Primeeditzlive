'use client';
import React from 'react';
import { Invoice } from '@/types/invoice';
import { InvoicePreview } from './InvoicePreview';

export const InvoicePDF: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return <InvoicePreview invoice={invoice} />;
};
