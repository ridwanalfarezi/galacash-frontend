import { apiClient, uploadFile } from '~/lib/api/client'
import type { components } from '~/types/api'

type CashBill = components['schemas']['CashBill']
type CashBillDetail = components['schemas']['CashBillDetail']

export interface CashBillFilters {
  page?: number
  limit?: number
  status?: 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar'
  month?: number
  year?: number
  sortBy?: 'dueDate' | 'month' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface PayBillData {
  paymentProof: File
  paymentMethod: 'bank' | 'ewallet' | 'cash'
  notes?: string
}

/**
 * Cash Bill service
 * Handles cash bill operations
 */
export const cashBillService = {
  /**
   * Get user's cash bills
   */
  async getMyBills(filters?: CashBillFilters) {
    const response = await apiClient.get<{
      success: boolean
      data: {
        data: CashBill[]
        pagination?: components['schemas']['Pagination']
        total?: number
        page?: number
        limit?: number
        totalPages?: number
      }
    }>('/cash-bills/my', { params: filters })
    // Return just the bills array for simpler consumption
    return response.data.data.data
  },

  /**
   * Get cash bill details by ID
   */
  async getBillById(id: string): Promise<CashBillDetail> {
    const response = await apiClient.get<{
      success: boolean
      data: CashBillDetail
    }>(`/cash-bills/${id}`)
    return response.data.data
  },

  /**
   * Submit payment proof for a bill
   */
  async payBill(billId: string, data: PayBillData) {
    const formData = new FormData()
    formData.append('paymentProof', data.paymentProof)
    formData.append('paymentMethod', data.paymentMethod)
    if (data.notes) {
      formData.append('notes', data.notes)
    }

    const response = await uploadFile(`/cash-bills/${billId}/pay`, formData)
    return (response as Record<string, unknown>).data
  },

  /**
   * Cancel payment for a bill
   */
  async cancelPayment(billId: string) {
    const response = await apiClient.post(`/cash-bills/${billId}/cancel-payment`)
    return response.data
  },
}
