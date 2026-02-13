import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { TransactionDisplay, TransactionGroup } from '~/types/domain'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 2,
})

export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount).replace('IDR', 'Rp')
}

const monthYearFormatter = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
})

export const formatMonthYear = (month: number, year: number): string => {
  const date = new Date(year, month - 1)
  return monthYearFormatter.format(date)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format a Date object to YYYY-MM-DD string for API queries.
 * Uses local timezone instead of UTC to avoid date shifting issues.
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * @deprecated Use TransactionDisplay from ~/types/domain instead
 */
export type Transaction = TransactionDisplay

export const groupTransactionsByDate = (transactions: TransactionDisplay[]): TransactionGroup[] => {
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const date = transaction.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(transaction)
      return acc
    },
    {} as Record<string, TransactionDisplay[]>
  )

  return Object.entries(grouped)
    .sort(([a], [b]) => (b > a ? 1 : -1))
    .map(([date, items]) => ({ date, items }))
}

export const getFilenameFromUrl = (url: string): string => {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

export const toTitleCase = (str: string): string => {
  if (!str) return ''
  return str
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
