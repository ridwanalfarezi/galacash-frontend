'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar as CalendarIcon, CircleArrowDown, CircleArrowUp, Clock, Gift } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link } from 'react-router'

import { Icons } from '~/components/icons'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date-picker'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { dashboardQueries } from '~/lib/queries/dashboard.queries'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'

import {
  formatCurrency,
  formatDate,
  groupTransactionsByDate,
  type Transaction,
} from '../../lib/utils'

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  // Fetch dashboard data using React Query
  const { data: summary } = useQuery(
    dashboardQueries.summary({
      startDate: date?.from?.toISOString().split('T')[0],
      endDate: date?.to?.toISOString().split('T')[0],
    })
  )

  const { data: transactionsData } = useQuery(transactionQueries.recent(5))

  const { data: billsData } = useQuery(
    cashBillQueries.my({
      status: 'belum_dibayar',
      limit: 5,
    })
  )

  const { data: fundApplicationsData } = useQuery(
    fundApplicationQueries.my({
      status: 'pending',
      limit: 5,
    })
  )

  // Convert API transactions to local Transaction type
  const filteredTransactions: Transaction[] = (transactionsData?.transactions || []).map((t) => ({
    id: t.id || '',
    type: (t.type || 'income') as 'income' | 'expense',
    description: t.description || '',
    amount: t.amount || 0,
    date: t.date || new Date().toISOString().split('T')[0],
  }))
  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  const filteredSummary = {
    totalBalance: summary?.totalBalance || 0,
    totalIncome: summary?.totalIncome || 0,
    totalExpense: summary?.totalExpense || 0,
  }

  const totalBills = billsData?.bills?.reduce(
    (totalBill, bill) => {
      totalBill.amount += bill.totalAmount || 0
      const billMonth = bill.month || '2025-01'
      totalBill.date = new Date(
        Math.min(totalBill.date.getTime(), new Date(billMonth + '-01').getTime())
      )
      totalBill.dueDate = new Date(
        Math.max(totalBill.dueDate.getTime(), new Date(bill.dueDate || billMonth + '-31').getTime())
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
                {totalBills?.date.toLocaleDateString('id', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {totalBills?.dueDate.toLocaleDateString('id', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xl font-bold md:text-3xl xl:text-[40px]">
                {formatCurrency(totalBills?.amount || 0)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <div className="hidden md:block">
                Harap bayar tagihan anda sebelum{' '}
                <span className="font-semibold">
                  {totalBills?.dueDate.toLocaleDateString('id', {
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
              {fundApplicationsData?.applications &&
              fundApplicationsData.applications.length > 0 ? (
                fundApplicationsData.applications
                  .filter((app) => app.status === 'pending')
                  .map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center rounded-full bg-gray-300 p-2">
                          <Gift className="size-8 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium">
                            {formatCurrency(application.amount || 0)}
                          </h3>
                          <h4 className="text-sm text-gray-500">{application.purpose}</h4>
                          <h5 className="block text-xs text-yellow-500 capitalize md:hidden">
                            {application.status}
                          </h5>
                        </div>
                      </div>
                      <div className="hidden items-center justify-center space-x-2 rounded-xl bg-yellow-300 px-2 py-1 md:flex">
                        <Clock className="size-6 text-gray-900" />
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 text-gray-400">
                    <Gift className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Tidak ada pengajuan pending
                  </h3>
                  <p className="text-sm text-gray-500">
                    Anda belum memiliki pengajuan dana yang sedang diproses
                  </p>
                </div>
              )}
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
