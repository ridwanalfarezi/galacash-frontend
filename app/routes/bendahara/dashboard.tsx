import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { queryClient } from '~/lib/query-client'
import DashboardPage from '~/pages/bendahara/dashboard'

import type { Route } from './+types/dashboard'

export function meta() {
  return [{ title: 'GalaCash | Dashboard Bendahara' }]
}

export async function clientLoader() {
  // Check authentication
  await requireAuth()

  // Prefetch bendahara dashboard data
  await queryClient.prefetchQuery(bendaharaQueries.dashboard())

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

clientLoader.hydrate = true

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <DashboardPage />
    </HydrationBoundary>
  )
}
