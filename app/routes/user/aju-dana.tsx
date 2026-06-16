import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { useState } from 'react';

import { AjuDanaList, BuatAjuDanaModal } from '~/components/shared/aju-dana/AjuDanaBase';
import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext';
import { requireAuth } from '~/lib/auth';
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries';
import { queryClient } from '~/lib/query-client';

import type { Route } from './+types/aju-dana';

interface ApplicationParams {
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
  [key: string]: unknown;
}

export function meta() {
  return [{ title: 'GalaCash | Aju Dana' }];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function clientLoader(_: Route.ClientLoaderArgs) {
  await requireAuth();

  try {
    await queryClient.prefetchQuery(fundApplicationQueries.my());
  } catch (error) {
    console.debug('Fund applications prefetch failed:', error);
  }

  return { dehydratedState: dehydrate(queryClient) };
}

clientLoader.hydrate = true;

function AjuDanaPage() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <ExplorerProvider<ApplicationParams>
          scope="myApplications"
          defaultLimit={25}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <AjuDanaList
            title="Rekap Pengajuan Anda"
            variant="my"
            showCreateButton
            onOpenModal={() => setIsApplicationModalOpen(true)}
          />
        </ExplorerProvider>

        <ExplorerProvider<ApplicationParams>
          scope="allApplications"
          defaultLimit={25}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <AjuDanaList title="Rekap Pengajuan Dana" variant="all" />
        </ExplorerProvider>

        <BuatAjuDanaModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default function AjuDana({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <AjuDanaPage />
    </HydrationBoundary>
  );
}
