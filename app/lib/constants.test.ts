// eslint-disable-next-line import/no-unresolved
import { describe, expect, test } from 'bun:test'

import { getTransactionCategoryOptions, TRANSACTION_CATEGORIES } from './constants'

describe('TRANSACTION_CATEGORIES', () => {
  test('donation category should be defined as expense', () => {
    // @ts-expect-error - testing hidden/system properties
    const donation = TRANSACTION_CATEGORIES.donation
    expect(donation).toBeDefined()
    expect(donation.type).toBe('expense')
    expect(donation.label).toBe('Sumbangan')
  })

  test('getTransactionCategoryOptions for expense should include donation', () => {
    const options = getTransactionCategoryOptions('expense')
    const donationOption = options.find(opt => opt.value === 'donation')
    expect(donationOption).toBeDefined()
    expect(donationOption?.label).toBe('Sumbangan')
  })

  test('getTransactionCategoryOptions for income should NOT include donation', () => {
    const options = getTransactionCategoryOptions('income')
    const donationOption = options.find(opt => opt.value === 'donation')
    expect(donationOption).toBeUndefined()
  })
})
