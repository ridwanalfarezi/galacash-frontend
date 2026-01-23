'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Filter, HandCoins } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AjuDanaUserSkeleton, EmptyState, StatusBadge } from '~/components/data-display'
import Plus from '~/components/icons/plus'
import { BuatAjuDanaModal } from '~/components/modals/BuatAjuDana'
import { DetailAjuDanaModal } from '~/components/modals/DetailAjuDana'
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
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useIsMobile } from '~/hooks/use-mobile'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { formatCurrency } from '~/lib/utils'
import type { components } from '~/types/api'

type FundApplicationWithMeta = components['schemas']['FundApplication'] & {
  createdAt?: string
  user?: { name?: string }
  description?: string
  attachmentUrl?: string
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

interface ApplicationParams {
  status?: 'pending' | 'approved' | 'rejected'
}

function UserMyApplicationsContent() {
  const { filters, setFilters, sort, setSort, pagination } = useExplorer<ApplicationParams>()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const { data: response, isLoading } = useQuery(
    fundApplicationQueries.my({
      page: pagination.page,
      limit: pagination.limit,
      status: filters.status,
      sortBy: (sort?.key as 'date' | 'amount' | 'status') ?? 'date',
      sortOrder: sort?.direction ?? 'desc',
    })
  )

  const applications: Application[] = useMemo(() => {
    const data = response?.data || []
    return data.map((app: FundApplicationWithMeta) => ({
      id: app.id || '',
      date: app.createdAt
        ? new Date(app.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      purpose: app.purpose || '',
      category: app.category || '',
      status: (app.status || 'pending') as 'pending' | 'approved' | 'rejected',
      amount: app.amount || 0,
      applicant: 'Anda',
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
        return 'Filter'
    }
  }

  if (isLoading) return <AjuDanaUserSkeleton /> // Or smaller skeleton just for this section

  return (
    <Card className="rounded-4xl border-0">
      <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
        <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
          <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
            Rekap Pengajuan Anda
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsButtonsVisible(!isButtonsVisible)}
            className="p-1 transition-transform duration-200 hover:scale-110 sm:hidden"
          >
            <div className="transition-transform duration-300">
              {isButtonsVisible ? (
                <ChevronUp className="size-6" />
              ) : (
                <ChevronDown className="size-6" />
              )}
            </div>
          </Button>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out sm:block sm:w-auto sm:translate-y-0 sm:opacity-100 ${
            !isButtonsVisible
              ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
              : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
          }`}
        >
          <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={filters.status ? 'default' : 'secondary'}
                  className="w-full sm:w-auto"
                >
                  <Filter className="mr-2 h-5 w-5" />
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

            <Button onClick={() => setIsApplicationModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Ajukan Dana
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden rounded-md border sm:block">
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
                    <DataTableCell>
                      <StatusBadge status={app.status} />
                    </DataTableCell>
                    <DataTableCell>{formatCurrency(app.amount)}</DataTableCell>
                    <DataTableCell>{app.applicant}</DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <DataTableCell colSpan={6} className="h-24 text-center">
                    <EmptyState
                      icon={HandCoins}
                      title="Tidak ada pengajuan dana"
                      description="Belum ada data yang sesuai dengan filter yang dipilih"
                    />
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 sm:hidden">
          {applications.length === 0 ? (
            <EmptyState
              icon={HandCoins}
              title="Tidak ada pengajuan dana"
              description="Belum ada data yang sesuai dengan filter yang dipilih"
            />
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                onClick={() => handleViewDetail(app)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{app.date}</span>
                  <StatusBadge status={app.status} size="sm" />
                </div>
                <div className="font-semibold">{app.purpose}</div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  <span>🎯 {app.category}</span>
                  <span>• {app.applicant}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-blue-500">{formatCurrency(app.amount)}</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DataTablePagination total={response?.total || 0} totalPages={response?.totalPages || 0} />
      </CardContent>

      <BuatAjuDanaModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
      />
      {selectedApplication && (
        <DetailAjuDanaModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedApplication}
        />
      )}
    </Card>
  )
}

function UserAllApplicationsContent() {
  const { filters, setFilters, sort, setSort, pagination } = useExplorer<ApplicationParams>()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

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
    return data.map((app: FundApplicationWithMeta) => ({
      id: app.id || '',
      date: app.createdAt
        ? new Date(app.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      purpose: app.purpose || '',
      category: app.category || '',
      status: (app.status || 'pending') as 'pending' | 'approved' | 'rejected',
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
        return 'Filter'
    }
  }

  if (isLoading) return <AjuDanaUserSkeleton />

  return (
    <Card className="rounded-4xl border-0">
      <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
        <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
          <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
            Rekap Pengajuan Dana
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsButtonsVisible(!isButtonsVisible)}
            className="p-1 transition-transform duration-200 hover:scale-110 sm:hidden"
          >
            <div className="transition-transform duration-300">
              {isButtonsVisible ? (
                <ChevronUp className="size-6" />
              ) : (
                <ChevronDown className="size-6" />
              )}
            </div>
          </Button>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out sm:block sm:w-auto sm:translate-y-0 sm:opacity-100 ${
            !isButtonsVisible
              ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
              : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
          }`}
        >
          <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={filters.status ? 'default' : 'secondary'}
                  className="w-full sm:w-auto"
                >
                  <Filter className="mr-2 h-5 w-5" />
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
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden rounded-md border sm:block">
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
                    <DataTableCell>
                      <StatusBadge status={app.status} />
                    </DataTableCell>
                    <DataTableCell>{formatCurrency(app.amount)}</DataTableCell>
                    <DataTableCell>{app.applicant}</DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <DataTableCell colSpan={6} className="h-24 text-center">
                    <EmptyState
                      icon={HandCoins}
                      title="Tidak ada pengajuan dana"
                      description="Belum ada data yang sesuai dengan filter yang dipilih"
                    />
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 sm:hidden">
          {applications.length === 0 ? (
            <EmptyState
              icon={HandCoins}
              title="Tidak ada pengajuan dana"
              description="Belum ada data yang sesuai dengan filter yang dipilih"
            />
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                onClick={() => handleViewDetail(app)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{app.date}</span>
                  <StatusBadge status={app.status} size="sm" />
                </div>
                <div className="font-semibold">{app.purpose}</div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  <span>🎯 {app.category}</span>
                  <span>• {app.applicant}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-blue-500">{formatCurrency(app.amount)}</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DataTablePagination total={response?.total || 0} totalPages={response?.totalPages || 0} />
      </CardContent>

      {selectedApplication && (
        <DetailAjuDanaModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedApplication}
        />
      )}
    </Card>
  )
}

export default function AjuDanaPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-360 space-y-8">
        <ExplorerProvider<ApplicationParams>
          defaultLimit={5}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <UserMyApplicationsContent />
        </ExplorerProvider>

        <ExplorerProvider<ApplicationParams>
          defaultLimit={20}
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <UserAllApplicationsContent />
        </ExplorerProvider>
      </div>
    </div>
  )
}
