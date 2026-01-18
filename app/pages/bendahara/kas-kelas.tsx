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
import { PaginationControls } from '~/components/shared/PaginationControls'
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
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { transactionService } from '~/lib/services/transaction.service'
import { formatCurrency } from '~/lib/utils'

interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
}

export default function BendaharaKasKelas() {
  const [detailModal, setDetailModal] = useState<HistoryTransaction | null>(null)
  const [BuatTransaksiModal, setBuatTransaksiModal] = useState(false)
  const [isChartVisible, setIsChartVisible] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const LIMIT = 50

  const isDetailModalOpen = detailModal !== null

  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

  // Fetch transactions from API with sorting and pagination
  const {
    data: transactionsData,
    isLoading,
    isFetching,
  } = useQuery(
    transactionQueries.list({
      page,
      limit: LIMIT,
      type: filterType === 'all' ? undefined : filterType,
      sortBy,
      sortOrder,
    })
  )

  // Fetch rekap kas for chart data
  const { data: rekapKasData } = useQuery(bendaharaQueries.rekapKas())

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
    if (sortBy === 'amount') {
      return [...mapped].sort((a, b) =>
        sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
      )
    }
    if (sortBy === 'date') {
      return [...mapped].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0
        const db = b.date ? new Date(b.date).getTime() : 0
        return sortOrder === 'asc' ? da - db : db - da
      })
    }
    return mapped
  }, [transactionsData, sortBy, sortOrder])

  // Chart data using real rekap kas transactions when available - using centralized colors
  const incomeData = useMemo(() => {
    // If we have rekap kas data (summary for charts), use it.
    // Otherwise fallback to current page transactions (less accurate for charts but better than nothing)
    const txs = rekapKasData?.transactions
      ? rekapKasData.transactions.map((t) => ({
          description: t.description || 'Lainnya',
          type: (t.type || 'income') as 'income' | 'expense',
          amount: t.amount || 0,
        }))
      : transactions.map((t) => ({
          description: t.purpose || 'Lainnya',
          type: t.type,
          amount: t.amount,
        }))

    const incomeTransactions = txs.filter((t) => t.type === 'income')
    if (incomeTransactions.length === 0) {
      return []
    }
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
  }, [rekapKasData, transactions])

  const expenseData = useMemo(() => {
    const txs = rekapKasData?.transactions
      ? rekapKasData.transactions.map((t) => ({
          description: t.description || 'Lainnya',
          type: (t.type || 'income') as 'income' | 'expense',
          amount: t.amount || 0,
        }))
      : transactions.map((t) => ({
          description: t.purpose || 'Lainnya',
          type: t.type,
          amount: t.amount,
        }))

    const expenseTransactions = txs.filter((t) => t.type === 'expense')
    if (expenseTransactions.length === 0) {
      return []
    }
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
  }, [rekapKasData, transactions])

  const openDetailModal = (transaction: HistoryTransaction) => {
    setDetailModal(transaction)
  }
  const closeDetailModal = () => {
    setDetailModal(null)
  }

  const openBuatTransaksiModal = () => {
    setBuatTransaksiModal(true)
  }
  const closeBuatTransaksiModal = () => {
    setBuatTransaksiModal(false)
  }

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading || isFetching) {
    return <KasKelasSkeleton />
  }

  return (
    <>
      <div className="p-6">
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
                        onSelect={(e) => {
                          e.preventDefault()
                          setFilterType('all')
                          setPage(1)
                        }}
                      >
                        <span>Semua</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:text-green-700 focus:bg-green-50"
                        onSelect={(e) => {
                          e.preventDefault()
                          setFilterType('income')
                          setPage(1)
                        }}
                      >
                        <Icons.ArrowUpCircle className="h-5 w-5 text-green-700" />
                        <span className="text-green-700">Pemasukan</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:text-red-700 focus:bg-red-50"
                        onSelect={(e) => {
                          e.preventDefault()
                          setFilterType('expense')
                          setPage(1)
                        }}
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
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setSortBy('date')
                          setSortOrder('desc')
                        }}
                      >
                        Tanggal Terbaru
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setSortBy('date')
                          setSortOrder('asc')
                        }}
                      >
                        Tanggal Terlama
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setSortBy('amount')
                          setSortOrder('desc')
                        }}
                      >
                        Nominal Tertinggi
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setSortBy('amount')
                          setSortOrder('asc')
                        }}
                      >
                        Nominal Terendah
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
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
                <table className="w-full max-w-360">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                      <th className="px-4 py-3 text-left font-medium">Keperluan</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Nominal</th>
                      <th className="w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12">
                          <EmptyState
                            icon={Clock}
                            title="Tidak ada transaksi"
                            description="Belum ada data transaksi"
                          />
                        </td>
                      </tr>
                    ) : (
                      transactions.map((app) => (
                        <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{app.date}</td>
                          <td className="px-4 py-3 text-sm">{app.purpose}</td>
                          <td className="px-4 py-3">
                            <TransactionTypeBadge type={app.type} />
                          </td>
                          <td
                            className={`px-4 py-3 text-sm font-medium ${app.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {app.type === 'income' ? '+' : '-'}
                            {formatCurrency(app.amount)}
                          </td>
                          <td className="px-4 py-3" onClick={() => openDetailModal(app)}>
                            <Button variant="ghost" size="sm">
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

              {/* Pagination Controls */}
              {transactionsData?.pagination && transactionsData.pagination.totalPages! > 1 && (
                <div className="mt-8 border-t border-gray-100 pt-4">
                  <PaginationControls
                    currentPage={page}
                    totalPages={transactionsData.pagination.totalPages!}
                    onPageChange={handlePageChange}
                    disabled={isLoading}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
