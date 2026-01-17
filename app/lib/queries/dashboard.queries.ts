import { queryOptions } from '@tanstack/react-query'

import { queryKeys } from '~/lib/queries/keys'
import { dashboardService, type DashboardSummaryParams } from '~/lib/services/dashboard.service'

/**
 * Dashboard query factory
 * Defines all dashboard-related queries
 */
export const dashboardQueries = {
  /**
   * Get dashboard summary
   * staleTime: 60s
   */
  summary: (params?: DashboardSummaryParams) =>
    queryOptions({
      queryKey: queryKeys.dashboard.summary(params),
      queryFn: () => dashboardService.getSummary(params),
      staleTime: 60 * 1000, // 1 minute
    }),

  /**
   * Get pending bills count
   * staleTime: 60s
   */
  pendingBills: () =>
    queryOptions({
      queryKey: [...queryKeys.dashboard.all, 'pending-bills'] as const,
      queryFn: () => dashboardService.getPendingBills(),
      staleTime: 60 * 1000,
    }),

  /**
   * Get pending applications count
   * staleTime: 60s
   */
  pendingApplications: () =>
    queryOptions({
      queryKey: [...queryKeys.dashboard.all, 'pending-applications'] as const,
      queryFn: () => dashboardService.getPendingApplications(),
      staleTime: 60 * 1000,
    }),
}
