import { apiClient } from '~/lib/api/client';
import { mapPaginatedResponse } from '~/lib/utils/apiHelper';
import type { components } from '~/types/api';

type User = components['schemas']['User'];
type CashBill = components['schemas']['CashBill'];

interface StudentRekap extends User {
  totalPaid?: number;
  totalUnpaid?: number;
  billsCount?: number;
  userId?: string;
  paymentStatus?: 'up-to-date' | 'has-arrears';
  [key: string]: unknown;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BendaharaFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  userId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  paymentStatus?: 'up-to-date' | 'has-arrears';
}

export interface CreateTransactionData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category?: string;
  attachment?: File;
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
    const response = await apiClient.get('/bendahara/dashboard', { params });
    return response.data.data;
  },

  /**
   * Get fund applications for review
   */
  async getPendingApplications() {
    const response = await apiClient.get('/bendahara/fund-applications');
    return response.data.data;
  },

  /**
   * Get fund application detail
   */
  async getFundApplicationDetail(id: string) {
    const response = await apiClient.get(`/bendahara/fund-applications/${id}`);
    return response.data.data;
  },

  /**
   * Approve fund application
   */
  async approveFundApplication(id: string) {
    const response = await apiClient.post(`/bendahara/fund-applications/${id}/approve`);
    return response.data.data;
  },

  /**
   * Reject fund application
   */
  async rejectFundApplication(id: string, reason: string) {
    const response = await apiClient.post(`/bendahara/fund-applications/${id}/reject`, {
      rejectionReason: reason,
    });
    return response.data.data;
  },

  /**
   * Get students list for rekap
   */
  async getStudents(params?: BendaharaFilters) {
    const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<User> }>(
      '/bendahara/students',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get student detail
   */
  async getStudentDetail(id: string) {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      `/bendahara/students/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a manual transaction
   */
  async createTransaction(data: CreateTransactionData) {
    const formData = new FormData();
    formData.append('date', data.date);
    formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('amount', String(data.amount));
    if (data.category) formData.append('category', data.category);
    if (data.attachment) formData.append('attachment', data.attachment);

    const response = await apiClient.post('/bendahara/transactions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Get cash bills for review
   */
  async getCashBills(params?: BendaharaFilters) {
    const response = await apiClient.get('/bendahara/cash-bills', { params });
    return mapPaginatedResponse<CashBill>(response.data.data);
  },

  /**
   * Confirm cash bill payment
   */
  async confirmPayment(billId: string) {
    const response = await apiClient.post<{
      success: boolean;
      data: CashBill;
      message: string;
    }>(`/bendahara/cash-bills/${billId}/confirm-payment`);
    return response.data.data;
  },

  /**
   * Reject cash bill payment
   */
  async rejectPayment(billId: string, reason?: string) {
    const response = await apiClient.post<{
      success: boolean;
      data: CashBill;
      message: string;
    }>(`/bendahara/cash-bills/${billId}/reject-payment`, { reason });
    return response.data.data;
  },

  /**
   * Get financial recap (rekap kas)
   */
  async getRekapKas(params?: BendaharaFilters) {
    const response = await apiClient.get('/bendahara/rekap-kas', { params });
    const mapped = mapPaginatedResponse<StudentRekap>(response.data.data, 'students');

    return {
      ...mapped,
      summary: response.data.data?.summary,
      transactions: response.data.data?.transactions,
      period: response.data.data?.period,
      students: mapped.data, // Backward compatibility with page expectations
    };
  },

  /**
   * Get financial recap summary
   */
  async getRekapSummary(params?: { startDate?: string; endDate?: string }) {
    const response = await apiClient.get('/bendahara/rekap-kas/summary', { params });
    return response.data.data;
  },

  /**
   * Export financial recap
   */
  async exportRekapKas(params?: BendaharaFilters) {
    const response = await apiClient.get('/bendahara/rekap-kas/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
