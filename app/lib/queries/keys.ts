import type { TransactionFilters } from '~/lib/services/transaction.service'

import type { BendaharaFilters } from '../services/bendahara.service'

// ============================================================================
// Query Keys Factory
// ============================================================================

/**
 * Centralized query keys for consistent cache management
 *
 * Usage:
 * - queryKey: queryKeys.transactions.list(filters)
 * - invalidate: queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
 */
export const queryKeys = {
  // -------------------------------------------------------------------------
  // Transactions
  // -------------------------------------------------------------------------
  transactions: {
    all: ['transactions'] as const,
    list: (filters?: TransactionFilters) =>
      [...queryKeys.transactions.all, 'list', filters] as const,
    recent: (limit: number) => [...queryKeys.transactions.all, 'recent', limit] as const,
    detail: (id: string) => [...queryKeys.transactions.all, 'detail', id] as const,
    chart: (params: { type: 'income' | 'expense'; startDate?: string; endDate?: string }) =>
      [...queryKeys.transactions.all, 'chart', params] as const,
  },

  // -------------------------------------------------------------------------
  // Cash Bills
  // -------------------------------------------------------------------------
  cashBills: {
    all: ['cash-bills'] as const,
    my: (filters?: { status?: string; limit?: number; page?: number }) =>
      [...queryKeys.cashBills.all, 'my', filters] as const,
    detail: (id: string) => [...queryKeys.cashBills.all, 'detail', id] as const,
  },

  // -------------------------------------------------------------------------
  // Fund Applications
  // -------------------------------------------------------------------------
  fundApplications: {
    all: ['fund-applications'] as const,
    my: (filters?: { status?: string; limit?: number; page?: number }) =>
      [...queryKeys.fundApplications.all, 'my', filters] as const,
    detail: (id: string) => [...queryKeys.fundApplications.all, 'detail', id] as const,
  },

  // -------------------------------------------------------------------------
  // Dashboard
  // -------------------------------------------------------------------------
  dashboard: {
    all: ['dashboard'] as const,
    summary: (params?: { startDate?: string; endDate?: string }) =>
      [...queryKeys.dashboard.all, 'summary', params] as const,
  },

  // -------------------------------------------------------------------------
  // User
  // -------------------------------------------------------------------------
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
  },

  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // -------------------------------------------------------------------------
  // Bendahara
  // -------------------------------------------------------------------------
  bendahara: {
    all: ['bendahara'] as const,
    dashboard: () => [...queryKeys.bendahara.all, 'dashboard'] as const,
    fundApplications: (filters?: BendaharaFilters) =>
      [...queryKeys.bendahara.all, 'fund-applications', filters] as const,
    cashBills: (filters?: BendaharaFilters) =>
      [...queryKeys.bendahara.all, 'cash-bills', filters] as const,
    students: (filters?: BendaharaFilters) =>
      [...queryKeys.bendahara.all, 'students', filters] as const,
    rekapKas: (filters?: BendaharaFilters) =>
      [...queryKeys.bendahara.all, 'rekap-kas', filters] as const,
  },
} as const

// ============================================================================
// Invalidation Helpers
// ============================================================================

/**
 * Get keys to invalidate after a transaction is created/updated
 */
export const getTransactionInvalidationKeys = () => [
  queryKeys.transactions.all,
  queryKeys.dashboard.all,
  queryKeys.bendahara.dashboard(),
]

/**
 * Get keys to invalidate after a fund application is created/updated
 */
export const getFundApplicationInvalidationKeys = () => [
  queryKeys.fundApplications.all,
  queryKeys.bendahara.fundApplications(),
  queryKeys.dashboard.all,
]

/**
 * Get keys to invalidate after a cash bill is paid/updated
 */
export const getCashBillInvalidationKeys = () => [
  queryKeys.cashBills.all,
  queryKeys.bendahara.cashBills(),
  queryKeys.dashboard.all,
]
