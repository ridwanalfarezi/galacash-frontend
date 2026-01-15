import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { queryClient } from '~/lib/query-client'
import TagihanKasPage from '~/pages/user/tagihan-kas'

import type { Route } from './+types/tagihan-kas'

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

export function HydrateFallback() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  )
}

export default function TagihanKas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <TagihanKasPage />
    </HydrationBoundary>
  )
}
