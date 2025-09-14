'use client';

import React, { useState, useEffect } from 'react';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import InvoiceDetail from '@/components/invoices/InvoiceDetail';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getInvoiceAction, downloadInvoiceAction } from '@/app/actions/invoices';

// Define Invoice interface
interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  created_at: string;
  organization_id: string;
  subscription_id?: string;
  description?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}
import { Loader2 } from 'lucide-react';

interface InvoicesComponentProps {
  invoices: Invoice[];
}

const InvoicesComponent: React.FC<InvoicesComponentProps> = ({ invoices }) => {
  const { organization } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Data is now passed as props, no need for internal fetching

  const handleInvoiceSelect = async (invoice: Invoice) => {
    try {
      // Fetch full invoice details
      const result = await getInvoiceAction(invoice.id);
      
      if (result.success && result.data) {
        setSelectedInvoice(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch invoice details');
      }
    } catch (error) {
      console.error('Failed to fetch invoice details:', error);
      toast.error('Failed to load invoice details');
      // Fallback to the basic invoice data
      setSelectedInvoice(invoice);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setIsDownloading(invoiceId);
    try {
      const result = await downloadInvoiceAction(invoiceId);
      
      if (result.success && result.data) {
        // Create download link
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Invoice downloaded successfully');
      } else {
        throw new Error(result.error || 'Failed to download invoice');
      }
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleBackToList = () => {
    setSelectedInvoice(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading invoices...</span>
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <InvoiceDetail
        invoice={selectedInvoice}
        onBack={handleBackToList}
        onDownload={() => handleDownloadInvoice(selectedInvoice.id)}
        isDownloading={isDownloading === selectedInvoice.id}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your billing invoices
          </p>
        </div>
      </div>

      <InvoiceTable
        invoices={invoices}
        onInvoiceSelect={handleInvoiceSelect}
        onDownloadInvoice={handleDownloadInvoice}
        isDownloading={isDownloading}
      />

      {invoices.length === 0 && (
        <div className="text-center py-12">
          <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No invoices found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any invoices yet. Invoices will appear here when you have active subscriptions.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoicesComponent;
