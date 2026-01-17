import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'

import { KasKelasSkeleton } from '~/components/data-display'
import { requireAuth } from '~/lib/auth'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { queryClient } from '~/lib/query-client'

import type { Route } from './+types/kas-kelas'

// Lazy load the page component for code splitting
const KasKelasPage = lazy(() => import('~/pages/user/kas-kelas'))

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

export default function KasKelas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <Suspense fallback={<KasKelasSkeleton />}>
        <KasKelasPage />
      </Suspense>
    </HydrationBoundary>
  )
}
