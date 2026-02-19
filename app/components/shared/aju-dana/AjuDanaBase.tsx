'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight, HandCoins, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  EmptyState,
  MobileCardListSkeleton,
  StatusBadge,
  TableBodySkeleton,
} from '~/components/data-display'
import { BuatAjuDanaModal } from '~/components/modals/BuatAjuDana'
import { DetailAjuDanaModal } from '~/components/modals/DetailAjuDana'
import { DetailAjuDanaBendahara } from '~/components/modals/DetailAjuDanaBendahara'
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
import { useExplorer } from '~/components/shared/explorer/ExplorerContext'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { formatCurrency, formatDate, toTitleCase } from '~/lib/utils'
import type { components } from '~/types/api'
import type { Application } from '~/types/domain'

type FundApplicationWithMeta = components['schemas']['FundApplication'] & {
  createdAt?: string
  user?: { name?: string }
  description?: string
  attachmentUrl?: string
}

interface ApplicationParams {
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  [key: string]: unknown
}

export interface AjuDanaListProps {
  title: string
  variant: 'my' | 'all'
  showCreateButton?: boolean
  onOpenModal?: () => void
}

export function AjuDanaList({
  title,
  variant,
  showCreateButton = false,
  onOpenModal,
}: AjuDanaListProps) {
  const { search, debouncedSearch, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<ApplicationParams>()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const myQuery = useQuery({
    ...fundApplicationQueries.my({
      page: pagination.page,
      limit: pagination.limit,
      status: filters.status,
      search: debouncedSearch || undefined,
    }),
    enabled: variant === 'my',
  })

  const listQuery = useQuery({
    ...fundApplicationQueries.list({
      page: pagination.page,
      limit: pagination.limit,
      status: filters.status as 'pending' | 'approved' | 'rejected',
      search: debouncedSearch || undefined,
      sortBy: (sort?.key as 'date' | 'amount' | 'status') ?? 'date',
      sortOrder: (sort?.direction as 'asc' | 'desc') ?? 'desc',
    }),
    enabled: variant === 'all',
  })

  const response = variant === 'my' ? myQuery.data : listQuery.data
  const isLoading = variant === 'my' ? myQuery.isLoading : listQuery.isLoading

  const applications: Application[] = useMemo(() => {
    const data = response?.data || []
    return data.map((app: FundApplicationWithMeta) => ({
      id: app.id || '',
      date: app.createdAt ? formatDate(app.createdAt) : '',
      purpose: app.purpose || '',
      category: toTitleCase(app.category || 'Lainnya'),
      status: (app.status || 'pending') as 'pending' | 'approved' | 'rejected',
      amount: app.amount || 0,
      applicant: variant === 'my' ? 'Anda' : app.user?.name || 'Unknown',
      description: app.description,
      attachment: app.attachmentUrl,
    }))
  }, [response?.data, variant])

  const handleViewDetail = (app: Application) => {
    setSelectedApplication(app)
    setIsDetailModalOpen(true)
  }

  return (
    <>
      <Card className="overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
        <CardHeader className="flex flex-col gap-4 border-b border-gray-50 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">{title}</CardTitle>
          {showCreateButton && onOpenModal && (
            <Button onClick={onOpenModal} className="w-full md:w-auto">
              <Plus className="mr-2 size-5" />
              Ajukan Dana
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6 p-0 sm:p-6">
          <div className="px-6 pt-6 sm:px-0 sm:pt-0">
            <DataMobileFilters
              search={search}
              onSearchChange={setSearch}
              placeholder="Cari keperluan pengajuan..."
            />
          </div>

          <div className="hidden lg:block">
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHead sortKey="date" currentSort={sort} onSort={setSort}>
                    Tanggal
                  </DataTableHead>
                  <DataTableHead>Keperluan</DataTableHead>
                  <DataTableHead>Kategori</DataTableHead>
                  <DataTableHead
                    filterValue={filters.status}
                    onFilterChange={(v) =>
                      setFilters({ status: v as 'pending' | 'approved' | 'rejected' })
                    }
                    filterOptions={[
                      { label: 'Semua Status', value: '' },
                      { label: 'Menunggu', value: 'pending' },
                      { label: 'Diterima', value: 'approved' },
                      { label: 'Ditolak', value: 'rejected' },
                    ]}
                    filterOnly
                  >
                    Status
                  </DataTableHead>
                  <DataTableHead
                    sortKey="amount"
                    currentSort={sort}
                    onSort={setSort}
                    className="text-right"
                  >
                    Nominal
                  </DataTableHead>
                  {variant === 'all' && <DataTableHead>Pengaju</DataTableHead>}
                  <DataTableHead className="w-10"></DataTableHead>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {isLoading ? (
                  <TableBodySkeleton columns={variant === 'all' ? 7 : 6} />
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <DataTableRow
                      key={app.id}
                      className="cursor-pointer"
                      onClick={() => handleViewDetail(app)}
                    >
                      <DataTableCell className="text-gray-500">{app.date}</DataTableCell>
                      <DataTableCell className="max-w-50 truncate font-medium text-gray-900">
                        {app.purpose}
                      </DataTableCell>
                      <DataTableCell>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {app.category}
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <StatusBadge status={app.status} />
                      </DataTableCell>
                      <DataTableCell className="text-right font-bold text-gray-900">
                        {formatCurrency(app.amount)}
                      </DataTableCell>
                      {variant === 'all' && (
                        <DataTableCell className="text-gray-600">{app.applicant}</DataTableCell>
                      )}
                      <DataTableCell>
                        <Button variant="ghost" size="icon" className="size-8 text-gray-400">
                          <ChevronRight className="size-4" />
                        </Button>
                      </DataTableCell>
                    </DataTableRow>
                  ))
                ) : (
                  <DataTableRow>
                    <DataTableCell
                      colSpan={variant === 'all' ? 7 : 6}
                      className="h-48 text-center text-gray-400"
                    >
                      <EmptyState
                        icon={HandCoins}
                        title="Tidak ada pengajuan"
                        description="Belum ada data yang tersedia"
                      />
                    </DataTableCell>
                  </DataTableRow>
                )}
              </DataTableBody>
            </DataTable>
          </div>

          <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
            {isLoading ? (
              <MobileCardListSkeleton count={5} />
            ) : applications.length === 0 ? (
              <EmptyState
                icon={HandCoins}
                title="Tidak ada pengajuan"
                description="Belum ada data yang tersedia"
              />
            ) : (
              applications.map((app) => (
                <DataCard key={app.id} onClick={() => handleViewDetail(app)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="line-clamp-1 leading-tight font-bold text-gray-900">
                        {app.purpose}
                      </h3>
                      <p className="text-xs text-gray-400">{app.date}</p>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-2">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                        Nominal
                      </p>
                      <p className="font-bold text-blue-600">{formatCurrency(app.amount)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
                      <span className="text-[10px] font-medium text-gray-600">{app.category}</span>
                    </div>
                  </div>
                </DataCard>
              ))
            )}
          </DataCardContainer>

          <div className="px-6 pb-6 sm:px-0 sm:pb-0">
            <DataTablePagination
              total={response?.total || 0}
              totalPages={response?.totalPages || 0}
            />
          </div>
        </CardContent>
      </Card>

      {selectedApplication && (
        <DetailAjuDanaModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedApplication}
        />
      )}
    </>
  )
}

export interface AjuDanaBendaharaListProps {
  title?: string
}

export function AjuDanaBendaharaList({
  title = 'Rekap Pengajuan Dana',
}: AjuDanaBendaharaListProps) {
  const { search, debouncedSearch, setSearch, filters, setFilters, sort, setSort, pagination } =
    useExplorer<ApplicationParams>()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: response, isLoading } = useQuery({
    ...fundApplicationQueries.list({
      page: pagination.page,
      limit: pagination.limit,
      status: filters.status,
      search: debouncedSearch || undefined,
      sortBy: (sort?.key as 'date' | 'amount' | 'status') ?? 'date',
      sortOrder: (sort?.direction as 'asc' | 'desc') ?? 'desc',
    }),
  })

  const applications: Application[] = useMemo(() => {
    const data = response?.data || []
    return data.map((app: FundApplicationWithMeta) => ({
      id: app.id || '',
      date: app.createdAt ? formatDate(app.createdAt) : '',
      purpose: app.purpose || '',
      category: toTitleCase(app.category || 'Lainnya'),
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

  return (
    <Card className="gap-0 overflow-hidden rounded-4xl border-0 shadow-lg shadow-gray-100">
      <CardHeader className="flex flex-col gap-4 border-b border-gray-50 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-0 sm:p-6">
        <div className="px-6 pt-6 sm:px-0 sm:pt-0">
          <DataMobileFilters
            search={search}
            onSearchChange={setSearch}
            placeholder="Cari keperluan pengajuan..."
          />
        </div>

        <div className="hidden lg:block">
          <DataTable>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHead sortKey="date" currentSort={sort} onSort={setSort}>
                  Tanggal
                </DataTableHead>
                <DataTableHead>Keperluan</DataTableHead>
                <DataTableHead>Kategori</DataTableHead>
                <DataTableHead
                  filterValue={filters.status}
                  onFilterChange={(v) => {
                    const params = v as 'pending' | 'approved' | 'rejected'
                    setFilters({ status: params })
                  }}
                  filterOptions={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Menunggu', value: 'pending' },
                    { label: 'Diterima', value: 'approved' },
                    { label: 'Ditolak', value: 'rejected' },
                  ]}
                  filterOnly
                >
                  Status
                </DataTableHead>
                <DataTableHead
                  sortKey="amount"
                  currentSort={sort}
                  onSort={setSort}
                  className="text-right"
                >
                  Nominal
                </DataTableHead>
                <DataTableHead>Pengaju</DataTableHead>
                <DataTableHead className="w-10"></DataTableHead>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {isLoading ? (
                <TableBodySkeleton columns={7} />
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <DataTableRow
                    key={app.id}
                    className="cursor-pointer"
                    onClick={() => handleViewDetail(app)}
                  >
                    <DataTableCell className="text-gray-500">{app.date}</DataTableCell>
                    <DataTableCell className="max-w-50 truncate font-medium text-gray-900">
                      {app.purpose}
                    </DataTableCell>
                    <DataTableCell>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {app.category}
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      <StatusBadge status={app.status} />
                    </DataTableCell>
                    <DataTableCell className="text-right font-bold text-gray-900">
                      {formatCurrency(app.amount)}
                    </DataTableCell>
                    <DataTableCell className="text-gray-600">{app.applicant}</DataTableCell>
                    <DataTableCell>
                      <Button variant="ghost" size="icon" className="size-8 text-gray-400">
                        <ChevronRight className="size-4" />
                      </Button>
                    </DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <DataTableCell colSpan={7} className="h-48 text-center text-gray-400">
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

        <DataCardContainer className="px-6 pb-6 sm:px-0 sm:pb-0">
          {isLoading ? (
            <MobileCardListSkeleton count={5} />
          ) : applications.length > 0 ? (
            applications.map((app) => (
              <DataCard key={app.id} onClick={() => handleViewDetail(app)}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 leading-tight font-bold text-gray-900">
                      {app.purpose}
                    </h3>
                    <p className="text-xs text-gray-400">{app.date}</p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                      Nominal
                    </p>
                    <p className="font-bold text-blue-600">{formatCurrency(app.amount)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
                    <div className="size-1.5 rounded-full bg-gray-400" />
                    <span className="text-[10px] font-medium text-gray-600">{app.applicant}</span>
                  </div>
                </div>
              </DataCard>
            ))
          ) : (
            <EmptyState
              icon={HandCoins}
              title="Tidak ada pengajuan"
              description="Belum ada data yang sesuai"
            />
          )}
        </DataCardContainer>

        <div className="px-6 pb-6 sm:px-0 sm:pb-0">
          <DataTablePagination
            total={response?.total || 0}
            totalPages={response?.totalPages || 0}
          />
        </div>
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

export { BuatAjuDanaModal }
