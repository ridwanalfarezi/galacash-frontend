// Mock Users
export const mockStudent = {
  id: 'student-id-1',
  nim: '1234567890',
  name: 'John Student',
  email: 'student@example.com',
  role: 'user',
  classId: 'class-id-1',
  className: 'TI-3A',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
}

export const mockBendahara = {
  id: 'bendahara-id-1',
  nim: '0987654321',
  name: 'Jane Bendahara',
  email: 'bendahara@example.com',
  role: 'bendahara',
  classId: 'class-id-1',
  className: 'TI-3A',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bendahara',
}

// Mock Cash Bills
export const mockBillPending = {
  id: 'bill-id-1',
  billId: 'BILL-001',
  month: 'Januari',
  year: 2024,
  status: 'belum_dibayar',
  dueDate: '2024-01-31',
  totalAmount: 50000,
  name: 'Kas Januari 2024',
}

export const mockBillWaiting = {
  ...mockBillPending,
  status: 'menunggu_konfirmasi',
  paymentMethod: 'bank',
  paymentProofUrl: 'https://example.com/proof.jpg',
  paidAt: '2024-01-15T10:00:00Z',
}

export const mockBillPaid = {
  ...mockBillPending,
  status: 'sudah_dibayar',
  confirmedAt: '2024-01-16T10:00:00Z',
}

// Mock Fund Applications
export const mockFundApplication = {
  id: 'fund-app-id-1',
  date: '2024-01-20',
  purpose: 'Buy whiteboard markers',
  category: 'equipment',
  status: 'pending',
  amount: 25000,
  description: 'Markers for class activities',
  applicant: {
    id: mockStudent.id,
    name: mockStudent.name,
  },
}

export const mockFundApplicationApproved = {
  ...mockFundApplication,
  status: 'approved',
  reviewedBy: {
    id: mockBendahara.id,
    name: mockBendahara.name,
  },
  reviewedAt: '2024-01-21T09:00:00Z',
}

export const mockFundApplicationRejected = {
  ...mockFundApplication,
  status: 'rejected',
  rejectionReason: 'Budget exceeded',
  reviewedBy: {
    id: mockBendahara.id,
    name: mockBendahara.name,
  },
  reviewedAt: '2024-01-21T09:00:00Z',
}

// Mock Financial Recap
export const mockRecapSummary = {
  totalBalance: 1500000,
  totalIncome: 2000000,
  totalExpense: 500000,
  period: {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  },
}

export const mockStudentRecap = {
  ...mockStudent,
  paymentStatus: 'has-arrears', // Helper field for UI logic if needed, or derived
}
