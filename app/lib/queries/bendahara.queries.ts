import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '~/lib/api/errors';
import { queryKeys } from '~/lib/queries/keys';
import { invalidateFinancialQueries } from '~/lib/queries/query-broadcast';
import {
  bendaharaService,
  type BendaharaFilters,
  type CreateTransactionData,
} from '~/lib/services/bendahara.service';

/**
 * Bendahara query factory
 * Defines all bendahara-related queries and mutations
 */
export const bendaharaQueries = {
  /**
   * Get bendahara dashboard
   * staleTime: 0s (Immediate financial truth)
   */
  dashboard: (params?: { startDate?: string; endDate?: string }) =>
    queryOptions({
      queryKey: queryKeys.bendahara.dashboard(params),
      queryFn: () => bendaharaService.getDashboard(params),
      staleTime: 0,
    }),

  /**
   * Get fund application detail by ID
   * staleTime: 0s
   */
  fundApplicationDetail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.bendahara.fundApplicationDetail(id),
      queryFn: () => bendaharaService.getFundApplicationDetail(id),
      staleTime: 0,
      enabled: !!id,
    }),

  /**
   * Get cash bills for review
   * staleTime: 0s
   */
  cashBills: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: queryKeys.bendahara.cashBills(params),
      queryFn: () => bendaharaService.getCashBills(params),
      staleTime: 0,
    }),

  /**
   * Get financial recap (rekap kas)
   * staleTime: 0s
   */
  rekapKas: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: queryKeys.bendahara.rekapKas(params),
      queryFn: () => bendaharaService.getRekapKas(params),
      staleTime: 0,
    }),

  /**
   * Get students list
   * staleTime: 0s
   */
  students: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: queryKeys.bendahara.students(params),
      queryFn: () => bendaharaService.getStudents(params),
      staleTime: 0,
    }),

  /**
   * Get student detail
   * staleTime: 0s
   */
  studentDetail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.bendahara.studentDetail(id),
      queryFn: () => bendaharaService.getStudentDetail(id),
      staleTime: 0,
      enabled: !!id,
    }),
};

/**
 * Mutation hooks for bendahara operations
 */

/**
 * Approve fund application mutation
 */
export const useApproveFundApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bendaharaService.approveFundApplication(id),
    onSuccess: () => {
      invalidateFinancialQueries(queryClient);
      toast.success('Pengajuan dana berhasil disetujui');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menyetujui pengajuan dana'));
    },
  });
};

/**
 * Reject fund application mutation
 */
export const useRejectFundApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      bendaharaService.rejectFundApplication(id, rejectionReason),
    onSuccess: () => {
      invalidateFinancialQueries(queryClient);
      toast.success('Pengajuan dana berhasil ditolak');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menolak pengajuan dana'));
    },
  });
};

/**
 * Confirm cash bill payment mutation
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) => bendaharaService.confirmPayment(billId),
    onSuccess: () => {
      invalidateFinancialQueries(queryClient);
      toast.success('Pembayaran berhasil dikonfirmasi');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal mengonfirmasi pembayaran'));
    },
  });
};

/**
 * Reject cash bill payment mutation
 */
export const useRejectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, reason }: { billId: string; reason?: string }) =>
      bendaharaService.rejectPayment(billId, reason),
    onSuccess: () => {
      invalidateFinancialQueries(queryClient);
      toast.success('Pembayaran berhasil ditolak');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menolak pembayaran'));
    },
  });
};

/**
 * Create manual transaction mutation
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => bendaharaService.createTransaction(data),
    onSuccess: () => {
      invalidateFinancialQueries(queryClient);
      toast.success('Transaksi berhasil dibuat');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal membuat transaksi'));
    },
  });
};
