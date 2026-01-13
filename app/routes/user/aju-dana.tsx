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

  // Prefetch fund applications
  await queryClient.prefetchQuery(fundApplicationQueries.my())

  return { dehydratedState: dehydrate(queryClient) }
}

clientLoader.hydrate = true

export default function AjuDana({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <AjuDanaPage />
    </HydrationBoundary>
  )
}
