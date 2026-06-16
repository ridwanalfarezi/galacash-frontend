import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext';
import { KasKelasBase } from '~/components/shared/kas-kelas/KasKelasBase';
import { requireAuth } from '~/lib/auth';
import { transactionQueries } from '~/lib/queries/transaction.queries';
import { queryClient } from '~/lib/query-client';

import type { Route } from './+types/kas-kelas';

interface KasKelasParams {
  type?: 'income' | 'expense';
  [key: string]: unknown;
}

export function meta() {
  return [{ title: 'GalaCash | Kas Kelas' }];
}

export async function clientLoader() {
  await requireAuth();

  await Promise.all([
    queryClient.prefetchQuery(transactionQueries.list({ page: 1, limit: 20 })),
    queryClient.prefetchQuery(transactionQueries.chartData({ type: 'income' })),
    queryClient.prefetchQuery(transactionQueries.chartData({ type: 'expense' })),
  ]);

  return {
    dehydratedState: dehydrate(queryClient),
  };
}

clientLoader.hydrate = true;

function UserKasKelasPage() {
  return (
    <div className="p-6">
      <ExplorerProvider<KasKelasParams>
        defaultLimit={25}
        defaultSort={{ key: 'date', direction: 'desc' }}
      >
        <KasKelasBase
          variant="user"
          title="Riwayat Transaksi"
          chartTitle="Visualisasi Keuangan"
          showCreateButton={false}
          exportFilename="kas-kelas"
        />
      </ExplorerProvider>
    </div>
  );
}

export default function KasKelas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <UserKasKelasPage />
    </HydrationBoundary>
  );
}
