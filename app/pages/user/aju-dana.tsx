'use client'
import { useQuery } from '@tanstack/react-query'
import {
  CheckIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  HandCoins,
  RotateCcw,
  XIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import Export from '~/components/icons/export'
import Plus from '~/components/icons/plus'
import Sort from '~/components/icons/sort'
import { BuatAjuDanaModal } from '~/components/modals/BuatAjuDana'
import { DetailAjuDanaModal } from '~/components/modals/DetailAjuDana'
import { FilterComponent, type FilterState } from '~/components/shared/filter-component'
import { SortDropdown, type SortOption } from '~/components/shared/sort-dropdown'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useIsMobile } from '~/hooks/use-mobile'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'

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

  // Fetch my fund applications
  const { data: myApplicationsData } = useQuery(fundApplicationQueries.my())
  const mockApplications: Application[] = useMemo(() => {
    if (!myApplicationsData?.applications) return []
    return myApplicationsData.applications.map((app) => ({
      id: app.id || '',
      date: app.date || '',
      purpose: app.purpose || '',
      category: app.category || '',
      status: (app.status || 'pending') as 'pending' | 'approved' | 'rejected',
      amount: app.amount || 0,
      applicant: 'Anda',
    }))
  }, [myApplicationsData])

  // Create fund application mutation - TODO: use when API is ready
  // const createApplicationMutation = useMutation({
  //   mutationFn: (data: {
  //     purpose: string
  //     category: 'education' | 'health' | 'emergency' | 'equipment'
  //     amount: number
  //     description?: string
  //     attachment?: File
  //   }) => fundApplicationService.createApplication(data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: fundApplicationQueries.my().queryKey })
  //     toast.success('Pengajuan dana berhasil dibuat')
  //     setIsApplicationModalOpen(false)
  //   },
  //   onError: () => {
  //     toast.error('Gagal membuat pengajuan dana')
  //   },
  // })

  // Toggle states for buttons - initialize based on isMobile
  const [isButtonsAVisible, setIsButtonsAVisible] = useState(!isMobile)
  const [isButtonsBVisible, setIsButtonsBVisible] = useState(!isMobile)
  const [currentSortA, setCurrentSortA] = useState<SortOption | null>(null)
  const maxAmountA = useMemo(() => {
    if (mockApplications.length === 0) return 0
    return Math.max(...mockApplications.map((app) => app.amount))
  }, [mockApplications])
  const [filtersA, setFiltersA] = useState<FilterState>({
    status: [],
    applicants: [],
    categories: [],
    amountRange: [0, maxAmountA],
  })
  const isFilterActiveA =
    filtersA.status.length > 0 ||
    filtersA.applicants.length > 0 ||
    filtersA.categories.length > 0 ||
    filtersA.amountRange[0] > 0 ||
    filtersA.amountRange[1] < maxAmountA
  const isSortActiveA = currentSortA !== null
  const clearAllFiltersA = () => {
    setCurrentSortA(null)
    setFiltersA({
      status: [],
      applicants: [],
      categories: [],
      amountRange: [0, maxAmountA],
    })
  }
  const filteredAndSortedApplicationsA = useMemo(() => {
    let filtered = [...mockApplications]

    if (filtersA.status.length > 0) {
      filtered = filtered.filter((app) => filtersA.status.includes(app.status))
    }

    if (filtersA.applicants.length > 0) {
      filtered = filtered.filter((app) => filtersA.applicants.includes(app.applicant))
    }

    if (filtersA.categories.length > 0) {
      filtered = filtered.filter((app) => filtersA.categories.includes(app.category))
    }

    filtered = filtered.filter(
      (app) => app.amount >= filtersA.amountRange[0] && app.amount <= filtersA.amountRange[1]
    )

    if (currentSortA) {
      filtered.sort((a, b) => {
        let aVal: string | number = a[currentSortA.field as keyof Application] as string | number
        let bVal: string | number = b[currentSortA.field as keyof Application] as string | number

        if (currentSortA.field === 'date') {
          aVal = new Date(aVal as string).getTime()
          bVal = new Date(bVal as string).getTime()
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = (bVal as string).toLowerCase()
        }

        return currentSortA.direction === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
      })
    }

    return filtered
  }, [filtersA, currentSortA, mockApplications])

  const [currentSortB, setCurrentSortB] = useState<SortOption | null>(null)
  const maxAmountB = useMemo(
    () => Math.max(...mockApplications.map((app) => app.amount)),
    [mockApplications]
  )
  const [filtersB, setFiltersB] = useState<FilterState>({
    status: [],
    applicants: [],
    categories: [],
    amountRange: [0, maxAmountB],
  })
  const isFilterActiveB =
    filtersB.status.length > 0 ||
    filtersB.applicants.length > 0 ||
    filtersB.categories.length > 0 ||
    filtersB.amountRange[0] > 0 ||
    filtersB.amountRange[1] < maxAmountB
  const isSortActiveB = currentSortB !== null
  const clearAllFiltersB = () => {
    setCurrentSortB(null)
    setFiltersB({
      status: [],
      applicants: [],
      categories: [],
      amountRange: [0, maxAmountB],
    })
  }
  const filteredAndSortedApplicationsB = useMemo(() => {
    let filtered = [...mockApplications]

    if (filtersB.status.length > 0) {
      filtered = filtered.filter((app) => filtersB.status.includes(app.status))
    }

    if (filtersB.applicants.length > 0) {
      filtered = filtered.filter((app) => filtersB.applicants.includes(app.applicant))
    }

    if (filtersB.categories.length > 0) {
      filtered = filtered.filter((app) => filtersB.categories.includes(app.category))
    }

    filtered = filtered.filter(
      (app) => app.amount >= filtersB.amountRange[0] && app.amount <= filtersB.amountRange[1]
    )

    if (currentSortB) {
      filtered.sort((a, b) => {
        let aVal: string | number = a[currentSortB.field as keyof Application] as string | number
        let bVal: string | number = b[currentSortB.field as keyof Application] as string | number

        if (currentSortB.field === 'date') {
          aVal = new Date(aVal as string).getTime()
          bVal = new Date(bVal as string).getTime()
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = (bVal as string).toLowerCase()
        }

        return currentSortB.direction === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
      })
    }

    return filtered
  }, [filtersB, currentSortB, mockApplications])

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

  return (
    <div className="p-6">
      <div className="mx-auto max-w-360 space-y-8">
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
                <FilterComponent
                  currentFilters={filtersA}
                  onFilterChange={setFiltersA}
                  applicants={['Ridwan', 'Raisa']}
                  categories={['Transport', 'Makanan']}
                  maxAmount={maxAmountA}
                  className="w-full sm:w-auto"
                />

                <SortDropdown
                  currentSort={currentSortA}
                  onSortChange={setCurrentSortA}
                  align="end"
                  trigger={
                    <Button
                      variant={isSortActiveA ? 'default' : 'secondary'}
                      className={`w-full sm:w-auto ${isSortActiveA ? 'bg-blue-500 text-white hover:bg-blue-700' : ''}`}
                    >
                      <Sort className="h-5 w-5" />
                      Sort
                      {isSortActiveA && (
                        <Badge className="ml-1 h-5 bg-white px-1.5 py-0.5 text-xs text-blue-500">
                          1
                        </Badge>
                      )}
                    </Button>
                  }
                />

                {(isFilterActiveA || isSortActiveA) && (
                  <Button
                    variant="secondary"
                    onClick={clearAllFiltersA}
                    className="text-destructive hover:bg-destructive border-destructive w-full hover:text-white sm:w-auto"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                )}

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
                  {filteredAndSortedApplicationsA.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-4 text-gray-400">
                            <HandCoins className="mx-auto size-12" />
                          </div>
                          <h3 className="mb-2 text-lg font-medium text-gray-900">
                            Tidak ada pengajuan dana
                          </h3>
                          <p className="text-sm text-gray-500">
                            Belum ada data yang sesuai dengan filter yang dipilih
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedApplicationsA.map((app) => (
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
              {filteredAndSortedApplicationsA.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-gray-400">
                    <HandCoins className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Tidak ada pengajuan dana
                  </h3>
                  <p className="text-sm text-gray-500">
                    Belum ada data yang sesuai dengan filter yang dipilih
                  </p>
                </div>
              ) : (
                filteredAndSortedApplicationsA.map((app) => (
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
                <FilterComponent
                  currentFilters={filtersB}
                  onFilterChange={setFiltersB}
                  applicants={['Ridwan', 'Raisa']}
                  categories={['Transport', 'Makanan']}
                  maxAmount={maxAmountB}
                  className="w-full sm:w-auto"
                />
                <SortDropdown
                  currentSort={currentSortB}
                  onSortChange={setCurrentSortB}
                  align="end"
                  trigger={
                    <Button
                      variant={isSortActiveB ? 'default' : 'secondary'}
                      className={`w-full sm:w-auto ${isSortActiveB ? 'bg-blue-500 text-white hover:bg-blue-700' : ''}`}
                    >
                      <Sort className="h-5 w-5" />
                      Sort
                      {isSortActiveB && (
                        <Badge className="ml-1 h-5 bg-white px-1.5 py-0.5 text-xs text-blue-500">
                          1
                        </Badge>
                      )}
                    </Button>
                  }
                />
                {(isFilterActiveB || isSortActiveB) && (
                  <Button
                    variant="secondary"
                    onClick={clearAllFiltersB}
                    className="text-destructive hover:bg-destructive border-destructive w-full hover:text-white sm:w-auto"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                )}
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
                  {filteredAndSortedApplicationsB.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-4 text-gray-400">
                            <HandCoins className="mx-auto size-12" />
                          </div>
                          <h3 className="mb-2 text-lg font-medium text-gray-900">
                            Tidak ada pengajuan dana
                          </h3>
                          <p className="text-sm text-gray-500">
                            Belum ada data yang sesuai dengan filter yang dipilih
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedApplicationsB.map((app) => (
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
              {filteredAndSortedApplicationsB.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-gray-400">
                    <HandCoins className="mx-auto size-12" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Tidak ada pengajuan dana
                  </h3>
                  <p className="text-sm text-gray-500">
                    Belum ada data yang sesuai dengan filter yang dipilih
                  </p>
                </div>
              ) : (
                filteredAndSortedApplicationsB.map((app) => (
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
        <DetailAjuDanaModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedApplication}
        />
      )}
    </div>
  )
}
