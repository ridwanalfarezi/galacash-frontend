import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'

import { DashboardSkeleton } from '~/components/data-display'
import { requireRole } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { queryClient } from '~/lib/query-client'

import type { Route } from './+types/dashboard'

// Lazy load the page component for code splitting
const DashboardPage = lazy(() => import('~/pages/bendahara/dashboard'))

export function meta() {
  return [{ title: 'GalaCash | Dashboard Bendahara' }]
}

export async function clientLoader() {
  // Check authentication and role
  await requireRole('bendahara')

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
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardPage />
      </Suspense>
    </HydrationBoundary>
  )
}
