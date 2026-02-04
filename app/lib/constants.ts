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
  education: { label: 'Pendidikan', labelEn: 'Education', hidden: true }, // Legacy
  health: { label: 'Kesehatan', labelEn: 'Health', hidden: true }, // Legacy
  emergency: { label: 'Darurat', labelEn: 'Emergency', hidden: true }, // Legacy
  equipment: { label: 'Peralatan', labelEn: 'Equipment', hidden: true }, // Legacy

  // New Categories aligned with Expense
  subscription: { label: 'Langganan', labelEn: 'Subscription' },
  consumption: { label: 'Konsumsi', labelEn: 'Consumption' },
  competition: { label: 'Lomba', labelEn: 'Competition' },
  printing: { label: 'Cetak', labelEn: 'Printing' },
  donation: { label: 'Sumbangan', labelEn: 'Donation' },
  other: { label: 'Lainnya', labelEn: 'Other' },
} as const

export type FundCategoryKey = keyof typeof FUND_CATEGORIES

/**
 * Get fund category options for select dropdown
 */
export const getFundCategoryOptions = () =>
  Object.entries(FUND_CATEGORIES)
    // @ts-expect-error - System flags might not exist
    .filter(([, config]) => !config.hidden)
    .map(([value, { label }]) => ({
      value,
      label,
    }))

// ============================================================================
// Transaction Categories
// ============================================================================

export const TRANSACTION_CATEGORIES = {
  // Income
  kas_kelas: { label: 'Kas Kelas', type: 'income', system_only: true },

  // User said: "So we have only 2 categories for income and make sure bendahara only can select category lainnya when add transaction."
  // So 'donation' should also be hidden or removed? Schema has 'donation'. User said "Income Categories: Only from users bill but for transaction creation purpose add lainnya. So we have only 2 categories for income".
  // "Kas Kelas" (from bills) and "Lainnya" (manual).
  // I will hide 'donation', 'fundraising', 'fine' from the options by checking against a strict allowed list or using system_only/hidden flag. Easiest is to just remove them from constants or mark them system_only or hidden.
  // Let's add 'hidden: true' for those we want to keep in schema but hide in UI.
  // Actually, I'll just comment them out or remove them from this object if they are not used elsewhere in frontend logic.
  // But safest is to keep them but filter them out.
  // Let's try strict approach: define only what's needed.
  other: { label: 'Lainnya', type: 'both' }, // Income: Lainnya, Expense: Lainnya? User listed specific expenses. "Donation", "Subscription", "Consumption", "Competition", "Printing".
  // Wait, user listed expense categories: "zoom premium bulanan", "konsum galameet", "lomba", "print krs", "sumbangan".
  // And "your decide better names based on this".
  // So:
  // Subscription -> Langganan
  // Consumption -> Konsumsi
  // Competition -> Lomba
  // Printing -> Cetak
  // Donation -> Sumbangan

  // Existing ones in schema that match:
  // subscription (new)
  // consumption (existing)
  // competition (new)
  // printing (existing)
  // donation (existing - was income/donation, now needed for expense 'sumbangan')

  // We need to manage 'donation' carefully. In schema it's just 'donation'.
  // Constants defines: donation: { label: 'Donasi', type: 'income' }.
  // I should change it to type 'expense' (or 'both' if legacy data needs it) and label 'Sumbangan'.

  // Income:
  // kas_kelas (system_only)
  // other (manual)

  fundraising: { label: 'Fundraising', type: 'income', hidden: true },
  fine: { label: 'Denda', type: 'income', hidden: true },
  event: { label: 'Acara', type: 'both', hidden: true },

  // Expense
  subscription: { label: 'Langganan', type: 'expense' },
  consumption: { label: 'Konsumsi', type: 'expense' },
  competition: { label: 'Lomba', type: 'expense' },
  printing: { label: 'Cetak', type: 'expense' },
  // donation: { label: 'Sumbangan', type: 'expense' }, // Reusing 'donation' key.
  // Note: 'donation' was defined as income previously. If I change it here to expense, it affects the options.
  // But wait, "Sumbangan" is requested as expense.
  donation: { label: 'Sumbangan', type: 'expense' },

  // Rest hide
  education: { label: 'Pendidikan', type: 'expense', hidden: true },
  health: { label: 'Kesehatan', type: 'expense', hidden: true },
  emergency: { label: 'Darurat', type: 'expense', hidden: true },
  equipment: { label: 'Peralatan', type: 'expense', hidden: true },
  office_supplies: { label: 'Alat Tulis Kantor', type: 'expense', hidden: true },
  maintenance: { label: 'Pemeliharaan', type: 'expense', hidden: true },
  transport: { label: 'Transportasi', type: 'expense', hidden: true },
  social: { label: 'Sosial', type: 'expense', hidden: true }, // 'social' was 'Sosial & Sumbangan'. User wants specific 'sumbangan'. I'll rely on 'donation' for sumbangan or 'social'.
  // 'donation' exists in schema. 'social' exists in schema.
  // User asked for 'sumbangan'. 'donation' fits better semantically for 'sumbangan' (charity/donation). 'social' is vague.
  // Ill use 'donation' for Sumbangan.
} as const

export type TransactionCategoryKey = keyof typeof TRANSACTION_CATEGORIES

/**
 * Get transaction category options by type
 */
export const getTransactionCategoryOptions = (type: 'income' | 'expense') =>
  Object.entries(TRANSACTION_CATEGORIES)
    .filter(([, config]) => {
      // Safe access using type guard or unnecessary cast removal if types align
      const c = config as { type: string; system_only?: boolean; hidden?: boolean; label: string }
      return (c.type === type || c.type === 'both') && !c.system_only && !c.hidden
    })
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

// ============================================================================
// Dashboard Settings
// ============================================================================

export const DEFAULT_DASHBOARD_START_DATE = new Date(2024, 8, 5) // September 5, 2024
