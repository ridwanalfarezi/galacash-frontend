import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'

import { TagihanKasSkeleton } from '~/components/data-display'
import { requireAuth } from '~/lib/auth'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { queryClient } from '~/lib/query-client'

import type { Route } from './+types/tagihan-kas'

// Lazy load the page component for code splitting
const TagihanKasPage = lazy(() => import('~/pages/user/tagihan-kas'))

export function meta() {
  return [{ title: 'GalaCash | Tagihan Kas' }]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function clientLoader(_: Route.ClientLoaderArgs) {
  await requireAuth()

  // Prefetch cash bills with error handling
  try {
    await queryClient.prefetchQuery(cashBillQueries.my())
  } catch (error) {
    // Silently catch prefetch errors - the page will refetch on mount
    console.debug('Cash bills prefetch failed:', error)
  }

  return { dehydratedState: dehydrate(queryClient) }
}

clientLoader.hydrate = true

export default function TagihanKas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <Suspense fallback={<TagihanKasSkeleton />}>
        <TagihanKasPage />
      </Suspense>
    </HydrationBoundary>
  )
}
