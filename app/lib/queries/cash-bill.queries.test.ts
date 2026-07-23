import { describe, expect, it } from 'bun:test';

import { markBillAwaitingConfirmation } from './cash-bill.queries';

describe('cash-bill optimistic update', () => {
  it('updates the normalized paginated data collection with the API status value', () => {
    const result = markBillAwaitingConfirmation(
      {
        data: [
          { id: 'bill-1', status: 'belum_dibayar' },
          { id: 'bill-2', status: 'belum_dibayar' },
        ],
        total: 2,
      },
      'bill-1'
    );

    expect(result).toEqual({
      data: [
        { id: 'bill-1', status: 'menunggu_konfirmasi' },
        { id: 'bill-2', status: 'belum_dibayar' },
      ],
      total: 2,
    });
  });

  it('supports raw arrays without mutating unrelated bills', () => {
    const original = [
      { id: 'bill-1', status: 'belum_dibayar' },
      { id: 'bill-2', status: 'sudah_dibayar' },
    ];

    expect(markBillAwaitingConfirmation(original, 'bill-1')).toEqual([
      { id: 'bill-1', status: 'menunggu_konfirmasi' },
      { id: 'bill-2', status: 'sudah_dibayar' },
    ]);
    expect(original[0].status).toBe('belum_dibayar');
  });

  it('leaves unknown cache shapes unchanged', () => {
    const value = { summary: { total: 1 } };
    expect(markBillAwaitingConfirmation(value, 'bill-1')).toBe(value);
  });
});
