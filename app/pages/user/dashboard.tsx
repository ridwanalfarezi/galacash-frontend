'use client'

import { CircleArrowDown, CircleArrowUp, Clock, Gift, Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link } from 'react-router'

import { Icons } from '~/components/icons'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date-picker'

import { formatCurrency, formatDate, groupTransactionsByDate } from '../../lib/utils'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    description: 'Pembelian ATK',
    amount: 150000,
    date: '2025-07-01',
  },
  {
    id: '2',
    type: 'income',
    description: 'Iuran Kas',
    amount: 500000,
    date: '2025-07-01',
  },
  {
    id: '3',
    type: 'expense',
    description: 'Snack Rapat',
    amount: 75000,
    date: '2025-07-02',
  },
  {
    id: '4',
    type: 'income',
    description: 'Iuran Kas',
    amount: 500000,
    date: '2025-07-02',
  },
  {
    id: '5',
    type: 'expense',
    description: 'Konsumsi Meeting',
    amount: 125000,
    date: '2025-07-03',
  },
  {
    id: '6',
    type: 'income',
    description: 'Dana Kegiatan',
    amount: 300000,
    date: '2025-07-03',
  },
]

const mockSubmissions = [
  {
    id: '1',
    userId: '1',
    name: 'Ridwan Alfarezi',
    description: 'Pembelian ATK',
    amount: 150000,
    status: 'pending',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    userId: '1',
    name: 'Ridwan Alfarezi',
    description: 'Snack Rapat',
    amount: 75000,
    status: 'pending',
    createdAt: '2024-03-19',
  },
]

const mockSummary = {
  totalBalance: 1573428.69,
  totalIncome: 1573428.69,
  totalExpense: 1573428.69,
}

const mockBills = [
  {
    id: '1',
    amount: 30000,
    date: '2025-06-01',
    dueDate: '2025-06-30',
  },
  {
    id: '2',
    amount: 30000,
    date: '2025-07-01',
    dueDate: '2025-07-31',
  },
]

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (!date?.from || !date?.to) return true
    const transactionDate = new Date(transaction.date)
    return transactionDate >= date.from && transactionDate <= date.to
  })

  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  const filteredSummary = {
    totalBalance: mockSummary.totalBalance,
    totalIncome: filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
  }

  const totalBills = mockBills.reduce(
    (totalBill, bill) => {
      totalBill.amount += bill.amount
      totalBill.date = new Date(Math.min(totalBill.date.getTime(), new Date(bill.date).getTime()))
      totalBill.dueDate = new Date(
        Math.max(totalBill.dueDate.getTime(), new Date(bill.dueDate).getTime())
      )
      return totalBill
    },
    {
      amount: 0,
      date: new Date('2100-01-01'),
      dueDate: new Date('2000-01-01'),
    }
  )

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-semibold text-gray-900">Saldo Kas</h1>
        <div className="flex items-center gap-2">
          <DatePicker date={date} onChange={setDate} />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="gap-4 rounded-4xl border-none border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
              <Icons.MoneyTotal className="mr-2 h-6 w-6" />
              Total Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-base font-semibold">Saldo Efektif</div>
            <div className="text-xl font-bold text-blue-600 md:text-3xl xl:text-[40px]">
              {formatCurrency(filteredSummary.totalBalance)}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-4 rounded-4xl border-none border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
              <Icons.ArrowDownCircle className="mr-2 h-6 w-6" />
              Total Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-base font-semibold">Saldo Pemasukan</div>
            <div className="text-xl font-bold text-green-600 md:text-3xl xl:text-[40px]">
              {formatCurrency(filteredSummary.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-4 rounded-4xl border-none border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
              <Icons.ArrowUpCircle className="mr-2 h-6 w-6" />
              Total Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-base font-semibold">Saldo Pengeluaran</div>
            <div className="text-xl font-bold text-red-600 md:text-3xl xl:text-[40px]">
              -{formatCurrency(filteredSummary.totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Transaction History */}
        <div className="grid gap-4 lg:col-span-2">
          {/* Tagihan Notification */}
          <Card className="gap-2 rounded-4xl border-none bg-red-700 text-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-start gap-2 text-lg font-semibold md:text-2xl xl:text-3xl">
                <Icons.Alert className="size-6" />
                Tagihan Kas Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="size-4" />
                {totalBills.date.toLocaleDateString('id', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {totalBills.dueDate.toLocaleDateString('id', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xl font-bold md:text-3xl xl:text-[40px]">
                {formatCurrency(totalBills.amount)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <div className="hidden md:block">
                Harap bayar tagihan anda sebelum{' '}
                <span className="font-semibold">
                  {totalBills.dueDate.toLocaleDateString('id', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <Link to="/user/tagihan-kas" className="font-semibold hover:underline">
                Bayar Sekarang
              </Link>
            </CardFooter>
          </Card>

          {/* Transaction History Card */}
          <Card className="rounded-4xl border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
                Riwayat Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {groupedTransactions.length > 0 ? (
                groupedTransactions.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3 className="mb-2 border-b border-gray-900 pb-2 text-lg font-semibold text-gray-900 xl:text-xl">
                      {formatDate(day.date)}
                    </h3>
                    <div className="space-y-6 sm:space-y-3">
                      {(day.items as Transaction[]).map((transaction: Transaction) => (
                        <div
                          key={transaction.id}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex items-center justify-center rounded-full p-1 ${
                                transaction.type === 'income'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {transaction.type === 'income' ? (
                                <CircleArrowDown className="size-8" />
                              ) : (
                                <CircleArrowUp className="size-8" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-base font-medium">
                                {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                              </h4>
                              <h6 className="text-xs text-gray-500">{transaction.description}</h6>
                              <h6
                                className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} block text-sm md:hidden md:text-base`}
                              >
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </h6>
                            </div>
                          </div>
                          <h6
                            className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} hidden text-sm md:block md:text-base`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </h6>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 text-gray-400">
                    <Clock className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada transaksi</h3>
                  <p className="text-sm text-gray-500">
                    Belum ada transaksi pada periode yang dipilih
                  </p>
                </div>
              )}
              <div className="flex justify-center">
                <Link to="/user/kas-kelas" className="hover:underline">
                  View More
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <div>
          <Card className="rounded-4xl border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
                Pengajuan Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubmissions
                .filter((s) => s.status === 'pending')
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center rounded-full bg-gray-300 p-2">
                        <Gift className="size-8 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">
                          {formatCurrency(submission.amount)}
                        </h3>
                        <h4 className="text-sm text-gray-500">{submission.description}</h4>
                        <h5 className="block text-xs text-yellow-500 capitalize md:hidden">
                          {submission.status}
                        </h5>
                      </div>
                    </div>
                    <div className="hidden items-center justify-center space-x-2 rounded-[8px] bg-yellow-300 px-2 py-1 md:flex">
                      <Clock className="size-6 text-gray-900" />
                    </div>
                  </div>
                ))}
            </CardContent>
            <div className="flex justify-center">
              <Link to="/user/aju-dana" className="hover:underline">
                View More
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
