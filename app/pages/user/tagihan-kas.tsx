'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Filter, Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'

import { BillStatusBadge, EmptyState, TagihanKasSkeleton } from '~/components/data-display'
import { Icons } from '~/components/icons'
import { DetailTagihanKas } from '~/components/modals/DetailTagihanKas'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useIsMobile } from '~/hooks/use-mobile'
import { MONTH_NAMES, STATUS_LABELS } from '~/lib/constants'
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

export default function TagihanKasPage() {
  const isMobile = useIsMobile()

  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<'dueDate' | 'month' | 'status'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Fetch cash bills with filters
  const { data: billsData, isLoading } = useQuery(
    cashBillQueries.my({
      status: statusFilter as 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar' | undefined,
      sortBy,
      sortOrder,
    })
  )

  const tagihanKasList: TagihanKas[] = useMemo(() => {
    if (!Array.isArray(billsData)) return []
    return billsData.map((bill: Record<string, unknown>) => {
      const rawMonth = bill.month as string | number | undefined
      const dueDateValue = (bill.dueDate as string | undefined) || ''
      const user = bill.user as Record<string, unknown> | undefined

      let displayMonth = ''
      if (typeof rawMonth === 'number') {
        // Handle 1-12 integer
        displayMonth = MONTH_NAMES[(rawMonth - 1) % 12] || String(rawMonth)
        // Add year if available to make it "Januari 2026"
        if (bill.year) displayMonth += ` ${bill.year}`
      } else {
        // Fallback for string
        const monthValue = String(rawMonth || '')
        const date = new Date(monthValue)
        // If valid date, format it. If "Januari", keep it.
        displayMonth = !isNaN(date.getTime())
          ? date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
          : monthValue
        // Append year if not present in string and year field exists
        if (bill.year && !displayMonth.includes(String(bill.year))) {
          displayMonth += ` ${bill.year}`
        }
      }

      return {
        id: String(bill.id || ''),
        month: displayMonth,
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

  // Toggle state for buttons - initialize based on isMobile
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKas | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleViewDetail = (tagihan: TagihanKas) => {
    setSelectedTagihan(tagihan)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTagihan(null)
  }

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS]?.labelId || status
  }

  const getSortLabel = (sortBy: string, sortOrder: string) => {
    if (sortBy === 'dueDate') {
      return sortOrder === 'desc' ? 'Tenggat Waktu Terbaru' : 'Tenggat Waktu Terlama'
    }
    if (sortBy === 'month') {
      return 'Bulan'
    }
    return sortOrder === 'desc' ? 'Nominal Tertinggi' : 'Nominal Terendah'
  }

  if (isLoading) {
    return <TagihanKasSkeleton />
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-360">
        <Card className="rounded-4xl border-0">
          <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
              <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
                Tagihan Kas
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={statusFilter ? 'default' : 'secondary'}
                      className="w-full sm:w-auto"
                    >
                      <Filter className="h-5 w-5" />
                      {statusFilter ? getStatusLabel(statusFilter) : 'Filter'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setStatusFilter(undefined)}>
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('belum_dibayar')}>
                      Belum Dibayar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('menunggu_konfirmasi')}>
                      Menunggu Konfirmasi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('sudah_dibayar')}>
                      Sudah Dibayar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Icons.Sort className="h-5 w-5" />
                      {getSortLabel(sortBy, sortOrder)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy('dueDate')
                        setSortOrder('desc')
                      }}
                    >
                      Tenggat Waktu Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy('dueDate')
                        setSortOrder('asc')
                      }}
                    >
                      Tenggat Waktu Terlama
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
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
                  {tagihanKasList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12">
                        <EmptyState
                          icon={Receipt}
                          title="Tidak ada tagihan"
                          description="Belum ada data yang sesuai dengan filter yang dipilih"
                        />
                      </td>
                    </tr>
                  ) : (
                    tagihanKasList.map((tagihan) => (
                      <tr key={tagihan.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{tagihan.month}</td>
                        <td className="px-4 py-3">
                          <BillStatusBadge status={tagihan.status} />
                        </td>
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

            {/* Mobile Card View */}
            <div className="space-y-4 sm:hidden">
              {tagihanKasList.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Tidak ada tagihan"
                  description="Belum ada data yang sesuai dengan filter yang dipilih"
                  className="py-12"
                />
              ) : (
                tagihanKasList.map((tagihan) => (
                  <div
                    key={tagihan.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{tagihan.dueDate}</span>
                      <BillStatusBadge status={tagihan.status} size="sm" />
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
