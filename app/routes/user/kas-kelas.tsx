import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { queryClient } from '~/lib/query-client'
import KasKelasPage from '~/pages/user/kas-kelas'

import type { Route } from './+types/kas-kelas'

export function meta() {
  return [{ title: 'GalaCash | Kas Kelas' }]
}

export async function clientLoader() {
  // Check authentication
  await requireAuth()

  // Prefetch initial transaction data and chart data
  await Promise.all([
    queryClient.prefetchQuery(transactionQueries.list({ page: 1, limit: 20 })),
    queryClient.prefetchQuery(transactionQueries.chartData({ type: 'income' })),
    queryClient.prefetchQuery(transactionQueries.chartData({ type: 'expense' })),
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

export default function KasKelas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <KasKelasPage />
    </HydrationBoundary>
  )
}
