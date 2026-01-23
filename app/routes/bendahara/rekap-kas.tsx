import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireRole } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { queryClient } from '~/lib/query-client'
import RekapKasPage from '~/pages/bendahara/rekap-kas'

import type { Route } from './+types/rekap-kas'

export function meta() {
  return [{ title: 'GalaCash | Rekap Kas' }]
}

export async function clientLoader() {
  await requireRole('bendahara')

  // Prefetch with error handling
  try {
    await queryClient.prefetchQuery(bendaharaQueries.rekapKas({ page: 1, limit: 50 }))
  } catch (error) {
    // Silently catch prefetch errors - the page will refetch on mount
    console.debug('Rekap kas prefetch failed:', error)
  }

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

clientLoader.hydrate = true

export default function RekapKas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <RekapKasPage />
    </HydrationBoundary>
  )
}
