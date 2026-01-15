'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Filter, Receipt, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Icons } from '~/components/icons'
import { DetailTagihanKas } from '~/components/modals/DetailTagihanKas'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { useIsMobile } from '~/hooks/use-mobile'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { formatCurrency } from '~/lib/utils'

interface TagihanKas {
  id: string
  month: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  billId: string
  dueDate: string
  totalAmount: number
  name: string
  kasKelas: number
  biayaAdmin: number
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

export default function TagihanKasPage() {
  const isMobile = useIsMobile()

  // Fetch cash bills
  const { data: billsData } = useQuery(cashBillQueries.my())
  const mockTagihanKas: TagihanKas[] = useMemo(() => {
    if (!billsData?.bills) return []
    return billsData.bills.map((bill: Record<string, unknown>) => {
      const monthValue = (bill.month as string | undefined) || ''
      const dueDateValue = (bill.dueDate as string | undefined) || ''
      const user = bill.user as Record<string, unknown> | undefined
      return {
        id: String(bill.id || ''),
        month: new Date(monthValue).toLocaleDateString('id-ID', { month: 'long' }),
        status: (bill.status === 'paid'
          ? 'Sudah Dibayar'
          : bill.status === 'pending_payment'
            ? 'Menunggu Konfirmasi'
            : 'Belum Dibayar') as 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar',
        billId: String(bill.billNumber || ''),
        dueDate: new Date(dueDateValue).toLocaleDateString('id-ID'),
        totalAmount: Number(bill.totalAmount || 0),
        name: String(user?.name || ''),
        kasKelas: Number(bill.amount || 0),
        biayaAdmin: Number(bill.adminFee || 0),
      }
    })
  }, [billsData])

  // Pay bill mutation - TODO: use when API is ready
  // const payBillMutation = useMutation({
  //   mutationFn: ({ billId, data }: { billId: string; data: PayBillData }) =>
  //     cashBillService.payBill(billId, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: cashBillQueries.my().queryKey })
  //     toast.success('Pembayaran berhasil diupload')
  //     handleCloseModal()
  //   },
  //   onError: () => {
  //     toast.error('Gagal mengupload pembayaran')
  //   },
  // })

  // Toggle state for buttons - initialize based on isMobile
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKas | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

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

  const getStatusBadge = (status: TagihanKas['status']) => {
    switch (status) {
      case 'Belum Dibayar':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
            {status}
          </Badge>
        )
      case 'Menunggu Konfirmasi':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            {status}
          </Badge>
        )
      case 'Sudah Dibayar':
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetail = (tagihan: TagihanKas) => {
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

  // Apply filters and sorting
  const filteredAndSortedData = mockTagihanKas
    .filter((tagihan) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(tagihan.status)) {
        return false
      }

      // Month filter
      if (filters.month.length > 0 && !filters.month.includes(tagihan.month)) {
        return false
      }

      // Amount range filter
      if (filters.amountRange !== 'all') {
        const amount = tagihan.totalAmount
        switch (filters.amountRange) {
          case 'under25k':
            if (amount >= 25000) return false
            break
          case '25k-50k':
            if (amount < 25000 || amount > 50000) return false
            break
          case 'above50k':
            if (amount <= 50000) return false
            break
        }
      }

      return true
    })
    .sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1

      switch (sortConfig.field) {
        case 'date':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() * direction
        case 'amount':
          return (a.totalAmount - b.totalAmount) * direction
        case 'status':
          return a.status.localeCompare(b.status) * direction
        case 'month':
          return a.month.localeCompare(b.month) * direction
        default:
          return 0
      }
    })

  // Check if any filters are active
  const hasActiveFilters =
    filters.status.length > 0 || filters.month.length > 0 || filters.amountRange !== 'all'
  const hasActiveSort = sortConfig.field !== 'date' || sortConfig.direction !== 'desc'

  return (
    <div className="p-6">
      <div className="mx-auto max-w-360">
        <Card className="rounded-4xl border-0">
          <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
              <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
                Rekap Tagihan Kas
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsButtonsVisible(!isButtonsVisible)}
                className="p-1 transition-transform duration-200 hover:scale-110 sm:hidden"
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
              className={`transition-all duration-300 ease-in-out sm:block sm:w-auto sm:translate-y-0 sm:opacity-100 ${
                !isButtonsVisible
                  ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
                  : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
              }`}
            >
              <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto sm:gap-2">
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
                          {['Belum Dibayar', 'Menunggu Konfirmasi', 'Sudah Dibayar'].map(
                            (status) => (
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
                            )
                          )}
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
              <table className="w-full max-w-360">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-3 text-left font-medium">Bulan</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">ID Tagihan</th>
                    <th className="px-4 py-3 text-left font-medium">Tenggat Waktu</th>
                    <th className="px-4 py-3 text-left font-medium">Total Tagihan</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-4 text-gray-400">
                            <Receipt className="mx-auto size-12" />
                          </div>
                          <h3 className="mb-2 text-lg font-medium text-gray-900">
                            Tidak ada tagihan
                          </h3>
                          <p className="text-sm text-gray-500">
                            Belum ada data yang sesuai dengan filter yang dipilih
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedData.map((tagihan) => (
                      <tr key={tagihan.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{tagihan.month}</td>
                        <td className="px-4 py-3">{getStatusBadge(tagihan.status)}</td>
                        <td className="px-4 py-3 text-sm">{tagihan.billId}</td>
                        <td className="px-4 py-3 text-sm">{tagihan.dueDate}</td>
                        <td className="px-4 py-3 text-sm font-bold text-blue-500">
                          {formatCurrency(tagihan.totalAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(tagihan)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 sm:hidden">
              {filteredAndSortedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-gray-400">
                    <Receipt className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada tagihan</h3>
                  <p className="text-sm text-gray-500">
                    Belum ada data yang sesuai dengan filter yang dipilih
                  </p>
                </div>
              ) : (
                filteredAndSortedData.map((tagihan) => (
                  <div
                    key={tagihan.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{tagihan.dueDate}</span>
                      {getStatusBadge(tagihan.status)}
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedTagihan && (
        <DetailTagihanKas
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          tagihan={selectedTagihan}
        />
      )}
    </div>
  )
}
