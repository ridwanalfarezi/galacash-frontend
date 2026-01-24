'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import {
  BillStatusBadge,
  EmptyState,
  MobileCardListSkeleton,
  TableBodySkeleton,
} from '~/components/data-display'
import { DetailTagihanKasBendahara } from '~/components/modals/DetailTagihanKasBendahara'
import {
  DataCard,
  DataCardContainer,
  DataMobileFilters,
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
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { formatCurrency } from '~/lib/utils'
import type { components } from '~/types/api'

type CashBill = components['schemas']['CashBill']

type ExtendedCashBill = CashBill & {
  userId?: string
  paymentMethod?: string
  paymentProofUrl?: string
  kasKelas?: number | string
  biayaAdmin?: number | string
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
  metodePembayaran?: 'bank' | 'ewallet' | 'cash'
  paymentProofUrl?: string | null
}

interface DetailRekapParams {
  status?: 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar'
  search?: string
  [key: string]: unknown
}

function BendaharaDetailRekapKasContent() {
  const { search, debouncedSearch, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<DetailRekapParams>()
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const location = useLocation()
  const { userId } = useParams()
  const nama = location.state?.nama || 'Mahasiswa'

  const { data: response, isLoading } = useQuery({
    ...bendaharaQueries.cashBills(
      userId
        ? {
            userId,
            status: filters.status,
            search: debouncedSearch || undefined,
            sortBy: sort?.key === 'date' ? undefined : (sort?.key as 'month' | 'amount'),
            sortOrder: (sort?.direction as 'asc' | 'desc') || 'desc',
            page: pagination.page,
            limit: pagination.limit,
          }
        : undefined
    ),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  })

  // Map API data to local Tagihan format
  const dataTagihan: Tagihan[] = useMemo(() => {
    const bills = (Array.isArray(response?.data) ? response.data : []) as ExtendedCashBill[]

    return bills.map((bill) => {
      const monthDate = bill.month ? new Date(bill.month) : new Date()
      const monthName = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      const dueDateFormatted = bill.dueDate
        ? new Date(bill.dueDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : ''

      let displayStatus: Tagihan['status'] = 'Belum Dibayar'
      if (bill.status === 'sudah_dibayar') displayStatus = 'Sudah Dibayar'
      else if (bill.status === 'menunggu_konfirmasi') displayStatus = 'Menunggu Konfirmasi'

      return {
        id: bill.id || '',
        month: monthName,
        status: displayStatus,
        billId: bill.billId || '',
        name: nama,
        dueDate: dueDateFormatted,
        kasKelas: Number(bill.kasKelas) || 15000,
        biayaAdmin: Number(bill.biayaAdmin) || 0,
        totalAmount: bill.totalAmount || 16000,
        metodePembayaran: bill.paymentMethod as 'bank' | 'ewallet' | 'cash',
        paymentProofUrl: bill.paymentProofUrl,
      }
    })
  }, [response, nama])

  const handleOpenDetail = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan)
    setIsDetailModalOpen(true)
  }

  return (
    <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
      <CardHeader className="flex flex-col gap-4 border-b border-gray-50 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="size-10 rounded-full">
            <Link to="/bendahara/rekap-kas">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
              Detail Tagihan
            </CardTitle>
            <p className="text-sm font-medium text-gray-500">{nama}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-0 sm:p-6">
        <div className="px-6 pt-6 sm:px-0 sm:pt-0">
          <DataMobileFilters
            search={search}
            onSearchChange={setSearch}
            placeholder="Cari tagihan..."
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <DataTable>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHead sortKey="month" currentSort={sort} onSort={setSort}>
                  Bulan
                </DataTableHead>
                <DataTableHead
                  sortKey="status"
                  currentSort={sort}
                  onSort={setSort}
                  filterValue={filters.status}
                  onFilterChange={(v) => {
                    const params = v as 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar'
                    setFilters({ status: params })
                  }}
                  filterOptions={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Belum Dibayar', value: 'belum_dibayar' },
                    { label: 'Menunggu Konfirmasi', value: 'menunggu_konfirmasi' },
                    { label: 'Sudah Dibayar', value: 'sudah_dibayar' },
                  ]}
                >
                  Status
                </DataTableHead>
                <DataTableHead
                  filterValue={search}
                  onFilterChange={setSearch}
                  filterPlaceholder="Cari ID..."
                >
                  ID Tagihan
                </DataTableHead>
                <DataTableHead sortKey="dueDate" currentSort={sort} onSort={setSort}>
                  Tenggat Waktu
                </DataTableHead>
                <DataTableHead
                  sortKey="amount"
                  currentSort={sort}
                  onSort={setSort}
                  className="text-right"
                >
                  Total Tagihan
                </DataTableHead>
                <DataTableHead className="w-10"></DataTableHead>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {isLoading ? (
                <TableBodySkeleton columns={6} />
              ) : dataTagihan.length > 0 ? (
                dataTagihan.map((t) => (
                  <DataTableRow
                    key={t.id}
                    onClick={() => handleOpenDetail(t)}
                    className="cursor-pointer font-medium"
                  >
                    <DataTableCell className="text-gray-900">{t.month}</DataTableCell>
                    <DataTableCell>
                      <BillStatusBadge status={t.status} size="sm" />
                    </DataTableCell>
                    <DataTableCell className="font-mono text-xs text-gray-400">
                      {t.billId}
                    </DataTableCell>
                    <DataTableCell className="text-gray-500">{t.dueDate}</DataTableCell>
                    <DataTableCell className="text-right font-bold text-blue-600">
                      {formatCurrency(t.totalAmount)}
                    </DataTableCell>
                    <DataTableCell>
                      <Button variant="ghost" size="icon" className="size-8 text-gray-300">
                        <ChevronRight className="size-4" />
                      </Button>
                    </DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <DataTableCell colSpan={6} className="h-48 text-center text-gray-400">
                    <EmptyState
                      icon={Receipt}
                      title="Tidak ada tagihan"
                      description="Mahasiswa ini belum memiliki riwayat tagihan"
                    />
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>

        {/* Mobile Cards */}
        <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
          {isLoading ? (
            <MobileCardListSkeleton count={5} />
          ) : dataTagihan.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Tidak ada tagihan"
              description="Belum ada data riwayat tagihan"
            />
          ) : (
            dataTagihan.map((t) => (
              <DataCard key={t.id} onClick={() => handleOpenDetail(t)}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="leading-tight font-bold text-gray-900">{t.month}</h3>
                    <p className="font-mono text-xs text-gray-400">{t.billId}</p>
                  </div>
                  <BillStatusBadge status={t.status} size="sm" />
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Tenggat</p>
                    <p className="text-xs font-medium text-gray-600">{t.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                    <p className="mt-0.5 leading-none font-bold text-blue-600">
                      {formatCurrency(t.totalAmount)}
                    </p>
                  </div>
                </div>
              </DataCard>
            ))
          )}
        </DataCardContainer>

        <div className="px-6 pb-6 sm:px-0 sm:pb-0">
          <DataTablePagination
            total={response?.total || 0}
            totalPages={response?.totalPages || 1}
          />
        </div>
      </CardContent>

      {selectedTagihan && (
        <DetailTagihanKasBendahara
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedTagihan(null)
          }}
          tagihan={selectedTagihan}
        />
      )}
    </Card>
  )
}

export default function BendaharaDetailRekapKasPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<DetailRekapParams>
          defaultLimit={25}
          defaultSort={{ key: 'month', direction: 'desc' }}
        >
          <BendaharaDetailRekapKasContent />
        </ExplorerProvider>
      </div>
    </div>
  )
}
