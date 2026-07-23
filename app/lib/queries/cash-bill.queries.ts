import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys } from '~/lib/queries/keys';
import { invalidateFinancialQueries } from '~/lib/queries/query-broadcast';
import {
  cashBillService,
  type CashBillFilters,
  type PayBillData,
  type PayBillsBatchData,
} from '~/lib/services/cash-bill.service';

type BillRecord = Record<string, unknown>;

function updateBillStatus(items: BillRecord[], billId: string): BillRecord[] {
  return items.map((item) =>
    item.id === billId ? { ...item, status: 'menunggu_konfirmasi' } : item
  );
}

export function markBillAwaitingConfirmation(oldData: unknown, billId: string): unknown {
  if (!oldData || typeof oldData !== 'object') return oldData;

  if (Array.isArray(oldData)) {
    return updateBillStatus(oldData as BillRecord[], billId);
  }

  const data = oldData as Record<string, unknown>;
  for (const collectionKey of ['data', 'items', 'bills'] as const) {
    const collection = data[collectionKey];
    if (Array.isArray(collection)) {
      return {
        ...data,
        [collectionKey]: updateBillStatus(collection as BillRecord[], billId),
      };
    }
  }

  return oldData;
}

/**
 * Cash Bill query factory
 * Defines all cash bill-related queries
 */
export const cashBillQueries = {
  /**
   * Get user's cash bills
   * staleTime: 0s (Immediate financial truth)
   */
  my: (filters?: CashBillFilters) =>
    queryOptions({
      queryKey: queryKeys.cashBills.my(filters),
      queryFn: () => cashBillService.getMyBills(filters),
      staleTime: 0,
    }),

  /**
   * Get cash bill detail by ID
   * staleTime: 0s
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.cashBills.detail(id),
      queryFn: () => cashBillService.getBillById(id),
      staleTime: 0,
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
    onMutate: async ({ billId }) => {
      // 1. Cancel ongoing re-fetches so in-flight responses won't overwrite optimistic updates
      await queryClient.cancelQueries({ queryKey: queryKeys.cashBills.all });

      // 2. Snapshot current cash bill queries
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.cashBills.all });

      // 3. Optimistically update local query cache entries matching cash bills
      queryClient.setQueriesData({ queryKey: queryKeys.cashBills.all }, (oldData: unknown) =>
        markBillAwaitingConfirmation(oldData, billId)
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback to previous queries snapshot on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Gagal mengupload bukti pembayaran');
    },
    onSuccess: () => {
      toast.success('Bukti pembayaran berhasil diupload');
    },
    onSettled: () => {
      // Revalidate all financial projections and broadcast cross-tab sync
      invalidateFinancialQueries(queryClient);
    },
  });
}

/**
 * Mutation hook for paying multiple bills at once
 */
export function usePayBillsBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayBillsBatchData) => cashBillService.payBillsBatch(data),
    onSuccess: (_data, variables) => {
      toast.success(`${variables.billIds.length} tagihan berhasil dibayar`);
    },
    onError: () => {
      toast.error('Gagal mengupload bukti pembayaran');
    },
    onSettled: () => {
      invalidateFinancialQueries(queryClient);
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
      toast.success('Pembayaran berhasil dibatalkan');
    },
    onError: () => {
      toast.error('Gagal membatalkan pembayaran');
    },
    onSettled: () => {
      invalidateFinancialQueries(queryClient);
    },
  });
}
