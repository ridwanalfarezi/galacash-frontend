import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { AjuDanaBendaharaList } from '~/components/shared/aju-dana/AjuDanaBase';
import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext';
import { requireRole } from '~/lib/auth';
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries';
import { queryClient } from '~/lib/query-client';

import type { Route } from './+types/aju-dana';

interface BendaharaAjuDanaParams {
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
  [key: string]: unknown;
}

export function meta() {
  return [{ title: 'GalaCash | Aju Dana' }];
}

export async function clientLoader() {
  await requireRole('bendahara');

  try {
    await queryClient.prefetchQuery(fundApplicationQueries.list({ status: 'pending', limit: 10 }));
  } catch (error) {
    console.debug('Fund applications prefetch failed:', error);
  }

  return {
    dehydratedState: dehydrate(queryClient),
  };
}

clientLoader.hydrate = true;

function BendaharaAjuDana() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<BendaharaAjuDanaParams>
          defaultLimit={25}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <AjuDanaBendaharaList />
        </ExplorerProvider>
      </div>
    </div>
  );
}

export default function AjuDana({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <BendaharaAjuDana />
    </HydrationBoundary>
  );
}
