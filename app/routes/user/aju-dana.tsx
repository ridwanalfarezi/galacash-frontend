import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { queryClient } from '~/lib/query-client'
import AjuDanaPage from '~/pages/user/aju-dana'

import type { Route } from './+types/aju-dana'

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

export function HydrateFallback() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  )
}

export default function AjuDana({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <AjuDanaPage />
    </HydrationBoundary>
  )
}
