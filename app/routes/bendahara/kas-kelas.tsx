import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ExplorerProvider } from '~/components/shared/explorer/ExplorerContext';
import { KasKelasBase } from '~/components/shared/kas-kelas/KasKelasBase';
import { requireRole } from '~/lib/auth';
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
  await requireRole('bendahara');

  try {
    await Promise.all([queryClient.prefetchQuery(transactionQueries.list({ limit: 10 }))]);
  } catch (error) {
    console.debug('Kas kelas prefetch failed:', error);
  }

  return {
    dehydratedState: dehydrate(queryClient),
  };
}

clientLoader.hydrate = true;

function BendaharaKasKelasPage() {
  return (
    <div className="p-6">
      <ExplorerProvider<KasKelasParams>
        defaultLimit={25}
        defaultSort={{ key: 'date', direction: 'desc' }}
      >
        <KasKelasBase
          variant="bendahara"
          title="Kelola Transaksi"
          chartTitle="Visualisasi Keuangan"
          showCreateButton={true}
          exportFilename="bendahara-kas-kelas"
        />
      </ExplorerProvider>
    </div>
  );
}

export default function KasKelas({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <BendaharaKasKelasPage />
    </HydrationBoundary>
  );
}
