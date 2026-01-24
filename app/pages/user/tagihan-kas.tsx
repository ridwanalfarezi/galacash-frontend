'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'

import { BillStatusBadge, TagihanKasSkeleton } from '~/components/data-display'
import { DetailTagihanKas } from '~/components/modals/DetailTagihanKas'
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
  paymentProofUrl?: string | null
}

interface TagihanKasParams {
  status?: 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar'
  search?: string
  [key: string]: unknown
}

function TagihanKasContent() {
  const { search, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<TagihanKasParams>()
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKas | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Fetch cash bills
  const { data: response, isLoading } = useQuery({
    ...cashBillQueries.my({
      status: filters.status as
        | 'belum_dibayar'
        | 'menunggu_konfirmasi'
        | 'sudah_dibayar'
        | undefined,
      sortBy: (sort?.key as 'dueDate' | 'totalAmount' | 'month' | 'status') || 'dueDate',
      sortOrder: (sort?.direction as 'asc' | 'desc') || 'desc',
      page: pagination.page,
      limit: pagination.limit,
    }),
  })

  const tagihanKasList: TagihanKas[] = useMemo(() => {
    const bills = response?.data
    if (!Array.isArray(bills)) return []

    return bills.map((bill: Record<string, unknown>) => {
      const monthDate = bill.month ? new Date(bill.month as string) : new Date()
      const monthName = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

      const dueDateFormatted = bill.dueDate
        ? new Date(bill.dueDate as string).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : ''

      let displayStatus: TagihanKas['status'] = 'Belum Dibayar'
      if (bill.status === 'sudah_dibayar') displayStatus = 'Sudah Dibayar'
      else if (bill.status === 'menunggu_konfirmasi') displayStatus = 'Menunggu Konfirmasi'

      return {
        id: String(bill.id || ''),
        month: monthName,
        status: displayStatus,
        billId: String(bill.billId || ''),
        dueDate: dueDateFormatted,
        totalAmount: Number(bill.totalAmount || 0),
        name: ((bill.user as Record<string, unknown>)?.name as string) || '',
        kasKelas: Number(bill.kasKelas || 0),
        biayaAdmin: Number(bill.biayaAdmin || 0),
        paymentProofUrl: (bill.paymentProofUrl as string) || null,
      }
    })
  }, [response?.data])

  const handleOpenDetail = (tagihan: TagihanKas) => {
    setSelectedTagihan(tagihan)
    setIsDetailModalOpen(true)
  }

  if (isLoading && pagination.page === 1) return <TagihanKasSkeleton />

  return (
    <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
      <CardHeader className="border-b border-gray-50">
        <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
          Tagihan Kas Anda
        </CardTitle>
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
                  filterValue={filters.status}
                  onFilterChange={(v) =>
                    setFilters({
                      status: v as 'belum_dibayar' | 'menunggu_konfirmasi' | 'sudah_dibayar',
                    })
                  }
                  filterOptions={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Belum Dibayar', value: 'belum_dibayar' },
                    { label: 'Menunggu Konfirmasi', value: 'menunggu_konfirmasi' },
                    { label: 'Sudah Dibayar', value: 'sudah_dibayar' },
                  ]}
                  filterOnly
                >
                  Status
                </DataTableHead>
                <DataTableHead>ID Tagihan</DataTableHead>
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
              {tagihanKasList.length > 0 ? (
                tagihanKasList.map((t) => (
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
                      description="Gunakan filter lain atau tunggu tagihan bulan berikutnya"
                    />
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>

        {/* Mobile Cards */}
        <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
          {tagihanKasList.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Tidak ada tagihan"
              description="Belum ada data riwayat tagihan"
            />
          ) : (
            tagihanKasList.map((t) => (
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
        <DetailTagihanKas
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

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 rounded-full bg-gray-50 p-4 text-gray-400">
        <Icon className="size-12" />
      </div>
      <h3 className="mb-1 text-lg font-bold text-gray-900">{title}</h3>
      <p className="max-w-50 text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default function UserTagihanKasPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<TagihanKasParams>
          defaultLimit={25}
          defaultSort={{ key: 'dueDate', direction: 'desc' }}
        >
          <TagihanKasContent />
        </ExplorerProvider>
      </div>
    </div>
  )
}
