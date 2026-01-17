import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'

import { KasKelasSkeleton } from '~/components/data-display'
import { requireAuth } from '~/lib/auth'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { queryClient } from '~/lib/query-client'

import type { Route } from './+types/aju-dana'

// Lazy load the page component for code splitting
const AjuDanaPage = lazy(() => import('~/pages/user/aju-dana'))

export function meta() {
  return [{ title: 'GalaCash | Aju Dana' }]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function clientLoader(_: Route.ClientLoaderArgs) {
  await requireAuth()

  // Prefetch fund applications with error handling
  try {
    await queryClient.prefetchQuery(fundApplicationQueries.my())
  } catch (error) {
    // Silently catch prefetch errors - the page will refetch on mount
    console.debug('Fund applications prefetch failed:', error)
  }

  return { dehydratedState: dehydrate(queryClient) }
}

clientLoader.hydrate = true

export default function AjuDana({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <Suspense fallback={<KasKelasSkeleton />}>
        <AjuDanaPage />
      </Suspense>
    </HydrationBoundary>
  )
}
