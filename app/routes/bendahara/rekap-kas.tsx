import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { queryClient } from '~/lib/query-client'
import RekapKasPage from '~/pages/bendahara/rekap-kas'

import type { Route } from './+types/rekap-kas'

export function meta() {
  return [{ title: 'GalaCash | Rekap Kas' }]
}

export async function clientLoader() {
  await requireAuth()

  // Prefetch with error handling
  try {
    await queryClient.prefetchQuery(bendaharaQueries.students({ limit: 50 }))
  } catch (error) {
    // Silently catch prefetch errors - the page will refetch on mount
    console.debug('Rekap kas prefetch failed:', error)
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

export default function RekapKas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <RekapKasPage />
    </HydrationBoundary>
  )
}
