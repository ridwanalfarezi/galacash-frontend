import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Filter, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'

import { Icons } from '~/components/icons'
import { DetailTagihanKasBendahara } from '~/components/modals/DetailTagihanKasBendahara'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { useIsMobile } from '~/hooks/use-mobile'
import { formatCurrency } from '~/lib/utils'

export function useNamaMahasiswa() {
  const location = useLocation()
  const nama = location.state?.nama || 'Mahasiswa'
  return nama
}
interface Tagihan {
  id: string
  month: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  billId: string
  name: string
  dueDate: string
  kasKelas: number
  biayaAdmin: number
  totalAmount: number
}

interface FilterState {
  status: string[]
  month: string[]
  amountRange: 'all' | 'under25k' | '25k-50k' | 'above50k'
}

interface SortState {
  field: 'date' | 'amount' | 'status' | 'month'
  direction: 'asc' | 'desc'
}

const statusColor: Record<Tagihan['status'], string> = {
  'Belum Dibayar': 'bg-red-100 text-red-700',
  'Menunggu Konfirmasi': 'bg-yellow-100 text-yellow-600',
  'Sudah Dibayar': 'bg-green-100 text-green-700',
}

export default function BendaharaDetailRekapKas() {
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const nama = useNamaMahasiswa()

  const dataTagihan: Tagihan[] = [
    {
      id: '1',
      month: 'Desember',
      status: 'Belum Dibayar',
      billId: 'INV-20241201-020-001',
      name: nama,
      dueDate: '31 Desember 2024',
      kasKelas: 15000,
      biayaAdmin: 1000,
      totalAmount: 16000,
    },
    {
      id: '2',
      month: 'November',
      status: 'Menunggu Konfirmasi',
      billId: 'INV-20241101-020-001',
      name: nama,
      dueDate: '30 November 2024',
      kasKelas: 15000,
      biayaAdmin: 1000,
      totalAmount: 16000,
    },
    {
      id: '3',
      month: 'Oktober',
      status: 'Sudah Dibayar',
      billId: 'INV-20241001-020-001',
      name: nama,
      dueDate: '31 October 2024',
      kasKelas: 15000,
      biayaAdmin: 1000,
      totalAmount: 16000,
    },
    {
      id: '4',
      month: 'September',
      status: 'Sudah Dibayar',
      billId: 'INV-20240901-020-001',
      name: nama,
      dueDate: '30 September 2024',
      kasKelas: 15000,
      biayaAdmin: 1000,
      totalAmount: 16000,
    },
  ]

  // Filter and Sort states
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    month: [],
    amountRange: 'all',
  })
  const [sortConfig, setSortConfig] = useState<SortState>({
    field: 'date',
    direction: 'desc',
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const handleViewDetail = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTagihan(null)
  }

  // Filter and Sort functions
  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }))
  }

  const handleMonthFilter = (month: string) => {
    setFilters((prev) => ({
      ...prev,
      month: prev.month.includes(month)
        ? prev.month.filter((m) => m !== month)
        : [...prev.month, month],
    }))
  }

  const handleSort = (field: SortState['field']) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      month: [],
      amountRange: 'all',
    })
    setSortConfig({
      field: 'date',
      direction: 'desc',
    })
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.status.length > 0 || filters.month.length > 0 || filters.amountRange !== 'all'
  const hasActiveSort = sortConfig.field !== 'date' || sortConfig.direction !== 'desc'

  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-360 rounded-4xl border-0">
        <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
            <span>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/bendahara/rekap-kas/`}>
                  <ChevronLeft className="size-6 h-6 w-6" />
                </Link>
              </Button>
            </span>
            <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
              Rekap Tagihan Kas - {nama}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsButtonsVisible(!isButtonsVisible)}
              className="p-1 transition-transform duration-200 hover:scale-110 md:hidden"
            >
              <div className="transition-transform duration-300">
                {isButtonsVisible ? (
                  <ChevronUp className="size-6" />
                ) : (
                  <ChevronDown className="size-6" />
                )}
              </div>
            </Button>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out md:block md:w-auto md:translate-y-0 md:opacity-100 ${
              !isButtonsVisible
                ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
                : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
            }`}
          >
            <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:w-auto sm:gap-2">
              {/* Filter Dropdown */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={hasActiveFilters ? 'default' : 'secondary'}
                    className="relative w-full sm:w-auto"
                  >
                    <Filter className="h-5 w-5" />
                    Filter
                    {hasActiveFilters && (
                      <Badge className="ml-1 h-5 bg-white px-1.5 py-0.5 text-xs text-blue-500">
                        {filters.status.length +
                          filters.month.length +
                          (filters.amountRange !== 'all' ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Options</h4>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <div className="space-y-2">
                        {['Belum Dibayar', 'Menunggu Konfirmasi', 'Sudah Dibayar'].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={status}
                              checked={filters.status.includes(status)}
                              onCheckedChange={() => handleStatusFilter(status)}
                              className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                            />
                            <label htmlFor={status} className="cursor-pointer text-sm">
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Month Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Month</label>
                      <div className="space-y-2">
                        {['Desember', 'November', 'Oktober', 'September'].map((month) => (
                          <div key={month} className="flex items-center space-x-2">
                            <Checkbox
                              id={month}
                              checked={filters.month.includes(month)}
                              onCheckedChange={() => handleMonthFilter(month)}
                              className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                            />
                            <label htmlFor={month} className="cursor-pointer text-sm">
                              {month}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sort Dropdown */}
              <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={hasActiveSort ? 'default' : 'secondary'}
                    className="w-full sm:w-auto"
                  >
                    <Icons.Sort className="h-5 w-5" />
                    Sort
                    {hasActiveSort && (
                      <Badge className="ml-1 h-5 bg-white px-1.5 py-0.5 text-xs text-blue-500">
                        1
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" align="start">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sort Options</h4>

                    <div className="space-y-2">
                      {[
                        { field: 'date', label: 'Date' },
                        { field: 'amount', label: 'Amount' },
                        { field: 'status', label: 'Status' },
                        { field: 'month', label: 'Month' },
                      ].map((option) => (
                        <button
                          key={option.field}
                          onClick={() => handleSort(option.field as SortState['field'])}
                          className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                            sortConfig.field === option.field
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{option.label}</span>
                            {sortConfig.field === option.field && (
                              <span className="text-xs">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear Filters Button */}
              {(hasActiveFilters || hasActiveSort) && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full max-w-360 text-left text-sm">
              <thead>
                <tr className="border-b text-base">
                  <th className="px-4 py-3">Bulan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">ID Tagihan</th>
                  <th className="px-4 py-3">Tenggat Waktu</th>
                  <th className="px-4 py-3">Total Tagihan</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {dataTagihan.map((tagihan) => (
                  <tr key={tagihan.billId} className="border-b transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{tagihan.month}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${statusColor[tagihan.status]}`}
                      >
                        {tagihan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tagihan.billId}</td>
                    <td className="px-4 py-3">{tagihan.dueDate}</td>
                    <td className="px-4 py-3 font-semibold text-blue-500">
                      {formatCurrency(tagihan.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(tagihan)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 sm:hidden">
            {dataTagihan.map((tagihan) => (
              <div
                key={tagihan.billId}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{tagihan.dueDate}</span>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${statusColor[tagihan.status]}`}
                  >
                    {tagihan.status}
                  </span>
                </div>
                <div className="font-semibold">{tagihan.month}</div>
                <div className="text-xs text-gray-700">
                  <span>{tagihan.billId}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-blue-500">
                    {formatCurrency(tagihan.totalAmount)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetail(tagihan)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedTagihan && (
        <DetailTagihanKasBendahara
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          tagihan={selectedTagihan}
        />
      )}
    </div>
  )
}
