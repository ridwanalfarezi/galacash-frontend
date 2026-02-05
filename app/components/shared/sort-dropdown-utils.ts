export interface SortOption {
  id: string
  label: string
  field: string
  direction: 'asc' | 'desc'
  category: string
}

export const sortOptions: SortOption[] = [
  {
    id: 'date-newest',
    label: 'Tanggal Terbaru',
    field: 'date',
    direction: 'desc',
    category: 'Tanggal',
  },
  {
    id: 'date-oldest',
    label: 'Tanggal Terlama',
    field: 'date',
    direction: 'asc',
    category: 'Tanggal',
  },
  {
    id: 'amount-highest',
    label: 'Nominal Tertinggi',
    field: 'amount',
    direction: 'desc',
    category: 'Nominal',
  },
  {
    id: 'amount-lowest',
    label: 'Nominal Terendah',
    field: 'amount',
    direction: 'asc',
    category: 'Nominal',
  },
  {
    id: 'purpose-a-z',
    label: 'Keperluan: A ke Z',
    field: 'purpose',
    direction: 'asc',
    category: 'Keperluan',
  },
  {
    id: 'purpose-z-a',
    label: 'Keperluan: Z ke A',
    field: 'purpose',
    direction: 'desc',
    category: 'Keperluan',
  },
  {
    id: 'category-a-z',
    label: 'Kategori: A ke Z',
    field: 'category',
    direction: 'asc',
    category: 'Kategori',
  },
  {
    id: 'category-z-a',
    label: 'Kategori: Z ke A',
    field: 'category',
    direction: 'desc',
    category: 'Kategori',
  },
  {
    id: 'status-a-z',
    label: 'Status: A ke Z',
    field: 'status',
    direction: 'asc',
    category: 'Status',
  },
  {
    id: 'status-z-a',
    label: 'Status: Z ke A',
    field: 'status',
    direction: 'desc',
    category: 'Status',
  },
  {
    id: 'applicant-a-z',
    label: 'Pengaju: A ke Z',
    field: 'applicant',
    direction: 'asc',
    category: 'Pengaju',
  },
  {
    id: 'applicant-z-a',
    label: 'Pengaju: Z ke A',
    field: 'applicant',
    direction: 'desc',
    category: 'Pengaju',
  },
]

const groupedSortOptions = sortOptions.reduce(
  (acc, option) => {
    if (!acc[option.category]) acc[option.category] = []
    acc[option.category].push(option)
    return acc
  },
  {} as Record<string, SortOption[]>
)

// Bagi ke dua kolom
const leftCategories = ['Tanggal', 'Nominal', 'Keperluan']
const rightCategories = Object.keys(groupedSortOptions).filter(
  (cat) => !leftCategories.includes(cat)
)

export const leftColumnData = leftCategories.map((cat) => [cat, groupedSortOptions[cat]] as const)
export const rightColumnData = rightCategories.map((cat) => [cat, groupedSortOptions[cat]] as const)
