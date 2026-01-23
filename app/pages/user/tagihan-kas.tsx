'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Filter, Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'

type CashBill = components['schemas']['CashBill']

import { BillStatusBadge, EmptyState, TagihanKasSkeleton } from '~/components/data-display'
import { Icons } from '~/components/icons'
import { DetailTagihanKas } from '~/components/modals/DetailTagihanKas'
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from '~/components/shared/data-table/DataTable'
import { DataTablePagination } from '~/components/shared/data-table/DataTablePagination'
import { ExplorerProvider, useExplorer } from '~/components/shared/explorer/ExplorerContext'
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
import type { components } from '~/types/api'

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

interface TagihanKasParams {
  status: 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar' | undefined
  [key: string]: unknown
}

function TagihanKasContent() {
  const { filters, setFilters, sort, setSort, pagination } = useExplorer<TagihanKasParams>()
  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKas | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Map state
  const statusFilter = filters.status
  const sortBy = (sort?.key as 'dueDate' | 'month' | 'status') || 'dueDate'
  const sortOrder = (sort?.direction as 'asc' | 'desc') || 'desc'

  // Fetch cash bills with filters
  const { data: billsResponse, isLoading } = useQuery({
    ...cashBillQueries.my({
      status: statusFilter,
      sortBy,
      sortOrder,
      page: pagination.page,
      limit: pagination.limit,
    }),
    placeholderData: keepPreviousData,
  })

  const tagihanKasList: TagihanKas[] = useMemo(() => {
    // Adapter for new response structure
    const bills = billsResponse?.data
    if (!Array.isArray(bills)) return []

    return bills.map(
      (bill: CashBill & { user?: { name: string }; biayaAdmin?: number; kasKelas?: number }) => {
        const rawMonth = bill.month
        const dueDateValue = bill.dueDate || ''
        const user = bill.user

        let displayMonth = ''
        if (typeof rawMonth === 'number') {
          displayMonth = MONTH_NAMES[(rawMonth - 1) % 12] || String(rawMonth)
          if (bill.year) displayMonth += ` ${bill.year}`
        } else {
          const monthValue = String(rawMonth || '')
          const date = new Date(monthValue)
          displayMonth = !isNaN(date.getTime())
            ? date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            : monthValue
          if (bill.year && !displayMonth.includes(String(bill.year))) {
            displayMonth += ` ${bill.year}`
          }
        }

        return {
          id: String(bill.id || ''),
          month: displayMonth,
          status: (bill.status === 'sudah_dibayar'
            ? 'Sudah Dibayar'
            : bill.status === 'menunggu_konfirmasi'
              ? 'Menunggu Konfirmasi'
              : 'Belum Dibayar') as 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar',
          billId: String(bill.billId || ''),
          dueDate: new Date(dueDateValue).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          totalAmount: Number(bill.totalAmount || 0),
          name: String(user?.name || ''),
          kasKelas: Number(bill.kasKelas || 0),
          biayaAdmin: Number(bill.biayaAdmin || 0),
        }
      }
    )
  }, [billsResponse])

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

  const getSortLabel = () => {
    if (sortBy === 'dueDate') {
      return sortOrder === 'desc' ? 'Tenggat Waktu Terbaru' : 'Tenggat Waktu Terlama'
    }
    if (sortBy === 'month') {
      return 'Bulan'
    }
    return sortOrder === 'desc' ? 'Nominal Tertinggi' : 'Nominal Terendah'
  }

  if (isLoading && pagination.page === 1) {
    return <TagihanKasSkeleton />
  }

  return (
    <>
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
                    <DropdownMenuItem onClick={() => setFilters({ status: undefined })}>
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({ status: 'belum_dibayar' })}>
                      Belum Dibayar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({ status: 'menunggu_konfirmasi' })}>
                      Menunggu Konfirmasi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({ status: 'sudah_dibayar' })}>
                      Sudah Dibayar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Icons.Sort className="h-5 w-5" />
                      {getSortLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setSort({ key: 'dueDate', direction: 'desc' })}
                    >
                      Tenggat Waktu Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort({ key: 'dueDate', direction: 'asc' })}>
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
              <DataTable>
                <DataTableHeader>
                  <DataTableRow>
                    <DataTableHead>Bulan</DataTableHead>
                    <DataTableHead>Status</DataTableHead>
                    <DataTableHead>ID Tagihan</DataTableHead>
                    <DataTableHead>Tenggat Waktu</DataTableHead>
                    <DataTableHead>Total Tagihan</DataTableHead>
                    <DataTableHead className="w-12" />
                  </DataTableRow>
                </DataTableHeader>
                <DataTableBody>
                  {tagihanKasList.length === 0 ? (
                    <DataTableRow>
                      <DataTableCell colSpan={6} className="py-12">
                        <EmptyState
                          icon={Receipt}
                          title="Tidak ada tagihan"
                          description="Belum ada data yang sesuai dengan filter yang dipilih"
                        />
                      </DataTableCell>
                    </DataTableRow>
                  ) : (
                    tagihanKasList.map((tagihan) => (
                      <DataTableRow key={tagihan.id}>
                        <DataTableCell className="text-sm font-medium">
                          {tagihan.month}
                        </DataTableCell>
                        <DataTableCell>
                          <BillStatusBadge status={tagihan.status} />
                        </DataTableCell>
                        <DataTableCell className="text-sm">{tagihan.billId}</DataTableCell>
                        <DataTableCell className="text-sm">{tagihan.dueDate}</DataTableCell>
                        <DataTableCell className="text-sm font-bold text-blue-500">
                          {formatCurrency(tagihan.totalAmount)}
                        </DataTableCell>
                        <DataTableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(tagihan)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </DataTableCell>
                      </DataTableRow>
                    ))
                  )}
                </DataTableBody>
              </DataTable>
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

            <DataTablePagination
              total={billsResponse?.total || 0}
              totalPages={billsResponse?.totalPages || 1}
            />
          </CardContent>
        </Card>
      </div>

      {selectedTagihan && (
        <DetailTagihanKas
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          tagihan={selectedTagihan}
        />
      )}
    </>
  )
}

export default function TagihanKasPage() {
  return (
    <div className="p-6">
      <ExplorerProvider<TagihanKasParams>
        defaultLimit={50}
        defaultSort={{ key: 'dueDate', direction: 'desc' }}
      >
        <TagihanKasContent />
      </ExplorerProvider>
    </div>
  )
}
