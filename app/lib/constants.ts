// ============================================================================
// Status Labels
// ============================================================================

export const STATUS_LABELS = {
  // Fund application statuses
  pending: { label: 'Pending', labelId: 'Menunggu', color: 'yellow' },
  approved: { label: 'Approved', labelId: 'Diterima', color: 'green' },
  rejected: { label: 'Rejected', labelId: 'Ditolak', color: 'red' },
  // Cash bill statuses
  belum_dibayar: { label: 'Unpaid', labelId: 'Belum Dibayar', color: 'red' },
  menunggu_konfirmasi: { label: 'Pending', labelId: 'Menunggu Konfirmasi', color: 'yellow' },
  sudah_dibayar: { label: 'Paid', labelId: 'Sudah Dibayar', color: 'green' },
} as const

export type StatusKey = keyof typeof STATUS_LABELS

// ============================================================================
// Transaction Types
// ============================================================================

export const TRANSACTION_TYPES = {
  income: {
    label: 'Pemasukan',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  expense: { label: 'Pengeluaran', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' },
} as const

export type TransactionTypeKey = keyof typeof TRANSACTION_TYPES

// ============================================================================
// Fund Categories
// ============================================================================

export const FUND_CATEGORIES = {
  education: { label: 'Pendidikan', labelEn: 'Education' },
  health: { label: 'Kesehatan', labelEn: 'Health' },
  emergency: { label: 'Darurat', labelEn: 'Emergency' },
  equipment: { label: 'Peralatan', labelEn: 'Equipment' },
} as const

export type FundCategoryKey = keyof typeof FUND_CATEGORIES

/**
 * Get fund category options for select dropdown
 */
export const getFundCategoryOptions = () =>
  Object.entries(FUND_CATEGORIES).map(([value, { label }]) => ({
    value,
    label,
  }))

// ============================================================================
// Transaction Categories
// ============================================================================

export const TRANSACTION_CATEGORIES = {
  // Income
  kas_kelas: { label: 'Kas Kelas', type: 'income' },
  donation: { label: 'Donasi', type: 'income' },
  fundraising: { label: 'Fundraising', type: 'income' },
  event: { label: 'Acara', type: 'both' }, // Events can store revenue or cost
  // Expense (Aligned with Fund Categories + Extras)
  education: { label: 'Pendidikan', type: 'expense' },
  health: { label: 'Kesehatan', type: 'expense' },
  emergency: { label: 'Darurat', type: 'expense' },
  equipment: { label: 'Peralatan', type: 'expense' },
  office_supplies: { label: 'Alat Tulis Kantor', type: 'expense' },
  consumption: { label: 'Konsumsi', type: 'expense' },
  maintenance: { label: 'Pemeliharaan', type: 'expense' },
  other: { label: 'Lainnya', type: 'both' },
} as const

export type TransactionCategoryKey = keyof typeof TRANSACTION_CATEGORIES

/**
 * Get transaction category options by type
 */
export const getTransactionCategoryOptions = (type: 'income' | 'expense') =>
  Object.entries(TRANSACTION_CATEGORIES)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, config]) => config.type === type || config.type === 'both')
    .map(([value, config]) => ({
      value,
      label: config.label,
    }))

// ============================================================================
// Chart Colors
// ============================================================================

export const CHART_COLORS = {
  income: ['#50b89a', '#8cd9a7', '#34a0a4', '#2d7a8e', '#1c5f6f'],
  expense: ['#920c22', '#af2038', '#800016', '#c92a3f', '#e04855'],
} as const

/**
 * Get chart color by index with cycling
 */
export const getChartColor = (type: 'income' | 'expense', index: number): string => {
  const colors = CHART_COLORS[type]
  return colors[index % colors.length]
}

// ============================================================================
// Filter Options
// ============================================================================

export const FILTER_STATUS_OPTIONS = [
  { id: 'approved', label: 'Diterima', color: 'bg-green-50 text-green-700' },
  { id: 'rejected', label: 'Ditolak', color: 'bg-red-50 text-red-700' },
  { id: 'pending', label: 'Menunggu', color: 'bg-yellow-300 text-yellow-700' },
] as const

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
] as const

export const SORT_OPTIONS = {
  transactions: [
    { sortBy: 'date', sortOrder: 'desc', label: 'Tanggal Terbaru' },
    { sortBy: 'date', sortOrder: 'asc', label: 'Tanggal Terlama' },
    { sortBy: 'amount', sortOrder: 'desc', label: 'Nominal Tertinggi' },
    { sortBy: 'amount', sortOrder: 'asc', label: 'Nominal Terendah' },
  ],
} as const

// ============================================================================
// Pagination Defaults
// ============================================================================

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100,
} as const

// ============================================================================
// Month Names (Bahasa Indonesia)
// ============================================================================

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const

// ============================================================================
// Date Range Presets
// ============================================================================

export const DATE_RANGE_PRESETS = {
  thisMonth: () => ({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  }),
  lastMonth: () => {
    const now = new Date()
    return {
      from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      to: new Date(now.getFullYear(), now.getMonth(), 0),
    }
  },
  thisYear: () => ({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  }),
} as const
