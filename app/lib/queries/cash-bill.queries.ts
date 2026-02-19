import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys } from '~/lib/queries/keys';
import {
  cashBillService,
  type CashBillFilters,
  type PayBillData,
} from '~/lib/services/cash-bill.service';

/**
 * Cash Bill query factory
 * Defines all cash bill-related queries
 */
export const cashBillQueries = {
  /**
   * Get user's cash bills
   * staleTime: 120s
   */
  my: (filters?: CashBillFilters) =>
    queryOptions({
      queryKey: queryKeys.cashBills.my(filters),
      queryFn: () => cashBillService.getMyBills(filters),
      staleTime: 120 * 1000,
    }),

  /**
   * Get cash bill detail by ID
   * staleTime: 300s
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.cashBills.detail(id),
      queryFn: () => cashBillService.getBillById(id),
      staleTime: 300 * 1000,
      enabled: !!id,
    }),
};

/**
 * Mutation hook for paying a bill
 */
export function usePayBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: PayBillData }) =>
      cashBillService.payBill(billId, data),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cashBills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bendahara.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      toast.success('Bukti pembayaran berhasil diupload');
    },
    onError: () => {
      toast.error('Gagal mengupload bukti pembayaran');
    },
  });
}

/**
 * Mutation hook for canceling a payment
 */
export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) => cashBillService.cancelPayment(billId),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cashBills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bendahara.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      toast.success('Pembayaran berhasil dibatalkan');
    },
    onError: () => {
      toast.error('Gagal membatalkan pembayaran');
    },
  });
}
