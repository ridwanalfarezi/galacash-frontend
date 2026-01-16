'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Clock, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { FinancialPieChart } from '~/components/chart/financial-pie-chart'
import { Icons } from '~/components/icons'
import Export from '~/components/icons/export'
import Sort from '~/components/icons/sort'
import { BuatTransaksi } from '~/components/modals/BuatTransaksi'
import { DetailTransaksi } from '~/components/modals/DetailTransaksi'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { useIsMobile } from '~/hooks/use-mobile'
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
  const [sortBy, setSortBy] = useState<
    | 'date-newest'
    | 'date-oldest'
    | 'amount-highest'
    | 'amount-lowest'
    | 'purpose-az'
    | 'purpose-za'
    | 'type-az'
    | 'type-za'
  >('date-newest')
  const isDetailModalOpen = detailModal !== null

  // Fetch transactions from API
  const { data: transactionsData } = useQuery(
    transactionQueries.list({
      page: 1,
      limit: 50,
      type: filterType === 'all' ? undefined : filterType,
    })
  )

  // Map API transactions to local type
  const transactions: HistoryTransaction[] = useMemo(() => {
    if (!transactionsData?.transactions) return []
    return transactionsData.transactions.map((t) => ({
      id: t.id || '',
      date: t.date || '',
      purpose: t.description || '',
      type: (t.type || 'income') as 'income' | 'expense',
      amount: t.amount || 0,
    }))
  }, [transactionsData])

  // Chart data - using placeholder data until API supports aggregated chart endpoints
  // TODO: Replace with actual API call when backend supports chart data aggregation
  const incomeData = useMemo(() => {
    // Calculate from transactions if available
    const incomeTransactions = transactions.filter((t) => t.type === 'income')
    if (incomeTransactions.length === 0) {
      return [{ name: 'Iuran Kas', value: 100000, fill: '#50b89a' }]
    }
    // Group by purpose for simple breakdown
    const grouped = incomeTransactions.reduce(
      (acc, t) => {
        const key = t.purpose || 'Lainnya'
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
    const colors = ['#50b89a', '#8cd9a7', '#34a0a4', '#76c893', '#52b788']
    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }))
  }, [transactions])

  const expenseData = useMemo(() => {
    const expenseTransactions = transactions.filter((t) => t.type === 'expense')
    if (expenseTransactions.length === 0) {
      return [{ name: 'Pengeluaran', value: 50000, fill: '#920c22' }]
    }
    // Group by purpose for simple breakdown
    const grouped = expenseTransactions.reduce(
      (acc, t) => {
        const key = t.purpose || 'Lainnya'
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
    const colors = ['#920c22', '#af2038', '#800016', '#c32f48', '#e04055']
    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }))
  }, [transactions])

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

  // Sort functionality (filtering is done by API)
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      switch (sortBy) {
        case 'date-newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date-oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'amount-highest':
          return b.amount - a.amount
        case 'amount-lowest':
          return a.amount - b.amount
        case 'purpose-az':
          return a.purpose.localeCompare(b.purpose)
        case 'purpose-za':
          return b.purpose.localeCompare(a.purpose)
        case 'type-az':
          return a.type.localeCompare(b.type)
        case 'type-za':
          return b.type.localeCompare(a.type)
        default:
          return 0
      }
    })

    return sorted
  }, [transactions, sortBy])

  const getSortLabel = () => {
    switch (sortBy) {
      case 'date-newest':
        return 'Tanggal Terbaru'
      case 'date-oldest':
        return 'Tanggal Terlama'
      case 'amount-highest':
        return 'Nominal Tertinggi'
      case 'amount-lowest':
        return 'Nominal Terendah'
      case 'purpose-az':
        return 'Keperluan: A ke Z'
      case 'purpose-za':
        return 'Keperluan: Z ke A'
      case 'type-az':
        return 'Tipe: A ke Z'
      case 'type-za':
        return 'Tipe: Z ke A'
      default:
        return 'Sort'
    }
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'income':
        return (
          <Badge className="bg-green-50 font-normal text-green-700 md:text-base">
            <Icons.ArrowUpCircle className="h-5 w-5" />
            Pemasukan
          </Badge>
        )
      case 'expense':
        return (
          <Badge className="bg-red-50 font-normal text-red-700 md:text-base">
            <Icons.ArrowDownCircle className="h-5 w-5" />
            Pengeluaran
          </Badge>
        )
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

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
                    data={
                      incomeData.length > 0
                        ? incomeData
                        : [{ name: 'No Data', value: 1, fill: '#e5e7eb' }]
                    }
                    title="Pemasukan"
                    type="income"
                    className="flex justify-center"
                  />
                  <FinancialPieChart
                    data={
                      expenseData.length > 0
                        ? expenseData
                        : [{ name: 'No Data', value: 1, fill: '#e5e7eb' }]
                    }
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
                      <Button variant="secondary" className="w-full sm:w-auto">
                        <Filter className="h-5 w-5" />
                        {getFilterLabel()}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto sm:w-50">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setFilterType('all')}
                      >
                        <span>Semua</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:text-green-700 focus:bg-green-50"
                        onClick={() => setFilterType('income')}
                      >
                        <Icons.ArrowUpCircle className="h-5 w-5 text-green-700" />
                        <span className="text-green-700">Pemasukan</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:text-red-700 focus:bg-red-50"
                        onClick={() => setFilterType('expense')}
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
                      <DropdownMenuItem onClick={() => setSortBy('date-newest')}>
                        Tanggal Terbaru
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('date-oldest')}>
                        Tanggal Terlama
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('amount-highest')}>
                        Nominal Tertinggi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('amount-lowest')}>
                        Nominal Terendah
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('purpose-az')}>
                        Keperluan: A ke Z
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('purpose-za')}>
                        Keperluan: Z ke A
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('type-az')}>
                        Tipe: A ke Z
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('type-za')}>
                        Tipe: Z ke A
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
                    {sortedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="mb-4 text-gray-400">
                              <Clock className="mx-auto size-12" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                              Tidak ada transaksi
                            </h3>
                            <p className="text-sm text-gray-500">Belum ada data transaksi</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedTransactions.map((app) => (
                        <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{app.date}</td>
                          <td className="px-4 py-3 text-sm">{app.purpose}</td>
                          <td className="px-4 py-3">{getTypeBadge(app.type)}</td>
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

              <div className="space-y-4 sm:hidden">
                {sortedTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 text-gray-400">
                      <Clock className="mx-auto size-12" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada transaksi</h3>
                    <p className="text-sm text-gray-500">Belum ada data transaksi</p>
                  </div>
                ) : (
                  sortedTransactions.map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{app.date}</span>
                        {getTypeBadge(app.type)}
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
