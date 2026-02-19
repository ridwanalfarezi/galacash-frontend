'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Download, Plus, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { FinancialPieChart } from '~/components/chart/FinancialPieChart'
import {
  EmptyState,
  MobileCardListSkeleton,
  TableBodySkeleton,
  TransactionTypeBadge,
} from '~/components/data-display'
import { BuatTransaksi } from '~/components/modals/BuatTransaksi'
import { DetailTransaksi } from '~/components/modals/DetailTransaksi'
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
import { useExplorer } from '~/components/shared/explorer/ExplorerContext'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { transactionService } from '~/lib/services/transaction.service'
import { cn, formatCurrency, formatDate } from '~/lib/utils'
import type { HistoryTransaction } from '~/types/domain'

interface KasKelasParams {
  type?: 'income' | 'expense'
  [key: string]: unknown
}

export interface KasKelasBaseProps {
  variant: 'user' | 'bendahara'
  title?: string
  chartTitle?: string
  showCreateButton?: boolean
  exportFilename?: string
}

export function KasKelasBase({
  variant,
  title = 'Riwayat Transaksi',
  chartTitle = 'Visualisasi Keuangan',
  showCreateButton = false,
  exportFilename,
}: KasKelasBaseProps) {
  const { search, debouncedSearch, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<KasKelasParams>()
  const [detailModal, setDetailModal] = useState<HistoryTransaction | null>(null)
  const [isBuatModalOpen, setIsBuatModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const { data: transactionsData, isLoading } = useQuery({
    ...transactionQueries.list({
      page: pagination.page,
      limit: pagination.limit,
      type: filters.type,
      search: debouncedSearch || undefined,
      sortBy: (sort?.key as 'date' | 'amount') || 'date',
      sortOrder: (sort?.direction as 'asc' | 'desc') || 'desc',
    }),
  })

  const historyTransaction: HistoryTransaction[] = useMemo(() => {
    if (!transactionsData?.transactions) return []
    return transactionsData.transactions.map((t) => {
      const tx = t as typeof t & { category?: string; attachmentUrl?: string | null }
      return {
        id: tx.id || '',
        date: tx.date || '',
        purpose: tx.description || '',
        type: (tx.type || 'income') as 'income' | 'expense',
        amount: tx.amount || 0,
        category: tx.category || 'other',
        attachmentUrl: tx.attachmentUrl,
      }
    })
  }, [transactionsData])

  const { data: incomeData } = useQuery(transactionQueries.breakdown({ type: 'income' }))
  const { data: expenseData } = useQuery(transactionQueries.breakdown({ type: 'expense' }))

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await transactionService.exportTransactions({ type: filters.type })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const defaultFilename =
        exportFilename || `${variant}-kas-kelas-${new Date().toISOString().split('T')[0]}`
      a.download = `${defaultFilename}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Berhasil mengekspor data')
    } catch {
      toast.error('Gagal mengekspor data')
    } finally {
      setIsExporting(false)
    }
  }

  const emptyStateDescription =
    variant === 'bendahara'
      ? 'Coba gunakan filter lain atau buat transaksi baru'
      : 'Belum ada data transaksi'

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="rounded-4xl border-0 shadow-lg shadow-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
            {chartTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FinancialPieChart data={incomeData || []} title="Sumber Pemasukan" type="income" />
            <FinancialPieChart
              data={expenseData || []}
              title="Alokasi Pengeluaran"
              type="expense"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
        <CardHeader className="flex flex-col gap-4 border-b border-gray-50 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">{title}</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="secondary"
              size="sm"
              className="w-full px-4 shadow-sm md:w-auto"
            >
              <Download className="mr-2 size-4" />
              Export Data
            </Button>
            {showCreateButton && (
              <Button
                onClick={() => setIsBuatModalOpen(true)}
                size="sm"
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 size-4" />
                Buat Transaksi
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-0 sm:p-6">
          <div className="px-6 pt-4 sm:px-0 sm:pt-0">
            <DataMobileFilters
              search={search}
              onSearchChange={setSearch}
              placeholder="Cari keperluan transaksi..."
            />
          </div>

          <div className="hidden lg:block">
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHead sortKey="date" currentSort={sort} onSort={setSort}>
                    Tanggal
                  </DataTableHead>
                  <DataTableHead>Keperluan</DataTableHead>
                  <DataTableHead
                    filterValue={filters.type}
                    onFilterChange={(v) => setFilters({ type: v as 'income' | 'expense' })}
                    filterOptions={[
                      { label: 'Semua Tipe', value: '' },
                      { label: 'Pemasukan', value: 'income' },
                      { label: 'Pengeluaran', value: 'expense' },
                    ]}
                    filterOnly
                  >
                    Tipe
                  </DataTableHead>
                  <DataTableHead
                    sortKey="amount"
                    currentSort={sort}
                    onSort={setSort}
                    className="text-right"
                  >
                    Nominal
                  </DataTableHead>
                  <DataTableHead className="w-10"></DataTableHead>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {isLoading ? (
                  <TableBodySkeleton columns={5} />
                ) : historyTransaction.length > 0 ? (
                  historyTransaction.map((t) => (
                    <DataTableRow
                      key={t.id}
                      onClick={() => setDetailModal(t)}
                      className="cursor-pointer"
                    >
                      <DataTableCell className="text-gray-500">{formatDate(t.date)}</DataTableCell>
                      <DataTableCell className="font-medium text-gray-900">
                        {t.purpose}
                      </DataTableCell>
                      <DataTableCell>
                        <TransactionTypeBadge type={t.type} />
                      </DataTableCell>
                      <DataTableCell
                        className={cn(
                          'text-right font-bold',
                          t.type === 'income' ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </DataTableCell>
                      <DataTableCell>
                        <Button variant="ghost" size="icon" className="size-8 text-gray-400">
                          <ChevronRight className="size-4" />
                        </Button>
                      </DataTableCell>
                    </DataTableRow>
                  ))
                ) : (
                  <DataTableRow>
                    <DataTableCell colSpan={5} className="h-48 text-center text-gray-400">
                      <EmptyState
                        icon={Wallet}
                        title="Tidak ada transaksi"
                        description={emptyStateDescription}
                      />
                    </DataTableCell>
                  </DataTableRow>
                )}
              </DataTableBody>
            </DataTable>
          </div>

          <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
            {isLoading ? (
              <MobileCardListSkeleton count={5} />
            ) : historyTransaction.length > 0 ? (
              historyTransaction.map((t) => (
                <DataCard key={t.id} onClick={() => setDetailModal(t)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="leading-tight font-bold text-gray-900">{t.purpose}</h3>
                      <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                    </div>
                    <TransactionTypeBadge type={t.type} size="sm" />
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-2">
                    <p className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                      Nominal
                    </p>
                    <p
                      className={cn(
                        'font-bold',
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </p>
                  </div>
                </DataCard>
              ))
            ) : (
              <EmptyState icon={Wallet} title="Tidak ada transaksi" description="Belum ada data" />
            )}
          </DataCardContainer>

          <div className="px-6 pb-6 sm:px-0 sm:pb-0">
            <DataTablePagination
              total={transactionsData?.pagination?.totalItems || 0}
              totalPages={transactionsData?.pagination?.totalPages || 0}
            />
          </div>
        </CardContent>
      </Card>

      {detailModal && (
        <DetailTransaksi
          isOpen={!!detailModal}
          onClose={() => setDetailModal(null)}
          transaction={detailModal}
        />
      )}
      {showCreateButton && isBuatModalOpen && (
        <BuatTransaksi isOpen={isBuatModalOpen} onClose={() => setIsBuatModalOpen(false)} />
      )}
    </div>
  )
}
