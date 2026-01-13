import { queryOptions } from '@tanstack/react-query'

import {
  fundApplicationService,
  type FundApplicationFilters,
} from '~/lib/services/fund-application.service'

/**
 * Fund Application query factory
 * Defines all fund application-related queries
 */
export const fundApplicationQueries = {
  /**
   * Get all fund applications (admin view)
   * staleTime: 120s
   */
  list: (filters?: FundApplicationFilters) =>
    queryOptions({
      queryKey: ['fund-applications', 'list', filters],
      queryFn: () => fundApplicationService.getApplications(filters),
      staleTime: 120 * 1000,
    }),

  /**
   * Get user's own fund applications
   * staleTime: 120s
   */
  my: (filters?: FundApplicationFilters) =>
    queryOptions({
      queryKey: ['fund-applications', 'my', filters],
      queryFn: () => fundApplicationService.getMyApplications(filters),
      staleTime: 120 * 1000,
    }),

  /**
   * Get fund application detail by ID
   * staleTime: 300s
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: ['fund-applications', 'detail', id],
      queryFn: () => fundApplicationService.getApplicationById(id),
      staleTime: 300 * 1000,
      enabled: !!id,
    }),
}
