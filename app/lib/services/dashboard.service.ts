import { apiClient } from '~/lib/api/client'
import type { components } from '~/types/api'

type DashboardSummary = components['schemas']['DashboardSummary']

export interface DashboardSummaryParams {
  startDate?: string
  endDate?: string
}

/**
 * Dashboard service
 * Handles dashboard data fetching
 */
export const dashboardService = {
  /**
   * Get dashboard summary
   */
  async getSummary(params?: DashboardSummaryParams) {
    const response = await apiClient.get<DashboardSummary>('/dashboard/summary', { params })
    return response.data.data!
  },

  /**
   * Get pending bills summary
   */
  async getPendingBills() {
    const response = await apiClient.get<{
      success: boolean
      data: { count: number; total: number }
    }>('/dashboard/pending-bills')
    return response.data.data
  },

  /**
   * Get pending fund applications
   */
  async getPendingApplications() {
    const response = await apiClient.get<{
      success: boolean
      data: { count: number }
    }>('/dashboard/pending-applications')
    return response.data.data
  },
}
