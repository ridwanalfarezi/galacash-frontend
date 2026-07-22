import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '~/lib/queries/keys';
import { transactionService, type TransactionFilters } from '~/lib/services/transaction.service';

/**
 * Transaction query factory
 * Defines all transaction-related queries
 */
export const transactionQueries = {
  /**
   * Get all transactions with filters
   * staleTime: 0s
   */
  list: (filters?: TransactionFilters) =>
    queryOptions({
      queryKey: queryKeys.transactions.list(filters),
      queryFn: () => transactionService.getTransactions(filters),
      staleTime: 0,
    }),

  /**
   * Get recent transactions (limited to 10)
   * staleTime: 0s
   */
  recent: (limit = 10) =>
    queryOptions({
      queryKey: queryKeys.transactions.recent(limit),
      queryFn: () => transactionService.getTransactions({ limit, page: 1 }),
      staleTime: 0,
    }),

  /**
   * Get transaction by ID
   * staleTime: 0s
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.transactions.detail(id),
      queryFn: () => transactionService.getTransactionById(id),
      staleTime: 0,
      enabled: !!id,
    }),

  /**
   * Get chart data
   * staleTime: 0s
   */
  chartData: (params: { type: 'income' | 'expense'; startDate?: string; endDate?: string }) =>
    queryOptions({
      queryKey: queryKeys.transactions.chart(params),
      queryFn: () => transactionService.getChartData(params),
      staleTime: 0,
    }),

  /**
   * Get breakdown data for pie charts
   * staleTime: 0s
   */
  breakdown: (params: { type: 'income' | 'expense'; startDate?: string; endDate?: string }) =>
    queryOptions({
      queryKey: queryKeys.transactions.chart({ ...params, view: 'breakdown' }),
      queryFn: () => transactionService.getBreakdown(params),
      staleTime: 0,
    }),
};
