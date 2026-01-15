import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { queryClient } from '~/lib/query-client'
import DetailRekapKasPage from '~/pages/bendahara/detail-rekap-kas'

import type { Route } from './+types/detail-rekap-kas'

export function meta() {
  return [{ title: 'GalaCash | Detail Rekap Kas' }]
}

export async function clientLoader() {
  await requireAuth()

  // Prefetch rekap kas detail
  await queryClient.prefetchQuery(bendaharaQueries.rekapKas())

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

export default function DetailRekapKas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <DetailRekapKasPage />
    </HydrationBoundary>
  )
}
