'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ChevronRight, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'

import { FinancialPieChart } from '~/components/chart/financial-pie-chart'
import { Icons } from '~/components/icons'
import Export from '~/components/icons/export'
import Sort from '~/components/icons/sort'
import { DetailTransaksi } from '~/components/modals/DetailTransaksi'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { formatCurrency } from '~/lib/utils'

interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
}

const historyTransaction: HistoryTransaction[] = [
  {
    id: '1',
    date: '28 September 2098',
    purpose: 'Pembayaran SPP',
    type: 'income',
    amount: 500000,
  },
  {
    id: '2',
    date: '28 September 2098',
    purpose: 'Pembelian Buku',
    type: 'expense',
    amount: 150000,
  },
  {
    id: '3',
    date: '28 September 2098',
    purpose: 'Donasi Kegiatan Sekolah',
    type: 'income',
    amount: 200000,
  },
]

const incomeData = [
  { name: 'Pembayaran SPP', value: 500000, fill: '#50b89a' },
  { name: 'Donasi Kegiatan', value: 200000, fill: '#8cd9a7' },
  { name: 'Infaq Bulanan', value: 300000, fill: '#34a0a4' },
]

// Sample expense data
const expenseData = [
  { name: 'Pembelian Buku', value: 150000, fill: '#920c22' },
  { name: 'Konsumsi Rapat', value: 75000, fill: '#af2038' },
  { name: 'ATK Kelas', value: 125000, fill: '#800016' },
]

export default function KasKelasPage() {
  const [detailModal, setDetailModal] = useState<HistoryTransaction | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(true)
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

  const openDetailModal = (transaction: HistoryTransaction) => {
    setDetailModal(transaction)
  }
  const closeDetailModal = () => {
    setDetailModal(null)
  }

  // Filter and sort functionality
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = historyTransaction

    // Apply filter
    if (filterType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === filterType)
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
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
  }, [filterType, sortBy])

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
            <Icons.ArrowUpCircle size={20} />
            Pemasukan
          </Badge>
        )
      case 'expense':
        return (
          <Badge className="bg-red-50 font-normal text-red-700 md:text-base">
            <Icons.ArrowDownCircle size={20} />
            Pengeluaran
          </Badge>
        )
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <>
      <div className="p-6">
        <div className="mx-auto max-w-[1440px] space-y-8">
          <Card className="relative rounded-4xl border-0">
            <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
              <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
                Rekap Keuangan Kas
              </CardTitle>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChartVisible(!isChartVisible)}
              className="absolute right-4 bottom-4 text-gray-500 hover:text-gray-700"
            >
              {isChartVisible ? 'Hide' : 'Show'}
            </Button>
          </Card>
          <Card className="rounded-4xl border-0">
            <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
              <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
                Riwayat Transaksi
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 sm:gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter size={20} />
                      {getFilterLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-auto sm:w-[200px]">
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
                      <Icons.ArrowUpCircle size={20} className="text-green-700" />
                      <span className="text-green-700">Pemasukan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:text-red-700 focus:bg-red-50"
                      onClick={() => setFilterType('expense')}
                    >
                      <Icons.ArrowDownCircle size={20} className="text-red-700" />
                      <span className="text-red-700">Pengeluaran</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Sort size={20} />
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
                <Button className="w-full sm:w-auto">
                  <Export size={20} />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full max-w-[1440px]">
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
                    {filteredAndSortedTransactions.map((app) => (
                      <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{app.date}</td>
                        <td className="px-4 py-3 text-sm">{app.purpose}</td>
                        <td className="px-4 py-3">{getTypeBadge(app.type)}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(app.amount)}
                        </td>
                        <td className="px-4 py-3" onClick={() => openDetailModal(app)}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 sm:hidden">
                {filteredAndSortedTransactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    Tidak ada data yang sesuai dengan filter yang dipilih
                  </div>
                ) : (
                  filteredAndSortedTransactions.map((app) => (
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
                        <span className="font-bold text-blue-500">
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
    </>
  )
}
