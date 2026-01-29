import { describe, it, expect } from 'vitest'
import { formatCurrency } from './utils'

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
