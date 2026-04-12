'use client';

import { CreditCard, X } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { formatCurrency } from '~/lib/utils';

interface BatchPaymentBarProps {
  selectedCount: number;
  totalAmount: number;
  onPayClick: () => void;
  onClearSelection: () => void;
}

export function BatchPaymentBar({
  selectedCount,
  totalAmount,
  onPayClick,
  onClearSelection,
}: BatchPaymentBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 fixed inset-x-0 bottom-20 z-50 duration-300 md:bottom-4">
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white/95 px-5 py-3 shadow-xl shadow-blue-50 backdrop-blur-md sm:rounded-3xl sm:px-6 sm:py-4">
          {/* Left side - Selection info */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-11 sm:w-11">
              <CreditCard className="h-5 w-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 sm:text-base">
                {selectedCount} tagihan dipilih
              </p>
              <p className="text-xs font-semibold text-blue-500 sm:text-sm">
                Total: {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-400 hover:text-gray-600"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              className="h-10 rounded-xl bg-blue-500 px-5 text-sm font-bold text-white shadow-md shadow-blue-50 hover:bg-blue-600 sm:h-11 sm:px-6 sm:text-base"
              onClick={onPayClick}
            >
              Bayar Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
