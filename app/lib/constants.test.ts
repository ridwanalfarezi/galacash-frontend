import { describe, expect, test } from 'bun:test'

import { getTransactionCategoryOptions, TRANSACTION_CATEGORIES } from './constants'

describe('TRANSACTION_CATEGORIES', () => {
  test('donation is categorized as expense with label Sumbangan', () => {
    const donation = TRANSACTION_CATEGORIES.donation
    expect(donation).toBeDefined()
    expect(donation.type).toBe('expense')
    expect(donation.label).toBe('Sumbangan')
  })

  test('fundraising is hidden with label Penggalangan Dana', () => {
    const fundraising = TRANSACTION_CATEGORIES.fundraising
    expect(fundraising.type).toBe('income')
    expect(fundraising.label).toBe('Penggalangan Dana')
    expect(fundraising.hidden).toBe(true)
  })
})

describe('getTransactionCategoryOptions', () => {
  test('expense options include donation (Sumbangan)', () => {
    const expenseOptions = getTransactionCategoryOptions('expense')
    const donationOption = expenseOptions.find((o) => o.value === 'donation')
    expect(donationOption).toBeDefined()
    expect(donationOption?.label).toBe('Sumbangan')
  })

  test('income options do not include donation', () => {
    const incomeOptions = getTransactionCategoryOptions('income')
    const donationOption = incomeOptions.find((o) => o.value === 'donation')
    expect(donationOption).toBeUndefined()
  })

  test('income options include other (Lainnya)', () => {
    const incomeOptions = getTransactionCategoryOptions('income')
    const otherOption = incomeOptions.find((o) => o.value === 'other')
    expect(otherOption).toBeDefined()
    expect(otherOption?.label).toBe('Lainnya')
  })

  test('hidden categories are excluded from options', () => {
    const expenseOptions = getTransactionCategoryOptions('expense')
    const hiddenKeys = [
      'education',
      'health',
      'emergency',
      'equipment',
      'office_supplies',
      'maintenance',
      'transport',
      'social',
    ]
    for (const key of hiddenKeys) {
      const found = expenseOptions.find((o) => o.value === key)
      expect(found).toBeUndefined()
    }
  })

  test('system_only categories are excluded from options', () => {
    const incomeOptions = getTransactionCategoryOptions('income')
    const kasKelas = incomeOptions.find((o) => o.value === 'kas_kelas')
    expect(kasKelas).toBeUndefined()
  })
})
