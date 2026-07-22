import type { QueryClient } from '@tanstack/react-query';

import { queryKeys } from './keys';
import { queryClient } from '../query-client';

const SYNC_CHANNEL_NAME = 'galacash_cache_sync';

// Setup cross-tab broadcast channel if supported in standard environment
let syncChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);

  syncChannel.onmessage = (event: MessageEvent<{ type?: string; queryKey?: unknown[] }>) => {
    if (event.data?.type === 'INVALIDATE_QUERIES' && event.data.queryKey) {
      queryClient.invalidateQueries({ queryKey: event.data.queryKey });
    }
  };
}

/**
 * Broadcast query invalidation across browser tabs
 */
export function broadcastInvalidation(queryKey: readonly unknown[]) {
  queryClient.invalidateQueries({ queryKey });
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'INVALIDATE_QUERIES', queryKey: Array.from(queryKey) });
    } catch {
      // Ignore serializing errors if any
    }
  }
}

/**
 * Invalidate all financial projections downstream and broadcast to all open browser tabs
 */
export async function invalidateFinancialQueries(qc: QueryClient = queryClient) {
  const keysToInvalidate = [
    queryKeys.cashBills.all,
    queryKeys.fundApplications.all,
    queryKeys.dashboard.all,
    queryKeys.bendahara.all,
    queryKeys.transactions.all,
  ] as const;

  await Promise.all(keysToInvalidate.map((key) => qc.invalidateQueries({ queryKey: key })));

  if (syncChannel) {
    keysToInvalidate.forEach((key) => {
      try {
        syncChannel?.postMessage({ type: 'INVALIDATE_QUERIES', queryKey: Array.from(key) });
      } catch {
        // Ignore serializing errors
      }
    });
  }
}
