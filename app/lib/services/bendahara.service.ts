import { apiClient } from '~/lib/api/client'
import type { components } from '~/types/api'

type FundApplication = components['schemas']['FundApplication']
type CashBill = components['schemas']['CashBill']
type User = components['schemas']['User']
type Transaction = components['schemas']['Transaction']

export interface BendaharaDashboard {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  pendingFundApplications: number
  pendingPayments: number
  totalStudents: number
  recentTransactions: Transaction[]
  recentFundApplications: FundApplication[]
  recentCashBills: CashBill[]
}

export interface BendaharaFilters {
  page?: number
  limit?: number
  status?: string
  month?: string
  search?: string
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month' | 'year'
  userId?: string // Filter by specific user ID for student-specific queries
  sortBy?: 'date' | 'amount' | 'status'
  sortOrder?: 'asc' | 'desc'
  category?: string
}

export interface CreateTransactionData {
  date: string
  description: string
  type: 'income' | 'expense'
  amount: number
  category?: string
  attachment?: File
}

/**
 * Bendahara service
 * Handles bendahara-specific operations
 */
export const bendaharaService = {
  /**
   * Get bendahara dashboard
   */
  async getDashboard() {
    const response = await apiClient.get<{
      success: boolean
      data: BendaharaDashboard
    }>('/bendahara/dashboard')
    return response.data.data
  },

  /**
   * Get fund application detail by ID
   */
  async getFundApplicationDetail(id: string) {
    const response = await apiClient.get<{
      success: boolean
      data: components['schemas']['FundApplicationDetail']
    }>(`/bendahara/fund-applications/${id}`)
    return response.data.data
  },

  /**
   * Approve fund application
   */
  async approveFundApplication(id: string) {
    const response = await apiClient.post<{
      success: boolean
      data: FundApplication
      message: string
    }>(`/bendahara/fund-applications/${id}/approve`)
    return response.data.data
  },

  /**
   * Reject fund application
   */
  async rejectFundApplication(id: string, rejectionReason: string) {
    const response = await apiClient.post<{
      success: boolean
      data: FundApplication
      message: string
    }>(`/bendahara/fund-applications/${id}/reject`, { rejectionReason })
    return response.data.data
  },

  /**
   * Get cash bills for review
   */
  async getCashBills(params?: BendaharaFilters) {
    const response = await apiClient.get<{
      success: boolean
      data: {
        data: CashBill[]
        page?: number
        limit?: number
        total?: number
        totalPages?: number
      }
    }>('/bendahara/cash-bills', { params })
    return response.data.data.data
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
    const response = await apiClient.get<{
      success: boolean
      data: {
        summary: {
          totalIncome: number
          totalExpense: number
          balance: number
        }
        students: Array<{
          userId: string
          name: string
          nim: string
          totalPaid: number
          totalUnpaid: number
          paymentStatus: 'up-to-date' | 'has-arrears'
        }>
        transactions: Transaction[]
        period: {
          startDate: string
          endDate: string
        }
      }
    }>('/bendahara/rekap-kas', { params })
    return response.data.data
  },

  /**
   * Get students list
   */
  async getStudents(params?: BendaharaFilters) {
    const response = await apiClient.get<{
      success: boolean
      data: {
        students: User[]
        pagination: components['schemas']['Pagination']
      }
    }>('/bendahara/students', { params })
    return response.data.data
  },

  /**
   * Create manual transaction
   */
  async createTransaction(data: CreateTransactionData) {
    const formData = new FormData()
    formData.append('date', data.date)
    formData.append('description', data.description)
    formData.append('type', data.type)
    formData.append('amount', data.amount.toString())
    if (data.category) {
      formData.append('category', data.category)
    }
    if (data.attachment) {
      formData.append('attachment', data.attachment)
    }

    const response = await apiClient.post<{
      success: boolean
      data: Transaction
      message: string
    }>('/bendahara/transactions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },
}
