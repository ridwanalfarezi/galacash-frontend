import { apiClient } from '~/lib/api/client'
import { mapPaginatedResponse } from '~/lib/utils/api-helper'
import type { components } from '~/types/api'

type CashBill = components['schemas']['CashBill']

export interface BendaharaFilters {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  status?: string
  userId?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  paymentStatus?: 'up-to-date' | 'has-arrears'
}

export interface CreateTransactionData {
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category?: string
  attachment?: File
}

/**
 * Bendahara service
 * Handles treasurer-specific operations
 */
export const bendaharaService = {
  /**
   * Get dashboard summary for bendahara
   */
  async getDashboard(params?: { startDate?: string; endDate?: string }) {
    const response = await apiClient.get('/bendahara/dashboard', { params })
    return response.data.data
  },

  /**
   * Get fund applications for review
   */
  async getPendingApplications() {
    const response = await apiClient.get('/bendahara/fund-applications')
    return response.data.data
  },

  /**
   * Get fund application detail
   */
  async getFundApplicationDetail(id: string) {
    const response = await apiClient.get(`/bendahara/fund-applications/${id}`)
    return response.data.data
  },

  /**
   * Approve fund application
   */
  async approveFundApplication(id: string) {
    const response = await apiClient.post(`/bendahara/fund-applications/${id}/approve`)
    return response.data.data
  },

  /**
   * Reject fund application
   */
  async rejectFundApplication(id: string, reason: string) {
    const response = await apiClient.post(`/bendahara/fund-applications/${id}/reject`, {
      rejectionReason: reason,
    })
    return response.data.data
  },

  /**
   * Get students list for rekap
   */
  async getStudents(params?: BendaharaFilters) {
    const response = await apiClient.get('/bendahara/students', { params })
    return response.data.data
  },

  /**
   * Create a manual transaction
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createTransaction(data: any) {
    const response = await apiClient.post('/bendahara/transactions', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  /**
   * Get cash bills for review
   */
  async getCashBills(params?: BendaharaFilters) {
    const response = await apiClient.get('/bendahara/cash-bills', { params })
    return mapPaginatedResponse<CashBill>(response.data.data)
  },

  /**
   * Confirm cash bill payment
   */
  async confirmPayment(billId: string) {
    const response = await apiClient.post<{
      success: boolean
      data: CashBill
      message: string
    }>(`/bendahara/cash-bills/${billId}/confirm-payment`)
    return response.data.data
  },

  /**
   * Reject cash bill payment
   */
  async rejectPayment(billId: string, reason?: string) {
    const response = await apiClient.post<{
      success: boolean
      data: CashBill
      message: string
    }>(`/bendahara/cash-bills/${billId}/reject-payment`, { reason })
    return response.data.data
  },

  /**
   * Get financial recap (rekap kas)
   */
  async getRekapKas(params?: BendaharaFilters) {
    const response = await apiClient.get('/bendahara/rekap-kas', { params })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = mapPaginatedResponse<any>(response.data.data, 'students')

    return {
      ...mapped,
      summary: response.data.data?.summary,
      transactions: response.data.data?.transactions,
      period: response.data.data?.period,
      students: mapped.data, // Backward compatibility with page expectations
    }
  },

  /**
   * Get financial recap summary
   */
  async getRekapSummary(params?: { startDate?: string; endDate?: string }) {
    const response = await apiClient.get('/bendahara/rekap-kas/summary', { params })
    return response.data.data
  },

  /**
   * Export financial recap
   */
  async exportRekapKas(params?: { startDate?: string; endDate?: string; format: 'xlsx' | 'pdf' }) {
    const response = await apiClient.post(
      '/bendahara/rekap-kas/export',
      { ...params },
      { responseType: 'blob' }
    )
    return response.data
  },
}
