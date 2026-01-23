'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Clock, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { FinancialPieChart } from '~/components/chart/financial-pie-chart'
import { EmptyState, KasKelasSkeleton, TransactionTypeBadge } from '~/components/data-display'
import { Icons } from '~/components/icons'
import Export from '~/components/icons/export'
import Sort from '~/components/icons/sort'
import { BuatTransaksi } from '~/components/modals/BuatTransaksi'
import { DetailTransaksi } from '~/components/modals/DetailTransaksi'
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
import { getChartColor } from '~/lib/constants'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { transactionService } from '~/lib/services/transaction.service'
import { formatCurrency, formatDate } from '~/lib/utils'

interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
}

interface KasKelasParams {
  type: 'all' | 'income' | 'expense'
  [key: string]: unknown
}

function BendaharaKasKelasContent() {
  const { filters, setFilters, sort, setSort, pagination } = useExplorer<KasKelasParams>()
  const [detailModal, setDetailModal] = useState<HistoryTransaction | null>(null)
  const [BuatTransaksiModal, setBuatTransaksiModal] = useState(false)
  const [isChartVisible, setIsChartVisible] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const isDetailModalOpen = detailModal !== null

  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

  // Map filters
  const filterType = filters.type || 'all'
  const sortBy = (sort?.key as 'date' | 'amount') || 'date'
  const sortOrder = (sort?.direction as 'asc' | 'desc') || 'desc'

  // Fetch transactions from API with sorting and pagination
  const {
    data: transactionsData,
    isLoading,
    isFetching,
  } = useQuery(
    transactionQueries.list({
      page: pagination.page,
      limit: pagination.limit,
      type: filterType === 'all' ? undefined : filterType,
      sortBy,
      sortOrder,
    })
  )

  // Map API transactions to local type
  const transactions: HistoryTransaction[] = useMemo(() => {
    if (!transactionsData?.transactions) return []
    const mapped = transactionsData.transactions.map((t) => ({
      id: t.id || '',
      date: t.date || '',
      purpose: t.description || '',
      type: (t.type || 'income') as 'income' | 'expense',
      amount: t.amount || 0,
    }))
    // Sorting handled by API usually, but if client-side fallback needed:
    // ... logic preserved if API provides sorted data.
    // The previous code had client-side sorting backup. Let's trust the API or re-implement if needed.
    // Given performance goals, server-side sort is preferred.
    return mapped
  }, [transactionsData])

  // Chart logic preserved
  const incomeData = useMemo(() => {
    const txs = transactions.map((t) => ({
      description: t.purpose || 'Lainnya',
      type: t.type,
      amount: t.amount,
    }))

    const incomeTransactions = txs.filter((t) => t.type === 'income')
    if (incomeTransactions.length === 0) return []

    const grouped = incomeTransactions.reduce(
      (acc, t) => {
        const key = t.description || 'Lainnya'
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      fill: getChartColor('income', index),
    }))
  }, [transactions])

  const expenseData = useMemo(() => {
    const txs = transactions.map((t) => ({
      description: t.purpose || 'Lainnya',
      type: t.type,
      amount: t.amount,
    }))

    const expenseTransactions = txs.filter((t) => t.type === 'expense')
    if (expenseTransactions.length === 0) return []

    const grouped = expenseTransactions.reduce(
      (acc, t) => {
        const key = t.description || 'Lainnya'
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      fill: getChartColor('expense', index),
    }))
  }, [transactions])

  const openDetailModal = (transaction: HistoryTransaction) => setDetailModal(transaction)
  const closeDetailModal = () => setDetailModal(null)
  const openBuatTransaksiModal = () => setBuatTransaksiModal(true)
  const closeBuatTransaksiModal = () => setBuatTransaksiModal(false)

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true)
      toast.info('Mengekspor transaksi...', { duration: 2000 })

      const blob = await transactionService.exportTransactions({
        type: filterType === 'all' ? undefined : filterType,
      })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Transaksi berhasil diekspor')
    } catch {
      toast.error('Gagal mengekspor transaksi')
    } finally {
      setIsExporting(false)
    }
  }

  const getSortLabel = () => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' ? 'Tanggal Terbaru' : 'Tanggal Terlama'
    }
    return sortOrder === 'desc' ? 'Nominal Tertinggi' : 'Nominal Terendah'
  }

  const getFilterLabel = () => {
    switch (filterType) {
      case 'income':
        return 'Pemasukan'
      case 'expense':
        return 'Pengeluaran'
      default:
        return 'Filter'
    }
  }

  if (isLoading || isFetching) {
    return <KasKelasSkeleton />
  }

  return (
    <>
      <div className="mx-auto max-w-360 space-y-8">
        <Card className="relative rounded-4xl border-0">
          <CardHeader className="flex items-center justify-between space-y-0">
            <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
              Rekap Keuangan Kas
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChartVisible(!isChartVisible)}
              className="p-1 transition-transform duration-200 hover:scale-110"
            >
              <div className="transition-transform duration-300">
                {isChartVisible ? (
                  <ChevronUp className="size-6" />
                ) : (
                  <ChevronDown className="size-6" />
                )}
              </div>
            </Button>
          </CardHeader>
          {isChartVisible && (
            <CardContent>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <FinancialPieChart
                  data={incomeData}
                  title="Pemasukan"
                  type="income"
                  className="flex justify-center"
                />
                <FinancialPieChart
                  data={expenseData}
                  title="Pengeluaran"
                  type="expense"
                  className="flex justify-center"
                />
              </div>
            </CardContent>
          )}
        </Card>
        <Card className="rounded-4xl border-0">
          <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start">
              <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
                Riwayat Transaksi
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
                      variant={filterType !== 'all' ? 'default' : 'secondary'}
                      className="w-full sm:w-auto"
                    >
                      <Filter className="h-5 w-5" />
                      {getFilterLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-auto sm:w-50">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setFilters({ type: 'all' })}
                    >
                      <span>Semua</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:text-green-700 focus:bg-green-50"
                      onClick={() => setFilters({ type: 'income' })}
                    >
                      <Icons.ArrowUpCircle className="h-5 w-5 text-green-700" />
                      <span className="text-green-700">Pemasukan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:text-red-700 focus:bg-red-50"
                      onClick={() => setFilters({ type: 'expense' })}
                    >
                      <Icons.ArrowDownCircle className="h-5 w-5 text-red-700" />
                      <span className="text-red-700">Pengeluaran</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Sort className="h-5 w-5" />
                      {getSortLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-auto">
                    <DropdownMenuItem onClick={() => setSort({ key: 'date', direction: 'desc' })}>
                      Tanggal Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort({ key: 'date', direction: 'asc' })}>
                      Tanggal Terlama
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort({ key: 'amount', direction: 'desc' })}>
                      Nominal Tertinggi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort({ key: 'amount', direction: 'asc' })}>
                      Nominal Terendah
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="w-full sm:w-auto" onClick={handleExport} disabled={isExporting}>
                  <Export className="h-5 w-5" />
                  {isExporting ? 'Mengekspor...' : 'Export'}
                </Button>
                <Button className="w-full sm:w-auto" onClick={openBuatTransaksiModal}>
                  <Icons.Plus className="size-6" />
                  Buat Transaksi
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto sm:block">
              <DataTable>
                <DataTableHeader>
                  <DataTableRow>
                    <DataTableHead>Tanggal</DataTableHead>
                    <DataTableHead>Keperluan</DataTableHead>
                    <DataTableHead>Status</DataTableHead>
                    <DataTableHead>Nominal</DataTableHead>
                    <DataTableHead className="w-12" />
                  </DataTableRow>
                </DataTableHeader>
                <DataTableBody>
                  {transactions.length === 0 ? (
                    <DataTableRow>
                      <DataTableCell colSpan={5} className="py-12">
                        <EmptyState
                          icon={Clock}
                          title="Tidak ada transaksi"
                          description="Belum ada data transaksi"
                        />
                      </DataTableCell>
                    </DataTableRow>
                  ) : (
                    transactions.map((app) => (
                      <DataTableRow key={app.id}>
                        <DataTableCell className="text-sm">{formatDate(app.date)}</DataTableCell>
                        <DataTableCell className="text-sm">{app.purpose}</DataTableCell>
                        <DataTableCell>
                          <TransactionTypeBadge type={app.type} />
                        </DataTableCell>
                        <DataTableCell
                          className={`text-sm font-medium ${app.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {app.type === 'income' ? '+' : '-'}
                          {formatCurrency(app.amount)}
                        </DataTableCell>
                        <DataTableCell>
                          <Button variant="ghost" size="sm" onClick={() => openDetailModal(app)}>
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
              {transactions.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Tidak ada transaksi"
                  description="Belum ada data transaksi"
                  className="py-12"
                />
              ) : (
                transactions.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{app.date}</span>
                      <TransactionTypeBadge type={app.type} size="sm" />
                    </div>
                    <div className="font-semibold">{app.purpose}</div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold ${app.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {app.type === 'income' ? '+' : '-'}
                        {formatCurrency(app.amount)}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => openDetailModal(app)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <DataTablePagination totalPages={transactionsData?.pagination?.totalPages} />
          </CardContent>
        </Card>
      </div>

      {isDetailModalOpen && detailModal && (
        <DetailTransaksi
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          transaction={detailModal}
        />
      )}
      {BuatTransaksiModal && (
        <BuatTransaksi isOpen={BuatTransaksiModal} onClose={closeBuatTransaksiModal} />
      )}
    </>
  )
}

export default function BendaharaKasKelas() {
  return (
    <div className="p-6">
      <ExplorerProvider<{ type: 'all' | 'income' | 'expense' }>
        defaultLimit={50}
        defaultFilters={{ type: 'all' }}
        defaultSort={{ key: 'date', direction: 'desc' }}
      >
        <BendaharaKasKelasContent />
      </ExplorerProvider>
    </div>
  )
}
