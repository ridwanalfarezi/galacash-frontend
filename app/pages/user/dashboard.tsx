'use client'

import { useQuery } from '@tanstack/react-query'
import { Clock, HandCoins } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link } from 'react-router'

type CashBill = components['schemas']['CashBill']
type FundApplication = components['schemas']['FundApplication']

import { TagihanCard } from '~/components/dashboard/TagihanCard'
import {
  EmptyState,
  StatCard,
  StatCardsGridSkeleton,
  TransactionItem,
  TransactionListSkeleton,
} from '~/components/data-display'
import { Icons } from '~/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date-picker'
import { Skeleton } from '~/components/ui/skeleton'
import { DEFAULT_DASHBOARD_START_DATE } from '~/lib/constants'
import { calculateDeadline, calculateTotalBills } from '~/lib/calculations'
import { cashBillQueries } from '~/lib/queries/cash-bill.queries'
import { dashboardQueries } from '~/lib/queries/dashboard.queries'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { transactionQueries } from '~/lib/queries/transaction.queries'
import { formatCurrency, formatDate, formatDateForAPI, groupTransactionsByDate } from '~/lib/utils'
import type { components } from '~/types/api'
import { toTransactionDisplayList } from '~/types/domain'

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: DEFAULT_DASHBOARD_START_DATE,
    to: new Date(),
  })

  // Fetch dashboard data using React Query
  const { data: summary, isLoading: isSummaryLoading } = useQuery(
    dashboardQueries.summary({
      startDate: date?.from ? formatDateForAPI(date.from) : undefined,
      endDate: date?.to ? formatDateForAPI(date.to) : undefined,
    })
  )

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    transactionQueries.list({
      limit: 5,
      page: 1,
      startDate: date?.from ? formatDateForAPI(date.from) : undefined,
      endDate: date?.to ? formatDateForAPI(date.to) : undefined,
    })
  )

  const { data: billsData, isLoading: isBillsLoading } = useQuery(
    cashBillQueries.my({
      status: 'belum_dibayar',
      limit: 100,
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
    totalBalance: summary?.totalBalance ?? 0,
    totalIncome: summary?.totalIncome ?? 0,
    totalExpense: summary?.totalExpense ?? 0,
  }

  // Handle flat data response for bills
  const bills = useMemo(() => (billsData?.data || []) as CashBill[], [billsData?.data])
  const hasBills = bills.length > 0
  const totalBills = useMemo(() => calculateTotalBills(bills), [bills])

  // Calculate dynamic deadline: 1st of the next non-excluded month from the latest bill
  const deadline = useMemo(() => calculateDeadline(totalBills), [totalBills])

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Saldo Kas</h1>
        <div className="flex items-center gap-2">
          <DatePicker date={date} onChange={setDate} />
        </div>
      </div>

      {/* Tagihan Notification (Mobile Only) */}
      <TagihanCard
        isLoading={isBillsLoading}
        hasBills={hasBills}
        totalBills={totalBills}
        deadline={deadline}
        className="mb-8 block lg:hidden"
      />

      {/* Stat Cards - With skeleton loading */}
      {isSummaryLoading ? (
        <div className="mb-8">
          <StatCardsGridSkeleton count={3} />
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ... StatCards ... */}
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
          {/* Tagihan Notification (Desktop Only) */}
          <TagihanCard
            isLoading={isBillsLoading}
            hasBills={hasBills}
            totalBills={totalBills}
            deadline={deadline}
            className="hidden lg:block"
          />

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
              ) : fundApplicationsData?.data && fundApplicationsData.data.length > 0 ? (
                (fundApplicationsData.data as FundApplication[])
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
