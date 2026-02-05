// eslint-disable-next-line import/no-unresolved
import { describe, expect, it } from 'bun:test'

import type { TransactionDisplay } from '~/types/domain'

import { formatCurrency, groupTransactionsByDate } from './utils'

describe('formatCurrency', () => {
  it('formats positive integers correctly', () => {
    // The output includes a non-breaking space after Rp
    expect(formatCurrency(10000)).toBe('Rp\u00a010.000,00')
    expect(formatCurrency(0)).toBe('Rp\u00a00,00')
  })

  it('formats decimals correctly', () => {
    expect(formatCurrency(10000.5)).toBe('Rp\u00a010.000,50')
  })

  it('formats large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('Rp\u00a01.000.000,00')
  })
})

describe('groupTransactionsByDate', () => {
  it('groups transactions by date and sorts descending', () => {
    const transactions: TransactionDisplay[] = [
      { id: '1', date: '2023-01-01', description: 't1', type: 'income', amount: 100 },
      { id: '2', date: '2023-01-02', description: 't2', type: 'expense', amount: 50 },
      { id: '3', date: '2023-01-01', description: 't3', type: 'income', amount: 200 },
    ]

    const grouped = groupTransactionsByDate(transactions)

    expect(grouped).toHaveLength(2)
    // Should be sorted by date descending: 2023-01-02 first, then 2023-01-01
    expect(grouped[0].date).toBe('2023-01-02')
    expect(grouped[0].items).toHaveLength(1)
    expect(grouped[0].items[0].id).toBe('2')

    expect(grouped[1].date).toBe('2023-01-01')
    expect(grouped[1].items).toHaveLength(2)
    // Check items exist
    const ids = grouped[1].items.map((t) => t.id).sort()
    expect(ids).toEqual(['1', '3'])
  })

  it('handles empty array', () => {
    expect(groupTransactionsByDate([])).toEqual([])
  })
})
