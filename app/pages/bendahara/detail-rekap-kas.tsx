'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Filter, Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import { BillStatusBadge } from '~/components/data-display'
import { Icons } from '~/components/icons'
import { DetailTagihanKasBendahara } from '~/components/modals/DetailTagihanKasBendahara'
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
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { formatCurrency } from '~/lib/utils'
import type { components } from '~/types/api'

type CashBill = components['schemas']['CashBill']

type ExtendedCashBill = CashBill & {
  paymentMethod?: string
  paymentProofUrl?: string
}

export function useNamaMahasiswa() {
  const location = useLocation()
  const nama = location.state?.nama || 'Mahasiswa'
  return nama
}

interface Tagihan {
  id: string
  month: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  billId: string
  name: string
  dueDate: string
  kasKelas: number
  biayaAdmin: number
  totalAmount: number
  metodePembayaran?: 'bank' | 'ewallet' | 'cash'
  paymentProofUrl?: string | null
}

interface DetailRekapContextState {
  status: string | undefined
  [key: string]: unknown
}

function BendaharaDetailRekapKasContent() {
  const { filters, setFilters, sort, setSort } = useExplorer<DetailRekapContextState>()
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const nama = useNamaMahasiswa()
  const { userId } = useParams()
  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

  // Map context state to API params
  const statusFilter = filters.status
  const sortBy = sort?.key as 'date' | 'amount' | 'status' | undefined
  const sortOrder = (sort?.direction as 'asc' | 'desc') || 'desc'

  const { data: billsData } = useQuery({
    ...bendaharaQueries.cashBills(
      userId
        ? {
            userId,
            status: statusFilter,
            sortBy: sortBy === 'date' ? undefined : sortBy,
            sortOrder,
          }
        : undefined
    ),
    enabled: !!userId,
  })

  // Map API data to local Tagihan format
  const dataTagihan: Tagihan[] = useMemo(() => {
    // API returns array directly or fallback to empty array
    const bills = (Array.isArray(billsData) ? billsData : []) as ExtendedCashBill[]

    return bills.map((bill) => {
      const monthDate = bill.month ? new Date(bill.month) : new Date()
      const monthName = monthDate.toLocaleDateString('id-ID', { month: 'long' })
      const dueDate = bill.dueDate
        ? new Date(bill.dueDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : ''

      // Map API status to display status
      let displayStatus: Tagihan['status'] = 'Belum Dibayar'
      if (bill.status === 'sudah_dibayar') {
        displayStatus = 'Sudah Dibayar'
      } else if (bill.status === 'menunggu_konfirmasi') {
        displayStatus = 'Menunggu Konfirmasi'
      }

      return {
        id: bill.id || '',
        month: monthName,
        status: displayStatus,
        billId: bill.billId || '',
        name: nama,
        dueDate: dueDate,
        kasKelas: bill.totalAmount ? Math.round(bill.totalAmount * 0.9375) : 15000, // ~93.75% of total
        biayaAdmin: bill.totalAmount ? Math.round(bill.totalAmount * 0.0625) : 1000, // ~6.25% of total
        totalAmount: bill.totalAmount || 16000,
        metodePembayaran: bill.paymentMethod as 'bank' | 'ewallet' | 'cash' | undefined,
        paymentProofUrl: bill.paymentProofUrl,
      }
    })
  }, [billsData, nama])

  const handleViewDetail = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTagihan(null)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'belum_dibayar':
        return 'Belum Dibayar'
      case 'menunggu_konfirmasi':
        return 'Menunggu Konfirmasi'
      case 'sudah_dibayar':
        return 'Sudah Dibayar'
      default:
        return status
    }
  }

  const getSortLabel = (key: string | undefined, dir: string) => {
    if (key === 'date' || !key) {
      return dir === 'desc' ? 'Terbaru' : 'Terlama'
    }
    if (key === 'status') {
      return 'Status'
    }
    return dir === 'desc' ? 'Nominal Tertinggi' : 'Nominal Terendah'
  }

  return (
    <>
      <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
        <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
          <span>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/bendahara/rekap-kas/`}>
                <ChevronLeft className="size-6 h-6 w-6" />
              </Link>
            </Button>
          </span>
          <CardTitle className="text-xl font-semibold md:text-2xl xl:text-3xl">
            Rekap Tagihan Kas - {nama}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsButtonsVisible(!isButtonsVisible)}
            className="p-1 transition-transform duration-200 hover:scale-110 md:hidden"
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
          className={`transition-all duration-300 ease-in-out md:block md:w-auto md:translate-y-0 md:opacity-100 ${
            !isButtonsVisible
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
                <DropdownMenuItem onClick={() => setFilters({ status: undefined })}>
                  Semua Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ status: 'belum_dibayar' })}>
                  Belum Dibayar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ status: 'menunggu_konfirmasi' })}>
                  Menunggu Konfirmasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ status: 'sudah_dibayar' })}>
                  Sudah Dibayar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Icons.Sort className="h-5 w-5" />
                  {getSortLabel(sortBy, sortOrder)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort({ key: 'date', direction: 'desc' })}>
                  Terbaru
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ key: 'date', direction: 'asc' })}>
                  Terlama
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ key: 'amount', direction: 'desc' })}>
                  Nominal Tertinggi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ key: 'amount', direction: 'asc' })}>
                  Nominal Terendah
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full max-w-360 text-left text-sm">
            <thead>
              <tr className="border-b text-base">
                <th className="px-4 py-3">Bulan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">ID Tagihan</th>
                <th className="px-4 py-3">Tenggat Waktu</th>
                <th className="px-4 py-3">Total Tagihan</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {dataTagihan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 text-gray-400">
                        <Receipt className="mx-auto size-12" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada tagihan</h3>
                      <p className="text-sm text-gray-500">
                        Belum ada data tagihan untuk mahasiswa ini
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                dataTagihan.map((tagihan) => (
                  <tr key={tagihan.billId} className="border-b transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{tagihan.month}</td>
                    <td className="px-4 py-3">
                      <BillStatusBadge status={tagihan.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">{tagihan.billId}</td>
                    <td className="px-4 py-3">{tagihan.dueDate}</td>
                    <td className="px-4 py-3 font-semibold text-blue-500">
                      {formatCurrency(tagihan.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(tagihan)}>
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
          {dataTagihan.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-gray-400">
                <Receipt className="mx-auto size-12" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada tagihan</h3>
              <p className="text-sm text-gray-500">Belum ada data tagihan untuk mahasiswa ini</p>
            </div>
          ) : (
            dataTagihan.map((tagihan) => (
              <div
                key={tagihan.billId}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{tagihan.dueDate}</span>
                  <BillStatusBadge status={tagihan.status} size="sm" />
                </div>
                <div className="font-semibold">{tagihan.month}</div>
                <div className="text-xs text-gray-700">
                  <span>{tagihan.billId}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-blue-500">
                    {formatCurrency(tagihan.totalAmount)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetail(tagihan)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Detail Modal */}
      {selectedTagihan && (
        <DetailTagihanKasBendahara
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          tagihan={selectedTagihan}
        />
      )}
    </>
  )
}

export default function BendaharaDetailRekapKas() {
  return (
    <div className="p-6">
      <Card className="mx-auto max-w-360 rounded-4xl border-0">
        <ExplorerProvider<{ status: string | undefined }>
          defaultSort={{ key: 'date', direction: 'desc' }}
        >
          <BendaharaDetailRekapKasContent />
        </ExplorerProvider>
      </Card>
    </div>
  )
}
