import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
  dashboard: () =>
    queryOptions({
      queryKey: ['bendahara', 'dashboard'],
      queryFn: () => bendaharaService.getDashboard(),
      staleTime: 60 * 1000,
    }),

  /**
   * Get fund applications for review
   * staleTime: 120s
   */
  fundApplications: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: ['bendahara', 'fund-applications', params],
      queryFn: () => bendaharaService.getFundApplications(params),
      staleTime: 120 * 1000,
    }),

  /**
   * Get cash bills for review
   * staleTime: 120s
   */
  cashBills: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: ['bendahara', 'cash-bills', params],
      queryFn: () => bendaharaService.getCashBills(params),
      staleTime: 120 * 1000,
    }),

  /**
   * Get financial recap (rekap kas)
   * staleTime: 300s
   */
  rekapKas: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: ['bendahara', 'rekap-kas', params],
      queryFn: () => bendaharaService.getRekapKas(params),
      staleTime: 300 * 1000,
    }),

  /**
   * Get students list
   * staleTime: 300s
   */
  students: (params?: BendaharaFilters) =>
    queryOptions({
      queryKey: ['bendahara', 'students', params],
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
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'fund-applications'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Pengajuan dana berhasil disetujui')
    },
    onError: (error: unknown) => {
      const axiosError = error as Record<string, unknown>
      const response = axiosError?.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined
      const errorObj = data?.error as Record<string, unknown> | undefined
      const message = errorObj?.message as string | undefined
      toast.error(message || 'Gagal menyetujui pengajuan dana')
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
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'fund-applications'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'dashboard'] })
      toast.success('Pengajuan dana berhasil ditolak')
    },
    onError: (error: unknown) => {
      const axiosError = error as Record<string, unknown>
      const response = axiosError?.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined
      const errorObj = data?.error as Record<string, unknown> | undefined
      const message = errorObj?.message as string | undefined
      toast.error(message || 'Gagal menolak pengajuan dana')
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
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'cash-bills'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['cash-bills'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Pembayaran berhasil dikonfirmasi')
    },
    onError: (error: unknown) => {
      const axiosError = error as Record<string, unknown>
      const response = axiosError?.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined
      const errorObj = data?.error as Record<string, unknown> | undefined
      const message = errorObj?.message as string | undefined
      toast.error(message || 'Gagal mengonfirmasi pembayaran')
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
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'cash-bills'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['cash-bills'] })
      toast.success('Pembayaran berhasil ditolak')
    },
    onError: (error: unknown) => {
      const axiosError = error as Record<string, unknown>
      const response = axiosError?.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined
      const errorObj = data?.error as Record<string, unknown> | undefined
      const message = errorObj?.message as string | undefined
      toast.error(message || 'Gagal menolak pembayaran')
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
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['bendahara', 'rekap-kas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transaksi berhasil dibuat')
    },
    onError: (error: unknown) => {
      const axiosError = error as Record<string, unknown>
      const response = axiosError?.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined
      const errorObj = data?.error as Record<string, unknown> | undefined
      const message = errorObj?.message as string | undefined
      toast.error(message || 'Gagal membuat transaksi')
    },
  })
}
