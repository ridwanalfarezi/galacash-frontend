import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'

import { DashboardSkeleton } from '~/components/data-display'
import { requireAuth } from '~/lib/auth'
import { DEFAULT_DASHBOARD_START_DATE } from '~/lib/constants'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { dashboardQueries } from '~/lib/queries/dashboard.queries'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { queryClient } from '~/lib/query-client'
import { formatDateForAPI } from '~/lib/utils'

import type { Route } from './+types/dashboard'

// Lazy load the page component for code splitting
const DashboardPage = lazy(() => import('~/pages/user/dashboard'))

export function meta() {
  return [{ title: 'GalaCash | Dashboard' }]
}

export async function clientLoader() {
  // Check authentication
  await requireAuth()

  // Calculate initial date range (current month)
  const startDate = formatDateForAPI(DEFAULT_DASHBOARD_START_DATE)
  const endDate = formatDateForAPI(new Date())

  // Prefetch critical queries
  await Promise.all([
    queryClient.prefetchQuery(dashboardQueries.summary({ startDate, endDate })),
    queryClient.prefetchQuery(transactionQueries.list({ limit: 5, page: 1, startDate, endDate })),
    queryClient.prefetchQuery(cashBillQueries.my({ status: 'belum_dibayar', limit: 100 })),
    queryClient.prefetchQuery(fundApplicationQueries.my({ status: 'pending', limit: 5 })),
  ])

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

clientLoader.hydrate = true

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardPage />
      </Suspense>
    </HydrationBoundary>
  )
}
