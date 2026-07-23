import type { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, mock } from 'bun:test';

import { queryKeys } from './keys';
import { invalidateFinancialQueries } from './query-broadcast';

describe('invalidateFinancialQueries', () => {
  it('invalidates every financial projection root', async () => {
    const invalidatedKeys: Array<readonly unknown[] | undefined> = [];
    const invalidateQueries = mock(async (options: { queryKey?: readonly unknown[] }) => {
      invalidatedKeys.push(options.queryKey);
    });
    const client = { invalidateQueries } as unknown as QueryClient;

    await invalidateFinancialQueries(client);

    expect(invalidateQueries).toHaveBeenCalledTimes(5);
    expect(invalidatedKeys).toEqual([
      queryKeys.cashBills.all,
      queryKeys.fundApplications.all,
      queryKeys.dashboard.all,
      queryKeys.bendahara.all,
      queryKeys.transactions.all,
    ]);
  });
});
