'use client'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ChevronUp, Filter, HandCoins } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AjuDanaUserSkeleton, EmptyState, StatusBadge } from '~/components/data-display'
import Export from '~/components/icons/export'
import Plus from '~/components/icons/plus'
import Sort from '~/components/icons/sort'
import { BuatAjuDanaModal } from '~/components/modals/BuatAjuDana'
import { DetailAjuDanaModal } from '~/components/modals/DetailAjuDana'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useIsMobile } from '~/hooks/use-mobile'
import { STATUS_LABELS } from '~/lib/constants'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { formatCurrency } from '~/lib/utils'

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

export default function AjuDanaPage() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const isMobile = useIsMobile()

  // Section A: Your Applications - filters and state
  const [statusFilterA, setStatusFilterA] = useState<string | undefined>()
  const [sortByA, setSortByA] = useState<'date' | 'amount' | 'status'>('date')
  const [sortOrderA, setSortOrderA] = useState<'asc' | 'desc'>('desc')

  // Section B: All Fund Applications - filters and state
  const [statusFilterB, setStatusFilterB] = useState<string | undefined>()
  const [sortByB, setSortByB] = useState<'date' | 'amount' | 'status'>('date')
  const [sortOrderB, setSortOrderB] = useState<'asc' | 'desc'>('desc')

  // Fetch applications for Section A
  const { data: myApplicationsDataA, isLoading: isLoadingA } = useQuery(
    fundApplicationQueries.my({
      status: statusFilterA as 'pending' | 'approved' | 'rejected' | undefined,
      sortBy: sortByA,
      sortOrder: sortOrderA,
    })
  )

  // Fetch applications for Section B (all applications)
  const { data: myApplicationsDataB, isLoading: isLoadingB } = useQuery(
    fundApplicationQueries.list({
      status: statusFilterB as 'pending' | 'approved' | 'rejected' | undefined,
      sortBy: sortByB,
      sortOrder: sortOrderB,
    })
  )

  // Map API data for Section A
  const applicationsA: Application[] = useMemo(() => {
    // API returns array directly now
    const data = Array.isArray(myApplicationsDataA) ? myApplicationsDataA : []
    return data.map((app) => ({
      id: app.id || '',
      date: app.date || '',
      purpose: app.purpose || '',
      category: app.category || '',
      status: (app.status || 'pending') as 'pending' | 'approved' | 'rejected',
      amount: app.amount || 0,
      applicant: 'Anda',
    }))
  }, [myApplicationsDataA])

  // Map API data for Section B
  const applicationsB: Application[] = useMemo(() => {
    // API returns array directly now
    const data = Array.isArray(myApplicationsDataB) ? myApplicationsDataB : []
    return data.map((app) => ({
      id: app.id || '',
      date: app.date || '',
      purpose: app.purpose || '',
      category: app.category || '',
      status: (app.status || 'pending') as 'pending' | 'approved' | 'rejected',
      amount: app.amount || 0,
      applicant: app.applicant?.name || 'Unknown',
    }))
  }, [myApplicationsDataB])

  // Toggle states for buttons - initialize based on isMobile
  const [isButtonsAVisible, setIsButtonsAVisible] = useState(!isMobile)
  const [isButtonsBVisible, setIsButtonsBVisible] = useState(!isMobile)

  // Helper functions
  const getSortLabel = (sortBy: string, sortOrder: string) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' ? 'Terbaru' : 'Terlama'
    }
    if (sortBy === 'status') {
      return 'Status'
    }
    return sortOrder === 'desc' ? 'Nominal Tertinggi' : 'Nominal Terendah'
  }

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS]?.labelId || status
  }

  const handleViewDetail = (app: Application) => {
    setSelectedApplication(app)
    setIsDetailModalOpen(true)
  }

  if (isLoadingA || isLoadingB) {
    return <AjuDanaUserSkeleton />
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-360 space-y-8">
        {/* Section A: Your Applications */}
        <Card className="rounded-4xl border-0">
          <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
              <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
                Rekap Pengajuan Anda
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsButtonsAVisible(!isButtonsAVisible)}
                className="p-1 transition-transform duration-200 hover:scale-110 sm:hidden"
              >
                <div className="transition-transform duration-300">
                  {isButtonsAVisible ? (
                    <ChevronUp className="size-6" />
                  ) : (
                    <ChevronDown className="size-6" />
                  )}
                </div>
              </Button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out sm:block sm:w-auto sm:translate-y-0 sm:opacity-100 ${
                !isButtonsAVisible
                  ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
                  : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
              }`}
            >
              <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto sm:gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={statusFilterA ? 'default' : 'secondary'}
                      className="w-full sm:w-auto"
                    >
                      <Filter className="h-5 w-5" />
                      {statusFilterA ? getStatusLabel(statusFilterA) : 'Filter'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setStatusFilterA(undefined)}>
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilterA('pending')}>
                      Menunggu
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilterA('approved')}>
                      Disetujui
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilterA('rejected')}>
                      Ditolak
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Sort className="h-5 w-5" />
                      {getSortLabel(sortByA, sortOrderA)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByA('date')
                        setSortOrderA('desc')
                      }}
                    >
                      Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByA('date')
                        setSortOrderA('asc')
                      }}
                    >
                      Terlama
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByA('amount')
                        setSortOrderA('desc')
                      }}
                    >
                      Nominal Tertinggi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByA('amount')
                        setSortOrderA('asc')
                      }}
                    >
                      Nominal Terendah
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="w-full sm:w-auto">
                  <Export className="h-5 w-5" />
                  Export
                </Button>
                <Button
                  onClick={() => setIsApplicationModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5" />
                  Ajukan Dana
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full max-w-360">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                    <th className="px-4 py-3 text-left font-medium">Keperluan</th>
                    <th className="px-4 py-3 text-left font-medium">Kategori</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Nominal</th>
                    <th className="px-4 py-3 text-left font-medium">Pengaju</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody>
                  {isLoadingA ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : applicationsA.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <EmptyState
                          icon={HandCoins}
                          title="Tidak ada pengajuan dana"
                          description="Belum ada data yang sesuai dengan filter yang dipilih"
                        />
                      </td>
                    </tr>
                  ) : (
                    applicationsA.map((app) => (
                      <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{app.date}</td>
                        <td className="px-4 py-3 text-sm">{app.purpose}</td>
                        <td className="px-4 py-3 text-sm">🎯 {app.category}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(app.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm">{app.applicant}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(app)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 sm:hidden">
              {isLoadingA ? (
                <div className="py-8 text-center text-gray-500">Memuat data...</div>
              ) : applicationsA.length === 0 ? (
                <EmptyState
                  icon={HandCoins}
                  title="Tidak ada pengajuan dana"
                  description="Belum ada data yang sesuai dengan filter yang dipilih"
                  className="py-12"
                />
              ) : (
                applicationsA.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
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
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(app)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section B: All Fund Applications */}
        <Card className="rounded-4xl border-0">
          <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
              <CardTitle className="xl:text-3.75 text-xl font-semibold md:text-2xl">
                Rekap Pengajuan Dana
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsButtonsBVisible(!isButtonsBVisible)}
                className="p-1 transition-transform duration-200 hover:scale-110 sm:hidden"
              >
                <div className="transition-transform duration-300">
                  {isButtonsBVisible ? (
                    <ChevronUp className="size-6" />
                  ) : (
                    <ChevronDown className="size-6" />
                  )}
                </div>
              </Button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out sm:block sm:w-auto sm:translate-y-0 sm:opacity-100 ${
                !isButtonsBVisible
                  ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
                  : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
              }`}
            >
              <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto sm:gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={statusFilterB ? 'default' : 'secondary'}
                      className="w-full sm:w-auto"
                    >
                      <Filter className="h-5 w-5" />
                      {statusFilterB ? getStatusLabel(statusFilterB) : 'Filter'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setStatusFilterB(undefined)}>
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilterB('pending')}>
                      Menunggu
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilterB('approved')}>
                      Disetujui
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilterB('rejected')}>
                      Ditolak
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Sort className="h-5 w-5" />
                      {getSortLabel(sortByB, sortOrderB)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByB('date')
                        setSortOrderB('desc')
                      }}
                    >
                      Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByB('date')
                        setSortOrderB('asc')
                      }}
                    >
                      Terlama
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByB('amount')
                        setSortOrderB('desc')
                      }}
                    >
                      Nominal Tertinggi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortByB('amount')
                        setSortOrderB('asc')
                      }}
                    >
                      Nominal Terendah
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="w-full sm:w-auto">
                  <Export className="h-5 w-5" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full max-w-360">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                    <th className="px-4 py-3 text-left font-medium">Keperluan</th>
                    <th className="px-4 py-3 text-left font-medium">Kategori</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Nominal</th>
                    <th className="px-4 py-3 text-left font-medium">Pengaju</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody>
                  {isLoadingB ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : applicationsB.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <EmptyState
                          icon={HandCoins}
                          title="Tidak ada pengajuan dana"
                          description="Belum ada data yang sesuai dengan filter yang dipilih"
                        />
                      </td>
                    </tr>
                  ) : (
                    applicationsB.map((app) => (
                      <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{app.date}</td>
                        <td className="px-4 py-3 text-sm">{app.purpose}</td>
                        <td className="px-4 py-3 text-sm">🎯 {app.category}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(app.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm">{app.applicant}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(app)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 sm:hidden">
              {isLoadingB ? (
                <div className="py-8 text-center text-gray-500">Memuat data...</div>
              ) : applicationsB.length === 0 ? (
                <EmptyState
                  icon={HandCoins}
                  title="Tidak ada pengajuan dana"
                  description="Belum ada data yang sesuai dengan filter yang dipilih"
                  className="py-12"
                />
              ) : (
                applicationsB.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
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
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(app)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
