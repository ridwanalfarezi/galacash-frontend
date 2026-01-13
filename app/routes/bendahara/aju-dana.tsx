import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { requireAuth } from '~/lib/auth'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { queryClient } from '~/lib/query-client'
import AjuDanaPage from '~/pages/bendahara/aju-dana'

import type { Route } from './+types/aju-dana'

export function meta() {
  return [{ title: 'GalaCash | Aju Dana' }]
}

export async function clientLoader() {
  await requireAuth()

  // Prefetch fund applications
  await queryClient.prefetchQuery(
    bendaharaQueries.fundApplications({ status: 'pending', limit: 10 })
  )

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

clientLoader.hydrate = true

export default function AjuDana({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <AjuDanaPage />
    </HydrationBoundary>
  )
}
