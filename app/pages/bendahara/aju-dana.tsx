'use client'

import { useQuery } from '@tanstack/react-query'
import { CheckIcon, Clock, Filter, HandCoins, XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AjuDanaBendaharaSkeleton } from '~/components/data-display'
import { DetailAjuDanaBendahara } from '~/components/modals/DetailAjuDanaBendahara'
import {
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { formatCurrency } from '~/lib/utils'
import type { components } from '~/types/api'

type FundApplicationAPI = components['schemas']['FundApplication'] & {
  user?: { name?: string }
  attachmentUrl?: string
  createdAt?: string
  description?: string
}

interface Application {
  id: string
  date: string
  purpose: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  amount: number
  applicant: string
  description?: string
  attachment?: string
}

interface BendaharaAjuDanaParams {
  status?: 'pending' | 'approved' | 'rejected'
}

function BendaharaAjuDanaContent() {
  const { filters, setFilters, sort, setSort, pagination } = useExplorer<BendaharaAjuDanaParams>()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: response, isLoading } = useQuery(
    fundApplicationQueries.list({
      page: pagination.page,
      limit: pagination.limit,
      status: filters.status,
      sortBy: (sort?.key as 'date' | 'amount' | 'status') ?? 'date',
      sortOrder: sort?.direction ?? 'desc',
    })
  )

  const applications: Application[] = useMemo(() => {
    const data = response?.data || []
    return data.map((app: FundApplicationAPI) => ({
      id: app.id || '',
      date: app.createdAt
        ? new Date(app.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      purpose: app.purpose || '',
      category: app.category || 'Lainnya',
      status: (app.status as 'pending' | 'approved' | 'rejected') || 'pending',
      amount: app.amount || 0,
      applicant: app.user?.name || 'Unknown',
      description: app.description,
      attachment: app.attachmentUrl,
    }))
  }, [response?.data])

  const handleViewDetail = (app: Application) => {
    setSelectedApplication(app)
    setIsDetailModalOpen(true)
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu'
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      default:
        return 'Filter Status'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-300 text-yellow-700 md:text-sm">
            <Clock className="mr-1 size-3" />
            Pending
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-green-50 text-green-700 md:text-sm">
            <CheckIcon className="mr-1 size-3" />
            Diterima
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-700 md:text-sm">
            <XIcon className="mr-1 size-3" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return <AjuDanaBendaharaSkeleton />
  }

  return (
    <Card className="rounded-4xl border-0">
      <CardHeader className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <CardTitle className="text-xl font-semibold md:text-2xl xl:text-3xl">
          Rekap Pengajuan Dana
        </CardTitle>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={filters.status ? 'default' : 'secondary'}>
                <Filter className="mr-2 size-4" />
                {getStatusLabel(filters.status)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilters({ status: undefined })}>
                Semua Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ status: 'pending' })}>
                Menunggu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ status: 'approved' })}>
                Disetujui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ status: 'rejected' })}>
                Ditolak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <DataTable>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHead sortKey="date" currentSort={sort} onSort={setSort}>
                  Tanggal
                </DataTableHead>
                <DataTableHead>Keperluan</DataTableHead>
                <DataTableHead>Kategori</DataTableHead>
                <DataTableHead sortKey="status" currentSort={sort} onSort={setSort}>
                  Status
                </DataTableHead>
                <DataTableHead sortKey="amount" currentSort={sort} onSort={setSort}>
                  Nominal
                </DataTableHead>
                <DataTableHead>Pengaju</DataTableHead>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <DataTableRow
                    key={app.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDetail(app)}
                  >
                    <DataTableCell>{app.date}</DataTableCell>
                    <DataTableCell>{app.purpose}</DataTableCell>
                    <DataTableCell>🎯 {app.category}</DataTableCell>
                    <DataTableCell>{getStatusBadge(app.status)}</DataTableCell>
                    <DataTableCell>{formatCurrency(app.amount)}</DataTableCell>
                    <DataTableCell>{app.applicant}</DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <DataTableCell colSpan={6} className="h-24 text-center">
                    <EmptyState
                      icon={HandCoins}
                      title="Tidak ada pengajuan"
                      description="Belum ada data yang sesuai dengan filter yang dipilih"
                    />
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>

        <DataTablePagination total={response?.total || 0} totalPages={response?.totalPages || 0} />
      </CardContent>

      {selectedApplication && (
        <DetailAjuDanaBendahara
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedApplication}
        />
      )}
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
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="mb-4 text-gray-400">
        <Icon className="mx-auto size-12" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default function BendaharaAjuDana() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <ExplorerProvider<BendaharaAjuDanaParams>
          defaultLimit={20}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <BendaharaAjuDanaContent />
        </ExplorerProvider>
      </div>
    </div>
  )
}
