import { Invoice } from '@/types/invoice';

export async function generateInvoicePDFBlob(invoice: Invoice): Promise<Blob> {
  const content = `
    INVOICE #${invoice.invoiceNumber}
    Client: ${invoice.client?.firstName} ${invoice.client?.lastName} (${invoice.client?.company || 'N/A'})
    Project: ${invoice.order?.projectName || 'N/A'}
    Subtotal: $${invoice.subtotal}
    Tax: $${invoice.taxAmount}
    Total: $${invoice.total}
    Status: ${invoice.status}
  `;
  return new Blob([content], { type: 'application/pdf' });
}
