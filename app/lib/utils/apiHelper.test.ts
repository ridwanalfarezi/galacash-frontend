import { describe, expect, it } from 'bun:test';

import { mapPaginatedResponse } from './apiHelper';

describe('mapPaginatedResponse', () => {
  it('maps the current flattened API envelope', () => {
    expect(
      mapPaginatedResponse({
        data: [{ id: '1' }],
        page: 2,
        limit: 25,
        total: 51,
        totalPages: 3,
      })
    ).toEqual({
      data: [{ id: '1' }],
      page: 2,
      limit: 25,
      total: 51,
      totalPages: 3,
    });
  });

  it('maps legacy named collections and nested pagination', () => {
    expect(
      mapPaginatedResponse({
        bills: [{ id: 'bill-1' }],
        pagination: { page: 1, limit: 10, totalItems: 21, totalPages: 3 },
      })
    ).toEqual({
      data: [{ id: 'bill-1' }],
      page: 1,
      limit: 10,
      total: 21,
      totalPages: 3,
    });
  });

  it('supports a caller-selected collection key', () => {
    expect(
      mapPaginatedResponse({ students: [{ id: 'student-1' }], total: 1 }, 'students').data
    ).toEqual([{ id: 'student-1' }]);
  });

  it('preserves an explicit zero total', () => {
    expect(mapPaginatedResponse({ data: [], total: 0, totalPages: 0 }).total).toBe(0);
  });

  it('returns safe defaults for an absent response', () => {
    expect(mapPaginatedResponse(undefined)).toEqual({
      data: [],
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    });
  });
});
