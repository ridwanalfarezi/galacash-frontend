import type { components } from '~/types/api'

// ============================================================================
// Re-export API Types
// ============================================================================

export type User = components['schemas']['User']
export type Transaction = components['schemas']['Transaction']
export type FundApplication = components['schemas']['FundApplication']
export type CashBill = components['schemas']['CashBill']
export type Pagination = components['schemas']['Pagination']

// ============================================================================
// Derived/UI-Specific Types
// ============================================================================

export interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
  category: string
  attachmentUrl?: string | null
}

export interface Application {
  id: string
  date: string
  purpose: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  amount: number
  applicant: string
  description?: string
  attachment?: string
}

export interface TagihanKas {
  id: string
  month: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  billId: string
  dueDate: string
  totalAmount: number
  name: string
  kasKelas: number
  biayaAdmin: number
  paymentProofUrl?: string | null
}

/**
 * Simplified transaction type for display purposes
 * Used in dashboard and transaction list components
 */
export interface TransactionDisplay {
  id: string
  date: string
  description: string
  type: 'income' | 'expense'
  amount: number
  category?: string
}

/**
 * Transaction grouped by date for timeline display
 */
export interface TransactionGroup {
  date: string
  items: TransactionDisplay[]
}

/**
 * User role types
 */
export type UserRole = 'user' | 'bendahara'

/**
 * Bill status types
 */
export type BillStatus = 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar'

/**
 * Fund application status types
 */
export type FundStatus = 'pending' | 'approved' | 'rejected'

/**
 * Fund category types
 */
export type FundCategory = 'education' | 'health' | 'emergency' | 'equipment'

/**
 * Transaction type
 */
export type TransactionType = 'income' | 'expense'

// ============================================================================
// Type Guards
// ============================================================================

export const isIncome = (transaction: Transaction | TransactionDisplay): boolean =>
  transaction.type === 'income'

export const isExpense = (transaction: Transaction | TransactionDisplay): boolean =>
  transaction.type === 'expense'

export const isBendahara = (user: User): boolean => user.role === 'bendahara'

export const isUser = (user: User): boolean => user.role === 'user'

// ============================================================================
// Type Converters
// ============================================================================

/**
 * Convert API Transaction to TransactionDisplay
 */
export const toTransactionDisplay = (t: Transaction): TransactionDisplay => ({
  id: t.id || '',
  date: t.date || new Date().toISOString().split('T')[0],
  description: t.description || '',
  type: (t.type || 'income') as TransactionType,
  amount: t.amount || 0,
})

/**
 * Convert array of API Transactions to TransactionDisplay array
 */
export const toTransactionDisplayList = (transactions: Transaction[]): TransactionDisplay[] =>
  transactions.map(toTransactionDisplay)
