'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar as CalendarIcon, Clock, HandCoins } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link } from 'react-router'

type CashBill = components['schemas']['CashBill']
type FundApplication = components['schemas']['FundApplication']

import {
  EmptyState,
  StatCard,
  StatCardsGridSkeleton,
  TransactionItem,
  TransactionListSkeleton,
} from '~/components/data-display'
import { Icons } from '~/components/icons'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date-picker'
import { Skeleton } from '~/components/ui/skeleton'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { dashboardQueries } from '~/lib/queries/dashboard.queries'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { formatCurrency, formatDate, groupTransactionsByDate } from '~/lib/utils'
import type { components } from '~/types/api'
import { toTransactionDisplayList } from '~/types/domain'

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  // Fetch dashboard data using React Query
  const { data: summary, isLoading: isSummaryLoading } = useQuery(
    dashboardQueries.summary({
      startDate: date?.from?.toISOString().split('T')[0],
      endDate: date?.to?.toISOString().split('T')[0],
    })
  )

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    transactionQueries.recent(5)
  )

  const { data: billsData } = useQuery(
    cashBillQueries.my({
      status: 'belum_dibayar',
      limit: 5,
    })
  )

  const { data: fundApplicationsData, isLoading: isApplicationsLoading } = useQuery(
    fundApplicationQueries.my({
      status: 'pending',
      limit: 5,
    })
  )

  // Convert API transactions to display type using centralized converter
  const filteredTransactions = toTransactionDisplayList(transactionsData?.transactions || [])
  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  const filteredSummary = {
    totalBalance: summary?.totalBalance || 0,
    totalIncome: summary?.totalIncome || 0,
    totalExpense: summary?.totalExpense || 0,
  }

  // Handle flat data response for bills
  const bills = (Array.isArray(billsData) ? billsData : []) as CashBill[]
  const totalBills = bills.reduce(
    (totalBill: { amount: number; date: Date; dueDate: Date }, bill: CashBill) => {
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
        <h1 className="text-2xl font-semibold text-gray-900">Saldo Kas</h1>
        <div className="flex items-center gap-2">
          <DatePicker date={date} onChange={setDate} />
        </div>
      </div>

      {/* Stat Cards - With skeleton loading */}
      {isSummaryLoading ? (
        <div className="mb-8">
          <StatCardsGridSkeleton count={3} />
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            icon={<Icons.MoneyTotal className="mr-2 h-6 w-6" />}
            title="Total Saldo"
            label="Saldo Efektif"
            value={formatCurrency(filteredSummary.totalBalance)}
            variant="blue"
          />
          <StatCard
            icon={<Icons.ArrowDownCircle className="mr-2 h-6 w-6" />}
            title="Total Pemasukan"
            label="Saldo Pemasukan"
            value={formatCurrency(filteredSummary.totalIncome)}
            variant="green"
          />
          <StatCard
            icon={<Icons.ArrowUpCircle className="mr-2 h-6 w-6" />}
            title="Total Pengeluaran"
            label="Saldo Pengeluaran"
            value={`-${formatCurrency(filteredSummary.totalExpense)}`}
            variant="red"
          />
        </div>
      )}

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
              <div className="text-xl font-bold md:text-3xl xl:text-4xl">
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
              {isTransactionsLoading ? (
                <TransactionListSkeleton count={5} />
              ) : groupedTransactions.length > 0 ? (
                groupedTransactions.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3 className="mb-2 border-b border-gray-900 pb-2 text-lg font-semibold text-gray-900 xl:text-xl">
                      {formatDate(day.date)}
                    </h3>
                    <div className="space-y-6 sm:space-y-3">
                      {day.items.map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={Clock}
                  title="Tidak ada transaksi"
                  description="Belum ada transaksi pada periode yang dipilih"
                />
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
              {isApplicationsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="size-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(fundApplicationsData) && fundApplicationsData.length > 0 ? (
                (fundApplicationsData as FundApplication[])
                  .filter((app: FundApplication) => app.status === 'pending')
                  .map((application: FundApplication) => (
                    <div
                      key={application.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center rounded-full bg-gray-300 p-2">
                          <HandCoins className="size-8 text-gray-900" />
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
                <EmptyState
                  icon={HandCoins}
                  title="Tidak ada pengajuan pending"
                  description="Anda belum memiliki pengajuan dana yang sedang diproses"
                />
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
