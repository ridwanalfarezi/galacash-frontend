'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleArrowDown, CircleArrowUp, Clock, HandCoins } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link } from 'react-router'

import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date-picker'
import {
  bendaharaQueries,
  useApproveFundApplication,
  useRejectFundApplication,
} from '~/lib/queries/bendahara.queries'

import { formatCurrency, formatDate, groupTransactionsByDate } from '../../lib/utils'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
}

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  // Fetch dashboard data from API
  const { data: dashboardData } = useQuery(bendaharaQueries.dashboard())

  // Mutations for approve/reject
  const approveMutation = useApproveFundApplication()
  const rejectMutation = useRejectFundApplication()

  // Map API transactions to local Transaction type
  const transactions: Transaction[] = useMemo(() => {
    if (!dashboardData?.recentTransactions) return []
    return dashboardData.recentTransactions.map((t) => ({
      id: t.id || '',
      type: (t.type || 'income') as 'income' | 'expense',
      description: t.description || '',
      amount: t.amount || 0,
      date: t.date || '',
    }))
  }, [dashboardData])

  // Filter transactions by date
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (!date?.from || !date?.to) return true
      const transactionDate = new Date(transaction.date)
      return transactionDate >= date.from && transactionDate <= date.to
    })
  }, [transactions, date])

  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  // Summary from API with fallback
  const filteredSummary = {
    totalBalance: dashboardData?.totalBalance || 0,
    totalIncome: dashboardData?.totalIncome || 0,
    totalExpense: dashboardData?.totalExpense || 0,
  }

  // Fund applications from API
  const pendingApplications = useMemo(() => {
    if (!dashboardData?.recentFundApplications) return []
    return dashboardData.recentFundApplications
      .filter((app) => app.status === 'pending')
      .map((app) => ({
        id: app.id || '',
        userId: app.applicant?.id || '', // Use applicant.id since userId doesn't exist
        name: app.applicant?.name || 'Unknown',
        description: app.purpose || '',
        amount: app.amount || 0,
        status: app.status || 'pending',
        createdAt: app.date || '',
      }))
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
            <div className="text-xl font-bold text-blue-600 md:text-3xl xl:text-4xl">
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
            <div className="text-xl font-bold text-green-600 md:text-3xl xl:text-4xl">
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
            <div className="text-xl font-bold text-red-600 md:text-3xl xl:text-4xl">
              -{formatCurrency(filteredSummary.totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

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
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 text-gray-400">
                    <Clock className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada transaksi</h3>
                  <p className="text-sm text-gray-500">
                    Belum ada transaksi pada periode yang dipilih
                  </p>
                </div>
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
              {pendingApplications.length > 0 ? (
                pendingApplications.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex flex-row items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-base font-medium">{submission.name}</h3>
                        <h4 className="text-sm text-gray-500">{submission.description}</h4>
                        <h5 className="block text-xs text-yellow-500 capitalize md:hidden">
                          {submission.status}
                        </h5>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="min-w-0 flex-1 truncate text-base font-medium">
                        {formatCurrency(submission.amount)}
                      </h3>
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 text-gray-400">
                    <HandCoins className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada pengajuan</h3>
                  <p className="text-sm text-gray-500">
                    Belum ada pengajuan dana yang perlu diproses
                  </p>
                </div>
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
