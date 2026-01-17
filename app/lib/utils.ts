import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { TransactionDisplay, TransactionGroup } from '~/types/domain'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace('IDR', 'Rp')
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
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([date, items]) => ({ date, items }))
}
