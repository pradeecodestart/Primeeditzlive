'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, CreditCard, Building2,
  Smartphone, Globe, Bitcoin, Wallet,
  Clock, CheckCircle, ArrowLeft
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import { PaymentSummary } from '@/components/billing/PaymentSummary';
import { CreditCardForm } from '@/components/billing/PaymentMethods/CreditCardForm';
import { DebitCardForm } from '@/components/billing/PaymentMethods/DebitCardForm';
import { UPIForm } from '@/components/billing/PaymentMethods/UPIForm';
import { NetBankingForm } from '@/components/billing/PaymentMethods/NetBankingForm';
import { PayPalButton } from '@/components/billing/PaymentMethods/PayPalButton';
import { CryptoPayment } from '@/components/billing/PaymentMethods/CryptoPayment';
import { BankTransferForm } from '@/components/billing/PaymentMethods/BankTransferForm';
import { WalletPayment } from '@/components/billing/PaymentMethods/WalletPayment';
import { EMIOptions } from '@/components/billing/PaymentMethods/EMIOptions';
import { Button } from '@/components/ui/button';

type PaymentMethodType =
  | 'credit_card'
  | 'debit_card'
  | 'upi'
  | 'net_banking'
  | 'paypal'
  | 'crypto'
  | 'bank_transfer'
  | 'wallet'
  | 'emi';

interface PaymentMethod {
  id: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  processingTime: string;
  fee: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    label: 'Credit Card',
    description: 'Visa, Mastercard, Amex, Discover',
    icon: CreditCard,
    badge: 'POPULAR',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    processingTime: 'Instant',
    fee: 'Free'
  },
  {
    id: 'upi',
    label: 'UPI Payment',
    description: 'GPay, PhonePe, Paytm, BHIM',
    icon: Smartphone,
    badge: 'INSTANT',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    processingTime: 'Instant',
    fee: 'Free'
  },
  {
    id: 'net_banking',
    label: 'Net Banking',
    description: '50+ banks supported',
    icon: Building2,
    processingTime: '1-2 mins',
    fee: 'Free'
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: Globe,
    badge: 'SECURE',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    processingTime: 'Instant',
    fee: 'Standard'
  },
  {
    id: 'wallet',
    label: 'Digital Wallets',
    description: 'Apple Pay, Google Pay, Amazon Pay',
    icon: Wallet,
    badge: 'FAST',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    processingTime: 'Instant',
    fee: 'Free'
  },
  {
    id: 'emi',
    label: 'EMI / Installments',
    description: '3, 6, 12 month plans',
    icon: Clock,
    badge: '0% COST',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    processingTime: 'Instant',
    fee: '0%'
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    description: 'Direct wire / SWIFT / ACH',
    icon: Building2,
    processingTime: '1-2 days',
    fee: 'Free'
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    description: 'BTC, ETH, USDT, USDC',
    icon: Bitcoin,
    badge: 'WEB3',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    processingTime: '5-15 mins',
    fee: 'Network'
  }
];

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await fetch(`/api/billing/invoices/${id}`);
      return res.json();
    }
  });

  const handlePaymentSuccess = (paymentData: any) => {
    router.push(`/billing/payment-success?paymentId=${paymentData.paymentId || 'pay-1'}&amount=${invoice?.total || 165}`);
  };

  const handlePaymentError = (error: string) => {
    alert(error || 'Payment failed. Please try again.');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Banner */}
      <div className="bg-emerald-600/90 text-white text-center py-2 text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
        <Shield className="h-3.5 w-3.5" /> 256-BIT SSL ENCRYPTED PAYMENT GATEWAY • PCI DSS COMPLIANT
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Invoice Payment</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Invoice #{invoice?.invoiceNumber || 'PP-INV-2024-045'} • Due {formatDate(invoice?.dueDate || new Date())}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Payment Gateways */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-400" /> Select Payment Gateway
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      selectedMethod === method.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {method.badge && (
                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded border ${method.badgeColor}`}>
                        {method.badge}
                      </span>
                    )}

                    <method.icon className={`h-5 w-5 mb-2 ${selectedMethod === method.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <div className="font-semibold text-sm">{method.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">{method.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dynamic Payment Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMethod}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedMethod === 'credit_card' && (
                    <CreditCardForm
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'debit_card' && (
                    <DebitCardForm
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'upi' && (
                    <UPIForm
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'net_banking' && (
                    <NetBankingForm
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'paypal' && (
                    <PayPalButton
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'crypto' && (
                    <CryptoPayment
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'bank_transfer' && (
                    <BankTransferForm
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'wallet' && (
                    <WalletPayment
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  {selectedMethod === 'emi' && (
                    <EMIOptions
                      invoice={invoice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Summary */}
          <div>
            <PaymentSummary invoice={invoice} selectedMethod={selectedMethod} />
          </div>
        </div>
      </div>
    </div>
  );
}
