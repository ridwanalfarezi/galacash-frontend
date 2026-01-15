import { queryOptions } from '@tanstack/react-query'

import { transactionService, type TransactionFilters } from '~/lib/services/transaction.service'

/**
 * Transaction query factory
 * Defines all transaction-related queries
 */
export const transactionQueries = {
  /**
   * Get all transactions with filters
   * staleTime: 120s (2 minutes)
   */
  list: (filters?: TransactionFilters) =>
    queryOptions({
      queryKey: ['transactions', 'list', filters],
      queryFn: () => transactionService.getTransactions(filters),
      staleTime: 120 * 1000, // 2 minutes
    }),

  /**
   * Get recent transactions (limited to 10)
   * staleTime: 60s
   */
  recent: (limit = 10) =>
    queryOptions({
      queryKey: ['transactions', 'recent', limit],
      queryFn: () => transactionService.getTransactions({ limit, page: 1 }),
      staleTime: 60 * 1000, // 1 minute
    }),

  /**
   * Get transaction by ID
   * staleTime: 300s (5 minutes)
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: ['transactions', 'detail', id],
      queryFn: () => transactionService.getTransactionById(id),
      staleTime: 300 * 1000,
      enabled: !!id,
    }),

  /**
   * Get chart data
   * staleTime: 120s
   */
  chartData: (params: { type: 'income' | 'expense'; startDate?: string; endDate?: string }) =>
    queryOptions({
      queryKey: ['transactions', 'chart', params],
      queryFn: () => transactionService.getChartData(params),
      staleTime: 120 * 1000,
    }),
}
