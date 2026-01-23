'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Download, Plus, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { FinancialPieChart } from '~/components/chart/financial-pie-chart'
import { TransactionListSkeleton, TransactionTypeBadge } from '~/components/data-display'
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
import { ExplorerProvider, useExplorer } from '~/components/shared/explorer/ExplorerContext'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { getChartColor } from '~/lib/constants'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { transactionService } from '~/lib/services/transaction.service'
import { cn, formatCurrency, formatDate } from '~/lib/utils'

interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
}

interface KasKelasParams {
  type?: 'income' | 'expense'
  [key: string]: unknown
}

function BendaharaKasKelasContent() {
  const { search, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<KasKelasParams>()
  const [detailModal, setDetailModal] = useState<HistoryTransaction | null>(null)
  const [isBuatModalOpen, setIsBuatModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Fetch transactions
  const { data: transactionsData, isLoading } = useQuery({
    ...transactionQueries.list({
      page: pagination.page,
      limit: pagination.limit,
      type: filters.type,
      search: search || undefined,
      sortBy: (sort?.key as 'date' | 'amount') || 'date',
      sortOrder: (sort?.direction as 'asc' | 'desc') || 'desc',
    }),
  })

  // Convert API transactions to local format
  const historyTransaction: HistoryTransaction[] = useMemo(() => {
    if (!transactionsData?.transactions) return []
    return transactionsData.transactions.map((t) => ({
      id: t.id || '',
      date: t.date || '',
      purpose: t.description || '',
      type: (t.type || 'income') as 'income' | 'expense',
      amount: t.amount || 0,
    }))
  }, [transactionsData])

  // Chart data logic
  const { incomeData, expenseData } = useMemo(() => {
    const incomeTransactions = historyTransaction.filter((t) => t.type === 'income')
    const expenseTransactions = historyTransaction.filter((t) => t.type === 'expense')

    const aggregate = (txs: HistoryTransaction[], type: 'income' | 'expense') => {
      const grouped = txs.reduce(
        (acc, t) => {
          const key = t.purpose || 'Lainnya'
          acc[key] = (acc[key] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>
      )
      return Object.entries(grouped).map(([name, value], index) => ({
        name,
        value,
        fill: getChartColor(type, index),
      }))
    }
    return {
      incomeData: aggregate(incomeTransactions, 'income'),
      expenseData: aggregate(expenseTransactions, 'expense'),
    }
  }, [historyTransaction])

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await transactionService.exportTransactions({ type: filters.type })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bendahara-kas-kelas-${new Date().toISOString().split('T')[0]}.xlsx`
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Charts Section */}
      <Card className="rounded-4xl border-0 shadow-lg shadow-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
            Visualisasi Keuangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FinancialPieChart data={incomeData} title="Sumber Pemasukan" type="income" />
            <FinancialPieChart data={expenseData} title="Alokasi Pengeluaran" type="expense" />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
        <CardHeader className="flex flex-col gap-4 border-b border-gray-50 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
            Kelola Transaksi
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleExport} disabled={isExporting} variant="secondary">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Button onClick={() => setIsBuatModalOpen(true)}>
              <Plus className="mr-2 size-4" />
              Buat Transaksi
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-0 sm:p-6">
          <div className="px-6 pt-4 sm:px-0 sm:pt-0">
            <DataMobileFilters
              search={search}
              onSearchChange={setSearch}
              placeholder="Cari transaksi..."
            />
          </div>

          {isLoading ? (
            <div className="p-6">
              <TransactionListSkeleton count={5} />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
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
                    {historyTransaction.length > 0 ? (
                      historyTransaction.map((t) => (
                        <DataTableRow
                          key={t.id}
                          onClick={() => setDetailModal(t)}
                          className="cursor-pointer"
                        >
                          <DataTableCell className="text-gray-500">
                            {formatDate(t.date)}
                          </DataTableCell>
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
                            description="Coba gunakan filter lain atau buat transaksi baru"
                          />
                        </DataTableCell>
                      </DataTableRow>
                    )}
                  </DataTableBody>
                </DataTable>
              </div>

              {/* Mobile Cards View */}
              <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
                {historyTransaction.length > 0 ? (
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
                  <EmptyState
                    icon={Wallet}
                    title="Tidak ada transaksi"
                    description="Belum ada data"
                  />
                )}
              </DataCardContainer>

              <div className="px-6 pb-6 sm:px-0 sm:pb-0">
                <DataTablePagination
                  total={transactionsData?.pagination?.totalItems || 0}
                  totalPages={transactionsData?.pagination?.totalPages || 0}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {detailModal && (
        <DetailTransaksi
          isOpen={!!detailModal}
          onClose={() => setDetailModal(null)}
          transaction={detailModal}
        />
      )}
      {isBuatModalOpen && (
        <BuatTransaksi isOpen={isBuatModalOpen} onClose={() => setIsBuatModalOpen(false)} />
      )}
    </div>
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

export default function BendaharaKasKelasPage() {
  return (
    <div className="p-6">
      <ExplorerProvider<KasKelasParams>
        defaultLimit={25}
        defaultSort={{ key: 'date', direction: 'desc' }}
      >
        <BendaharaKasKelasContent />
      </ExplorerProvider>
    </div>
  )
}
