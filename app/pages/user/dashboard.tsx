'use client'

import { Calendar, ChevronDown, ChevronUp, Clock, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatCurrency, formatDate, groupTransactionsByDate } from '../../lib/utils'

// Mock data untuk fase slicing
const mockTransactions = [
  {
    id: '1',
    type: 'expense',
    description: 'Pembelian ATK',
    amount: 150000,
    date: '2024-03-20',
  },
  {
    id: '2',
    type: 'income',
    description: 'Iuran Kas',
    amount: 500000,
    date: '2024-03-20',
  },
  {
    id: '3',
    type: 'expense',
    description: 'Snack Rapat',
    amount: 75000,
    date: '2024-03-19',
  },
  {
    id: '4',
    type: 'income',
    description: 'Iuran Kas',
    amount: 500000,
    date: '2024-03-19',
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

export default function DashboardPage() {
  const [dateRange] = useState('17 Nov 2025 - 17 Des 2025')
  const groupedTransactions = groupTransactionsByDate(mockTransactions)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Saldo Kas</h1>
        <Button variant="outline" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{dateRange}</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-gray-600">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              Total Saldo Kas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-xs text-gray-500">Saldo Efektif</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(mockSummary.totalBalance)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-gray-600">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <ChevronDown className="h-4 w-4 text-green-600" />
              </div>
              Total Pemasukan Kas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-xs text-gray-500">Saldo Pemasukan</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(mockSummary.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-gray-600">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <ChevronUp className="h-4 w-4 text-red-600" />
              </div>
              Total Pengeluaran Kas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-xs text-gray-500">Saldo Pengeluaran</div>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(mockSummary.totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {groupedTransactions.map((day, dayIndex) => (
                <div key={dayIndex}>
                  <div className="mb-3 border-b pb-2 text-sm font-medium text-gray-900">
                    {formatDate(day.date)}
                  </div>
                  <div className="space-y-3">
                    {day.items.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {transaction.type === 'income' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronUp className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                            </div>
                            <div className="text-xs text-gray-500">{transaction.description}</div>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pengajuan Anda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubmissions
                .filter((s) => s.status === 'pending')
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{submission.name}</div>
                        <div className="text-xs text-gray-500">{submission.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{formatCurrency(submission.amount)}</div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                      </Badge>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
