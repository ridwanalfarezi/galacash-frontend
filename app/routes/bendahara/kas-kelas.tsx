import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { queryClient } from '~/lib/query-client'
import KasKelasPage from '~/pages/bendahara/kas-kelas'

import type { Route } from './+types/kas-kelas'

export function meta() {
  return [{ title: 'GalaCash | Kas Kelas' }]
}

export async function clientLoader() {
  await requireAuth()

  // Prefetch with error handling
  try {
    await Promise.all([
      queryClient.prefetchQuery(
        bendaharaQueries.cashBills({ status: 'pending_payment', limit: 10 })
      ),
      queryClient.prefetchQuery(transactionQueries.list({ limit: 10 })),
    ])
  } catch (error) {
    // Silently catch prefetch errors - the page will refetch on mount
    console.debug('Kas kelas prefetch failed:', error)
  }

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
