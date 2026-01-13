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

  // Prefetch students for rekap kas
  await queryClient.prefetchQuery(bendaharaQueries.students({ limit: 50 }))

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
