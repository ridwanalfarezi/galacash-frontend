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

  // Prefetch cash bills
  await queryClient.prefetchQuery(cashBillQueries.my())

  return { dehydratedState: dehydrate(queryClient) }
}

clientLoader.hydrate = true

export default function TagihanKas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <TagihanKasPage />
    </HydrationBoundary>
  )
}
