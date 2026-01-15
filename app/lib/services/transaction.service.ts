import { apiClient } from '~/lib/api/client'
import type { components } from '~/types/api'

type Transaction = components['schemas']['Transaction']
type TransactionListResponse = components['schemas']['TransactionListResponse']
type Pagination = components['schemas']['Pagination']

export interface TransactionFilters {
  page?: number
  limit?: number
  type?: 'income' | 'expense'
  startDate?: string
  endDate?: string
  search?: string
}

export interface TransactionListResult {
  transactions: Transaction[]
  pagination: Pagination
}

/**
 * Transaction service
 * Handles transaction data operations
 */
export const transactionService = {
  /**
   * Get list of transactions with filters
   */
  async getTransactions(filters?: TransactionFilters): Promise<TransactionListResult> {
    const response = await apiClient.get<TransactionListResponse>('/transactions', {
      params: filters,
    })
    return {
      transactions: response.data.data!.transactions!,
      pagination: response.data.data!.pagination!,
    }
  },

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: string): Promise<Transaction> {
    const response = await apiClient.get<{ success: boolean; data: Transaction }>(
      `/transactions/${id}`
    )
    return response.data.data
  },

  /**
   * Get chart data for transactions
   * Requires type parameter (income or expense)
   */
  async getChartData(params: { type: 'income' | 'expense'; startDate?: string; endDate?: string }) {
    const response = await apiClient.get<{
      success: boolean
      data: Array<{ date: string; amount: number }>
    }>('/transactions/chart-data', { params })
    return response.data.data
  },

  /**
   * Export transactions to Excel/CSV
   */
  async exportTransactions(filters?: TransactionFilters): Promise<Blob> {
    const response = await apiClient.get('/transactions/export', {
      params: {
        format: 'excel',
        ...filters,
      },
      responseType: 'blob',
    })
    return response.data
  },
}
