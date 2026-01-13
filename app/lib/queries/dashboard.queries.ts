import { queryOptions } from '@tanstack/react-query'

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
      queryKey: ['dashboard', 'summary', params],
      queryFn: () => dashboardService.getSummary(params),
      staleTime: 60 * 1000, // 1 minute
    }),

  /**
   * Get pending bills count
   * staleTime: 60s
   */
  pendingBills: () =>
    queryOptions({
      queryKey: ['dashboard', 'pending-bills'],
      queryFn: () => dashboardService.getPendingBills(),
      staleTime: 60 * 1000,
    }),

  /**
   * Get pending applications count
   * staleTime: 60s
   */
  pendingApplications: () =>
    queryOptions({
      queryKey: ['dashboard', 'pending-applications'],
      queryFn: () => dashboardService.getPendingApplications(),
      staleTime: 60 * 1000,
    }),
}
