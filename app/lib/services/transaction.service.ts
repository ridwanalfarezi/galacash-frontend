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
  sortBy?: 'date' | 'amount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
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
    const response = await apiClient.get<
      TransactionListResponse & {
        data: Transaction[]
        page?: number
        limit?: number
        total?: number
        totalPages?: number
      }
    >('/transactions', {
      params: filters,
    })

    // Check if data is array (structure: { success: true, data: [...], page: 1, ... })
    // or nested object (structure: { success: true, data: { transactions: [...], pagination: {...} } })
    const responseData = response.data.data

    if (Array.isArray(responseData)) {
      return {
        transactions: responseData,
        pagination: {
          page: response.data.page!,
          limit: response.data.limit!,
          totalItems: response.data.total!,
          totalPages: response.data.totalPages!,
        },
      }
    }

    // Fallback to legacy nested structure if API hasn't changed
    // Fallback to legacy nested structure if API hasn't changed
    const legacyData = responseData as {
      transactions?: Transaction[]
      pagination?: TransactionListResult['pagination']
    }

    return {
      transactions: legacyData?.transactions || [],
      pagination: legacyData?.pagination || {},
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
