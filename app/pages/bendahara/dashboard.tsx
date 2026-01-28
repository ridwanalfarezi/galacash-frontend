'use client'

import { useQuery } from '@tanstack/react-query'
import { Clock, HandCoins } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link } from 'react-router'

import {
  EmptyState,
  StatCard,
  StatCardsGridSkeleton,
  TransactionItem,
  TransactionListSkeleton,
} from '~/components/data-display'
import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date-picker'
import { Skeleton } from '~/components/ui/skeleton'
import {
  bendaharaQueries,
  useApproveFundApplication,
  useRejectFundApplication,
} from '~/lib/queries/bendahara.queries'
import { formatCurrency, formatDate, formatDateForAPI, groupTransactionsByDate } from '~/lib/utils'
import { toTransactionDisplayList } from '~/types/domain'

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 8, 5),
    to: new Date(),
  })

  // Fetch dashboard data from API with date filter
  const {
    data: dashboardData,
    isLoading,
    isFetching,
  } = useQuery(
    bendaharaQueries.dashboard({
      startDate: date?.from ? formatDateForAPI(date.from) : undefined,
      endDate: date?.to ? formatDateForAPI(date.to) : undefined,
    })
  )

  // Mutations for approve/reject
  const approveMutation = useApproveFundApplication()
  const rejectMutation = useRejectFundApplication()

  // Map API transactions to display type using centralized converter
  const transactions = useMemo(() => {
    if (!dashboardData?.recentTransactions) return []
    return toTransactionDisplayList(dashboardData.recentTransactions)
  }, [dashboardData])

  const groupedTransactions = groupTransactionsByDate(transactions)

  // Summary from dashboard API
  const filteredSummary = {
    totalBalance: dashboardData?.totalBalance ?? 0,
    totalIncome: dashboardData?.totalIncome ?? 0,
    totalExpense: dashboardData?.totalExpense ?? 0,
  }

  // Fund applications from API
  const pendingApplications = useMemo(() => {
    return (
      (dashboardData?.recentFundApplications || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((app: any) => app.status === 'pending')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((app: any) => ({
          id: app.id || '',
          userId: app.applicant?.id || '',
          name: app.applicant?.name || 'Unknown',
          description: app.purpose || '',
          amount: app.amount || 0,
          status: app.status || 'pending',
          createdAt: app.date || '',
        }))
    )
  }, [dashboardData])

  const handleApprove = (id: string) => {
    approveMutation.mutate(id)
  }

  const handleReject = (id: string) => {
    rejectMutation.mutate({ id, rejectionReason: 'Ditolak oleh bendahara' })
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Saldo Kas</h1>
        <div className="flex items-center gap-2">
          <DatePicker date={date} onChange={setDate} />
        </div>
      </div>

      {/* Stat Cards - With skeleton loading */}
      {isLoading || isFetching ? (
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
          {/* Transaction History Card */}
          <Card className="rounded-4xl border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
                Riwayat Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full space-y-8">
              {isLoading ? (
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
                  className="h-full"
                />
              )}
            </CardContent>
            <div className="flex justify-center">
              <Link to="/bendahara/kas-kelas" className="hover:underline">
                View More
              </Link>
            </div>
          </Card>
        </div>

        {/* Pending Submissions */}
        <div>
          <Card className="rounded-4xl border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 md:text-2xl xl:text-3xl">
                Pengajuan Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingApplications.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pendingApplications.map((submission: any) => (
                  <div
                    key={submission.id}
                    className="flex flex-row items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-base font-medium">{submission.name}</h3>
                        <h4 className="text-sm text-gray-500">{submission.description}</h4>
                        <h5 className="text-sm capitalize">{formatCurrency(submission.amount)}</h5>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl">
                        <Button
                          className="rounded-none bg-red-700 hover:bg-red-500"
                          onClick={() => handleReject(submission.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <Icons.X className="size-4 text-gray-100" />
                        </Button>
                        <Button
                          className="rounded-none bg-green-700 hover:bg-green-500"
                          onClick={() => handleApprove(submission.id)}
                          disabled={approveMutation.isPending}
                        >
                          <Icons.Check className="size-4 text-gray-100" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={HandCoins}
                  title="Tidak ada pengajuan"
                  description="Belum ada pengajuan dana yang perlu diproses"
                />
              )}
            </CardContent>
            <div className="flex justify-center">
              <Link to="/bendahara/aju-dana" className="hover:underline">
                View More
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
