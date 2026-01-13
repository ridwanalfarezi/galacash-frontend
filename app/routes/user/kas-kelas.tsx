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
    queryClient.prefetchQuery(transactionQueries.chartData({})),
  ])

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

clientLoader.hydrate = true

export default function KasKelas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <KasKelasPage />
    </HydrationBoundary>
  )
}
