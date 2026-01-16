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
        bendaharaQueries.cashBills({ status: 'menunggu_konfirmasi', limit: 10 })
      ),
      queryClient.prefetchQuery(transactionQueries.list({ limit: 10 })),
      queryClient.prefetchQuery(bendaharaQueries.rekapKas()),
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

export default function KasKelas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <KasKelasPage />
    </HydrationBoundary>
  )
}
