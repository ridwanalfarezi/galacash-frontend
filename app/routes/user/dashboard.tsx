import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { dashboardQueries } from '~/lib/queries/dashboard.queries'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { queryClient } from '~/lib/query-client'
import DashboardPage from '~/pages/user/dashboard'

import type { Route } from './+types/dashboard'

export function meta() {
  return [{ title: 'GalaCash | Dashboard' }]
}

export async function clientLoader() {
  // Check authentication
  await requireAuth()

  // Prefetch critical queries
  await Promise.all([
    queryClient.prefetchQuery(dashboardQueries.summary()),
    queryClient.prefetchQuery(transactionQueries.recent(5)),
    queryClient.prefetchQuery(cashBillQueries.my({ status: 'belum_dibayar', limit: 5 })),
    queryClient.prefetchQuery(fundApplicationQueries.my({ status: 'pending', limit: 5 })),
  ])

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

clientLoader.hydrate = true

export function HydrateFallback() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  )
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <DashboardPage />
    </HydrationBoundary>
  )
}
