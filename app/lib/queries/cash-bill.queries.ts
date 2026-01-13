import { queryOptions } from '@tanstack/react-query'

import { cashBillService, type CashBillFilters } from '~/lib/services/cash-bill.service'

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
      queryKey: ['cash-bills', 'my', filters],
      queryFn: () => cashBillService.getMyBills(filters),
      staleTime: 120 * 1000,
    }),

  /**
   * Get cash bill detail by ID
   * staleTime: 300s
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: ['cash-bills', 'detail', id],
      queryFn: () => cashBillService.getBillById(id),
      staleTime: 300 * 1000,
      enabled: !!id,
    }),
}
