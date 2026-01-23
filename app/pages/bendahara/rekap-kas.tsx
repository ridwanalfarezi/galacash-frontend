'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Check, ChevronRight, Download, Receipt, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { RekapKasSkeleton } from '~/components/data-display'
import {
  DataCard,
  DataCardContainer,
  DataMobileFilters,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from '~/components/shared/data-table/DataTable'
import { DataTablePagination } from '~/components/shared/data-table/DataTablePagination'
import { ExplorerProvider, useExplorer } from '~/components/shared/explorer/ExplorerContext'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { transactionService } from '~/lib/services/transaction.service'
import { formatCurrency } from '~/lib/utils'

interface RekapKasParams {
  search?: string
  status?: 'up-to-date' | 'has-arrears'
  [key: string]: unknown
}

function BendaharaRekapKasContent() {
  const { search, setSearch, filters, setFilters, pagination } = useExplorer<RekapKasParams>()
  const [isExporting, setIsExporting] = useState(false)

  // Fetch rekap kas data
  const { data: rekapData, isLoading } = useQuery({
    ...bendaharaQueries.rekapKas({
      search: search || undefined,
      paymentStatus: filters.status,
      page: pagination.page,
      limit: pagination.limit,
    }),
    placeholderData: keepPreviousData,
  })

  function getStatusBadge(status: 'up-to-date' | 'has-arrears') {
    if (status === 'up-to-date') {
      return (
        <Badge
          variant="default"
          className="border-green-100 bg-green-50 text-green-700 hover:bg-green-100"
        >
          <Check className="mr-1 size-3" />
          Lunas
        </Badge>
      )
    }
    return (
      <Badge
        variant="destructive"
        className="border-red-100 bg-red-50 text-red-700 hover:bg-red-100"
      >
        <X className="mr-1 size-3" />
        Menunggak
      </Badge>
    )
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await transactionService.exportTransactions({})
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rekap-kas-mahasiswa-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Berhasil mengekspor rekap kas')
    } catch {
      toast.error('Gagal mengekspor rekap kas')
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return <RekapKasSkeleton />
  }

  const students = rekapData?.students || []

  return (
    <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
      <CardHeader className="flex flex-col border-b border-gray-50 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
          Rekap Tagihan Kas
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="secondary"
            size="sm"
            className="px-4 shadow-sm"
          >
            <Download className="mr-2 size-4" />
            Export Data
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-0 sm:p-6">
        <div className="px-6 pt-6 sm:px-0 sm:pt-0">
          <DataMobileFilters
            search={search}
            onSearchChange={setSearch}
            placeholder="Cari mahasiswa..."
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <DataTable>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHead className="w-40">NIM</DataTableHead>
                <DataTableHead className="w-72">Nama Mahasiswa</DataTableHead>
                <DataTableHead className="text-right">Total Terbayar</DataTableHead>
                <DataTableHead className="text-right">Belum Terbayar</DataTableHead>
                <DataTableHead
                  className="text-center"
                  filterValue={filters.status}
                  onFilterChange={(v) => setFilters({ status: v as 'up-to-date' | 'has-arrears' })}
                  filterOptions={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Lunas', value: 'up-to-date' },
                    { label: 'Menunggak', value: 'has-arrears' },
                  ]}
                  filterOnly
                >
                  Status
                </DataTableHead>
                <DataTableHead className="w-10"></DataTableHead>
              </DataTableRow>
            </DataTableHeader>

            <DataTableBody>
              {students.length === 0 ? (
                <DataTableRow>
                  <DataTableCell colSpan={6} className="h-48 text-center text-gray-400">
                    <EmptyState
                      icon={Receipt}
                      title="Tidak ada data"
                      description="Gunakan filter lain atau tunggu data mahasiswa sinkron"
                    />
                  </DataTableCell>
                </DataTableRow>
              ) : (
                students.map((item) => (
                  <DataTableRow key={item.userId} className="cursor-pointer">
                    <DataTableCell className="font-mono text-xs text-gray-400">
                      {item.nim}
                    </DataTableCell>
                    <DataTableCell className="font-bold text-gray-900">{item.name}</DataTableCell>
                    <DataTableCell className="text-right font-medium text-green-600">
                      {formatCurrency(item.totalPaid)}
                    </DataTableCell>
                    <DataTableCell className="text-right font-bold text-red-600">
                      {formatCurrency(item.totalUnpaid)}
                    </DataTableCell>
                    <DataTableCell className="text-center">
                      {getStatusBadge(item.paymentStatus as 'up-to-date' | 'has-arrears')}
                    </DataTableCell>
                    <DataTableCell>
                      <Button variant="ghost" size="icon" className="size-8" asChild>
                        <Link
                          to={`/bendahara/rekap-kas/${item.userId}`}
                          state={{ nama: item.name }}
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </Button>
                    </DataTableCell>
                  </DataTableRow>
                ))
              )}
            </DataTableBody>
          </DataTable>
        </div>

        {/* Mobile Cards */}
        <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
          {students.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Tidak ada data"
              description="Belum ada data mahasiswa"
            />
          ) : (
            students.map((student) => (
              <DataCard key={student.userId}>
                <Link
                  to={`/bendahara/rekap-kas/${student.userId}`}
                  state={{ nama: student.name }}
                  className="space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="leading-tight font-bold text-gray-900">{student.name}</h3>
                      <p className="mt-0.5 font-mono text-[10px] tracking-tight text-gray-400">
                        {student.nim}
                      </p>
                    </div>
                    {getStatusBadge(student.paymentStatus as 'up-to-date' | 'has-arrears')}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Terbayar
                      </p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(student.totalPaid)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Tunggakan
                      </p>
                      <p className="font-bold text-red-600">
                        {formatCurrency(student.totalUnpaid)}
                      </p>
                    </div>
                  </div>
                </Link>
              </DataCard>
            ))
          )}
        </DataCardContainer>

        <div className="px-6 pb-6 sm:px-0 sm:pb-0">
          <DataTablePagination
            total={rekapData?.total || 0}
            totalPages={rekapData?.totalPages || 1}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 rounded-full bg-gray-50 p-4 text-gray-400">
        <Icon className="size-12" />
      </div>
      <h3 className="mb-1 text-lg font-bold text-gray-900">{title}</h3>
      <p className="max-w-50 text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default function BendaharaRekapKasPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<RekapKasParams> defaultLimit={25}>
          <BendaharaRekapKasContent />
        </ExplorerProvider>
      </div>
    </div>
  )
}
