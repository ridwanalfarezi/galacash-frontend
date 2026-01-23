import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '~/lib/api/errors'
import { queryKeys } from '~/lib/queries/keys'
import {
  bendaharaService,
  type BendaharaFilters,
  type CreateTransactionData,
} from '~/lib/services/bendahara.service'

/**
 * Bendahara query factory
 * Defines all bendahara-related queries and mutations
 */
export const bendaharaQueries = {
  /**
   * Get bendahara dashboard
   * staleTime: 60s
   */
  dashboard: (params?: { startDate?: string; endDate?: string }) =>
    queryOptions({
      queryKey: queryKeys.bendahara.dashboard(params),
      queryFn: () => bendaharaService.getDashboard(params),
      staleTime: 60 * 1000,
    }),

  /**
   * Get fund application detail by ID
   * staleTime: 300s
   */
  fundApplicationDetail: (id: string) =>
    queryOptions({
      queryKey: ['bendahara', 'fundApplications', 'detail', id] as const,
      queryFn: () => bendaharaService.getFundApplicationDetail(id),
      staleTime: 300 * 1000,
      enabled: !!id,
    }),

  /**
   * Get cash bills for review
   * staleTime: 120s
   */
  cashBills: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: queryKeys.bendahara.cashBills(params),
      queryFn: () => bendaharaService.getCashBills(params),
      staleTime: 120 * 1000,
    }),

  /**
   * Get financial recap (rekap kas)
   * staleTime: 300s
   */
  rekapKas: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: queryKeys.bendahara.rekapKas(params),
      queryFn: () => bendaharaService.getRekapKas(params),
      staleTime: 300 * 1000,
    }),

  /**
   * Get students list
   * staleTime: 300s
   */
  students: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: queryKeys.bendahara.students(params),
      queryFn: () => bendaharaService.getStudents(params),
      staleTime: 300 * 1000,
    }),
}

/**
 * Mutation hooks for bendahara operations
 */

/**
 * Approve fund application mutation
 */
export const useApproveFundApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bendaharaService.approveFundApplication(id),
    onSuccess: () => {
      // Invalidate all fund application related queries
      queryClient.invalidateQueries({ queryKey: ['fund-applications'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Pengajuan dana berhasil disetujui')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menyetujui pengajuan dana'))
    },
  })
}

/**
 * Reject fund application mutation
 */
export const useRejectFundApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      bendaharaService.rejectFundApplication(id, rejectionReason),
    onSuccess: () => {
      // Invalidate all fund application related queries
      queryClient.invalidateQueries({ queryKey: ['fund-applications'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Pengajuan dana berhasil ditolak')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menolak pengajuan dana'))
    },
  })
}

/**
 * Confirm cash bill payment mutation
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (billId: string) => bendaharaService.confirmPayment(billId),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['cash-bills'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Pembayaran berhasil dikonfirmasi')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal mengonfirmasi pembayaran'))
    },
  })
}

/**
 * Reject cash bill payment mutation
 */
export const useRejectPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ billId, reason }: { billId: string; reason?: string }) =>
      bendaharaService.rejectPayment(billId, reason),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['cash-bills'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Pembayaran berhasil ditolak')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menolak pembayaran'))
    },
  })
}

/**
 * Create manual transaction mutation
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionData) => bendaharaService.createTransaction(data),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.bendahara.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.cashBills.all })
      toast.success('Transaksi berhasil dibuat')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal membuat transaksi'))
    },
  })
}
