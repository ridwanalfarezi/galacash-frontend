// eslint-disable-next-line import/no-unresolved
import { describe, expect, test } from 'bun:test'

import { leftColumnData, rightColumnData } from './sort-dropdown-utils'

describe('SortDropdown Logic', () => {
  test('Calculates categories correctly', () => {
    // Assertions to verify structure of exported constants
    const leftCategories = leftColumnData.map((item) => item[0])
    const rightCategories = rightColumnData.map((item) => item[0])

    expect(leftCategories).toEqual(['Tanggal', 'Nominal', 'Keperluan'])
    expect(rightCategories).toEqual(['Kategori', 'Status', 'Pengaju'])

    expect(leftColumnData.length).toBe(3)
    expect(rightColumnData.length).toBe(3)

    expect(leftColumnData[0][0]).toBe('Tanggal')
    expect(leftColumnData[0][1].length).toBe(2)

    expect(rightColumnData[0][0]).toBe('Kategori')
    expect(rightColumnData[0][1].length).toBe(2)
  })
})
