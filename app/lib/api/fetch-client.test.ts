import { afterEach, describe, expect, it, mock } from 'bun:test';

import { FetchClient } from './fetch-client';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('FetchClient', () => {
  it('serializes query parameters and JSON request bodies', async () => {
    let capturedUrl = '';
    let capturedConfig: RequestInit | undefined;
    const fetchMock = mock(async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = String(input);
      capturedConfig = init;
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const client = new FetchClient('/api');

    await client.post('/transactions', { amount: 0 }, { params: { page: 2, empty: undefined } });

    expect(capturedUrl).toBe('http://localhost/api/transactions?page=2');
    expect(capturedConfig?.body).toBe(JSON.stringify({ amount: 0 }));
    expect(new Headers(capturedConfig?.headers).get('Content-Type')).toBe('application/json');
  });

  it('does not set a multipart boundary for FormData', async () => {
    let capturedConfig: RequestInit | undefined;
    const fetchMock = mock(async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedConfig = init;
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const client = new FetchClient('/api');
    const formData = new FormData();
    formData.append('paymentMethod', 'cash');

    await client.post('/cash-bills/batch-pay', formData);

    expect(capturedConfig?.body).toBe(formData);
    expect(new Headers(capturedConfig?.headers).has('Content-Type')).toBe(false);
  });

  it('uses one refresh request for concurrent expired-token responses', async () => {
    let protectedCalls = 0;
    let refreshCalls = 0;
    let releaseRefresh: (() => void) | undefined;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });

    const fetchMock = mock(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/auth/refresh')) {
        refreshCalls += 1;
        await refreshGate;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      protectedCalls += 1;
      if (protectedCalls <= 2) {
        return new Response(
          JSON.stringify({
            success: false,
            error: { code: 'TOKEN_EXPIRED', message: 'Expired' },
          }),
          { status: 401 }
        );
      }

      return new Response(JSON.stringify({ success: true, data: { id: protectedCalls } }), {
        status: 200,
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const client = new FetchClient('/api');

    const requests = Promise.all([client.get('/one'), client.get('/two')]);
    while (refreshCalls === 0) {
      await Promise.resolve();
    }
    releaseRefresh?.();
    await requests;

    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(4);
  });
});
