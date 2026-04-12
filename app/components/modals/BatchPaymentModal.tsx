'use client';

import { Copy, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { usePayBillsBatch } from '~/lib/queries/cash-bill.queries';
import { formatCurrency } from '~/lib/utils';

import { Icons } from '../icons';

interface BatchBillItem {
  id: string;
  month: string;
  billId: string;
  totalAmount: number;
}

interface BatchPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: BatchBillItem[];
  onSuccess: () => void;
}

export function BatchPaymentModal({ isOpen, onClose, bills, onSuccess }: BatchPaymentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank' | 'cash' | undefined>(
    undefined
  );
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const { mutate: payBillsBatch, isPending } = usePayBillsBatch();

  const grandTotal = bills.reduce((sum, b) => sum + b.totalAmount, 0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUploadProof = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setPaymentProof(file);
      // Revoke previous object URL to prevent memory leak
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPaymentProof(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      toast.error('Pilih metode pembayaran terlebih dahulu');
      return;
    }
    if (selectedPaymentMethod !== 'cash' && !paymentProof) {
      toast.error('Upload bukti pembayaran terlebih dahulu');
      return;
    }

    payBillsBatch(
      {
        billIds: bills.map((b) => b.id),
        paymentMethod: selectedPaymentMethod,
        ...(paymentProof ? { paymentProof } : {}),
      },
      {
        onSuccess: () => {
          // Reset state
          setSelectedPaymentMethod(undefined);
          setPaymentProof(null);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
          onSuccess();
          onClose();
        },
      }
    );
  };

  const handleCopyAccountNumber = async (accountNumber: string) => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(accountNumber);
      toast.success('Nomor rekening disalin');
    } catch {
      toast.error('Gagal menyalin nomor rekening');
    } finally {
      setIsCopying(false);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setSelectedPaymentMethod(undefined);
      setPaymentProof(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="space-y-4 text-left">
          <DialogTitle className="text-2xl font-semibold">Bayar {bills.length} Tagihan</DialogTitle>
        </DialogHeader>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="space-y-6">
          {/* Bill Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Ringkasan Tagihan</h3>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-100 p-3">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-gray-900">{bill.month}</p>
                    <p className="font-mono text-xs text-gray-400">{bill.billId}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-500">
                    {formatCurrency(bill.totalAmount)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total Pembayaran</span>
              <Badge
                variant="default"
                className="bg-blue-500 px-3 py-1 text-base font-bold text-white hover:bg-blue-600"
              >
                {formatCurrency(grandTotal)}
              </Badge>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Metode Pembayaran</Label>

            <button
              onClick={() => setSelectedPaymentMethod('bank')}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border-3 p-4 text-left transition-colors ${
                selectedPaymentMethod === 'bank'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-900 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <Icons.Bank
                className={`h-5 w-5 ${selectedPaymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-900'}`}
              />
              <span
                className={`font-medium ${selectedPaymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-900'}`}
              >
                Bank
              </span>
            </button>

            <button
              onClick={() => setSelectedPaymentMethod('cash')}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border-3 p-4 text-left transition-colors ${
                selectedPaymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-900 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <Icons.Money
                className={`h-5 w-5 ${selectedPaymentMethod === 'cash' ? 'text-blue-500' : 'text-gray-900'}`}
              />
              <span
                className={`font-medium ${selectedPaymentMethod === 'cash' ? 'text-blue-500' : 'text-gray-900'}`}
              >
                Cash
              </span>
            </button>
          </div>

          {/* Bank Account Details */}
          {selectedPaymentMethod === 'bank' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-500 p-4">
                <div>
                  <p className="font-medium">Bank Mandiri a.n Fathya Khairani</p>
                  <p className="text-sm text-gray-500">156-00-2062920-2</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isCopying}
                    onClick={() => handleCopyAccountNumber('156-00-2062920-2')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {selectedPaymentMethod !== 'cash' && (
              <Button variant="outline" className="w-full" onClick={handleUploadProof}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Bukti Pembayaran
              </Button>
            )}

            {/* File Preview Section */}
            {paymentProof && (
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{paymentProof.name}</p>
                      <p className="text-xs text-gray-500">
                        {(paymentProof.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-blue-500 font-bold text-white hover:bg-blue-600"
              onClick={handlePayNow}
              disabled={isPending}
            >
              {isPending
                ? 'Memproses...'
                : `Bayar ${bills.length} Tagihan — ${formatCurrency(grandTotal)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
