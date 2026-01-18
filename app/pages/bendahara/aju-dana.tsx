'use client'
import { useQuery } from '@tanstack/react-query'
import {
  CheckIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Filter,
  HandCoins,
  XIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { AjuDanaBendaharaSkeleton } from '~/components/data-display'
import Export from '~/components/icons/export'
import Sort from '~/components/icons/sort'
import { BuatAjuDanaModal } from '~/components/modals/BuatAjuDana'
import { DetailAjuDanaBendahara } from '~/components/modals/DetailAjuDanaBendahara'
import { Badge } from '~/components/ui/badge'
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
import type { components } from '~/types/api'

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

type FundApplicationAPI = components['schemas']['FundApplication'] & {
  user?: { name?: string }
  attachmentUrl?: string
  createdAt?: string
  description?: string
}

export default function BendaharaAjuDana() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const isMobile = useIsMobile()
  const [isButtonsBVisible, setIsButtonsBVisible] = useState(!isMobile)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Fetch fund applications from API
  const {
    data: fundApplicationsData,
    isLoading,
    isFetching,
  } = useQuery(
    fundApplicationQueries.list({
      status: statusFilter as 'pending' | 'approved' | 'rejected' | undefined,
      sortBy,
      sortOrder,
    })
  )

  // Map API data to Application interface
  const applications: Application[] = useMemo(() => {
    // API returns array directly now
    const data = Array.isArray(fundApplicationsData) ? fundApplicationsData : []

    const sorted = [...data].sort((a: FundApplicationAPI, b: FundApplicationAPI) => {
      if (sortBy === 'amount') {
        return sortOrder === 'asc'
          ? (a?.amount ?? 0) - (b?.amount ?? 0)
          : (b?.amount ?? 0) - (a?.amount ?? 0)
      }
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

    return sorted.map((app: FundApplicationAPI) => ({
      id: app?.id ?? '',
      date: app?.createdAt
        ? new Date(app.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      purpose: app?.purpose ?? '',
      category: app?.category ?? 'Lainnya',
      status: (app?.status as 'pending' | 'approved' | 'rejected') ?? 'pending',
      amount: app?.amount ?? 0,
      applicant: app?.user?.name ?? 'Unknown',
      description: app?.description,
      attachment: app?.attachmentUrl,
    }))
  }, [fundApplicationsData, sortBy, sortOrder])

  // Helper functions
  const getSortLabel = () => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' ? 'Terbaru' : 'Terlama'
    }
    return sortOrder === 'desc' ? 'Nominal Tertinggi' : 'Nominal Terendah'
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu'
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-300 text-yellow-700 md:text-sm">
            <Clock />
            Pending
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-green-50 text-green-700 md:text-sm">
            <CheckIcon />
            Diterima
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-700 md:text-sm">
            <XIcon />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewDetail = (app: Application) => {
    setSelectedApplication(app)
    setIsDetailModalOpen(true)
  }

  if (isLoading || isFetching) {
    return <AjuDanaBendaharaSkeleton />
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-360 space-y-8">
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
                className="p-1 transition-transform duration-200 hover:scale-110 md:hidden"
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
              className={`transition-all duration-300 ease-in-out md:block md:w-auto md:translate-y-0 md:opacity-100 ${
                !isButtonsBVisible
                  ? 'max-h-0 w-full translate-y-2 overflow-hidden opacity-0'
                  : 'max-h-96 w-full translate-y-0 overflow-visible opacity-100'
              }`}
            >
              <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:w-auto sm:gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={statusFilter ? 'default' : 'secondary'}
                      className="w-full sm:w-auto"
                    >
                      <Filter className="h-5 w-5" />
                      {statusFilter ? getStatusLabel(statusFilter) : 'Filter'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setStatusFilter(undefined)
                      }}
                    >
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setStatusFilter('pending')
                      }}
                    >
                      Menunggu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setStatusFilter('approved')
                      }}
                    >
                      Disetujui
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setStatusFilter('rejected')
                      }}
                    >
                      Ditolak
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Sort className="h-5 w-5" />
                      {getSortLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setSortBy('date')
                        setSortOrder('desc')
                      }}
                    >
                      Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setSortBy('date')
                        setSortOrder('asc')
                      }}
                    >
                      Terlama
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setSortBy('amount')
                        setSortOrder('desc')
                      }}
                    >
                      Nominal Tertinggi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setSortBy('amount')
                        setSortOrder('asc')
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-4 text-gray-400">
                            <HandCoins className="mx-auto size-12" />
                          </div>
                          <h3 className="mb-2 text-lg font-medium text-gray-900">
                            Tidak ada pengajuan
                          </h3>
                          <p className="text-sm text-gray-500">
                            Tidak ada data yang sesuai dengan filter yang dipilih
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{app.date}</td>
                        <td className="px-4 py-3 text-sm">{app.purpose}</td>
                        <td className="px-4 py-3 text-sm">🎯 {app.category}</td>
                        <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
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

            <div className="space-y-4 sm:hidden">
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">Memuat data...</div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-gray-400">
                    <HandCoins className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada pengajuan</h3>
                  <p className="text-sm text-gray-500">
                    Tidak ada data yang sesuai dengan filter yang dipilih
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{app.date}</span>
                      {getStatusBadge(app.status)}
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
        <DetailAjuDanaBendahara
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedApplication}
        />
      )}
    </div>
  )
}
