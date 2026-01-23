import { apiClient, uploadFile } from '~/lib/api/client'
import { mapPaginatedResponse } from '~/lib/utils/api-helper'
import type { components } from '~/types/api'

type FundApplication = components['schemas']['FundApplication']
type FundApplicationDetail = components['schemas']['FundApplicationDetail']

export interface FundApplicationFilters {
  page?: number
  limit?: number
  status?: 'pending' | 'approved' | 'rejected'
  category?: 'education' | 'health' | 'emergency' | 'equipment'
  sortBy?: 'date' | 'amount' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateFundApplicationData {
  purpose: string
  category: 'education' | 'health' | 'emergency' | 'equipment'
  amount: number
  description?: string
  attachment?: File
}

/**
 * Fund Application service
 * Handles fund application operations
 */
export const fundApplicationService = {
  /**
   * Get list of fund applications
   */
  async getApplications(filters?: FundApplicationFilters) {
    const response = await apiClient.get('/fund-applications', { params: filters })
    return mapPaginatedResponse<FundApplication>(response.data.data)
  },

  /**
   * Get user's own fund applications
   */
  async getMyApplications(filters?: FundApplicationFilters) {
    const response = await apiClient.get('/fund-applications/my', { params: filters })
    return mapPaginatedResponse<FundApplication>(response.data.data)
  },

  /**
   * Get fund application details by ID
   */
  async getApplicationById(id: string): Promise<FundApplicationDetail> {
    const response = await apiClient.get<{
      success: boolean
      data: FundApplicationDetail
    }>(`/fund-applications/${id}`)
    return response.data.data
  },

  /**
   * Create new fund application
   */
  async createApplication(data: CreateFundApplicationData) {
    const formData = new FormData()
    formData.append('purpose', data.purpose)
    formData.append('category', data.category)
    formData.append('amount', data.amount.toString())
    if (data.description) {
      formData.append('description', data.description)
    }
    if (data.attachment) {
      formData.append('attachment', data.attachment)
    }

    const response = await uploadFile('/fund-applications', formData)
    return (response as Record<string, unknown>).data
  },
}
