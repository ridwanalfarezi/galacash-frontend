'use client'

import { ChevronDown, ChevronRight, ChevronUp, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Icons } from '~/components/icons'
import { DetailTagihanKas } from '~/components/modals/DetailTagihanKas'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useIsMobile } from '~/hooks/use-mobile'
import { formatCurrency } from '~/lib/utils'

interface TagihanKas {
  id: string
  month: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  billId: string
  dueDate: string
  totalAmount: number
  name: string
  kasKelas: number
  biayaAdmin: number
}

const mockTagihanKas: TagihanKas[] = [
  {
    id: '1',
    month: 'Desember',
    status: 'Belum Dibayar',
    billId: 'INV-20241201-020-001',
    dueDate: '31 Desember 2024',
    totalAmount: 31000,
    name: 'Ridwan Alfarezi',
    kasKelas: 30000,
    biayaAdmin: 1000,
  },
  {
    id: '2',
    month: 'November',
    status: 'Menunggu Konfirmasi',
    billId: 'INV-20241101-020-001',
    dueDate: '30 November 2024',
    totalAmount: 31000,
    name: 'Ridwan Alfarezi',
    kasKelas: 30000,
    biayaAdmin: 1000,
  },
  {
    id: '3',
    month: 'Oktober',
    status: 'Sudah Dibayar',
    billId: 'INV-20241001-020-001',
    dueDate: '31 Oktober 2024',
    totalAmount: 31000,
    name: 'Ridwan Alfarezi',
    kasKelas: 30000,
    biayaAdmin: 1000,
  },
  {
    id: '4',
    month: 'September',
    status: 'Sudah Dibayar',
    billId: 'INV-20240901-020-001',
    dueDate: '30 September 2024',
    totalAmount: 31000,
    name: 'Ridwan Alfarezi',
    kasKelas: 30000,
    biayaAdmin: 1000,
  },
]

export default function TagihanKasPage() {
  const [isButtonsVisible, setIsButtonsVisible] = useState(true)
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKas | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const getStatusBadge = (status: TagihanKas['status']) => {
    switch (status) {
      case 'Belum Dibayar':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
            {status}
          </Badge>
        )
      case 'Menunggu Konfirmasi':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            {status}
          </Badge>
        )
      case 'Sudah Dibayar':
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetail = (tagihan: TagihanKas) => {
    setSelectedTagihan(tagihan)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTagihan(null)
  }

  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) setIsButtonsVisible(false)
  }, [isMobile])

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1440px]">
        <Card className="rounded-4xl border-0">
          <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
              <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
                Rekap Tagihan Kas
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
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Filter className="h-5 w-5" />
                  Filter
                </Button>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Icons.Sort className="h-5 w-5" />
                  Sort
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full max-w-[1440px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-3 text-left font-medium">Bulan</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">ID Tagihan</th>
                    <th className="px-4 py-3 text-left font-medium">Tenggat Waktu</th>
                    <th className="px-4 py-3 text-left font-medium">Total Tagihan</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody>
                  {mockTagihanKas.map((tagihan) => (
                    <tr key={tagihan.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{tagihan.month}</td>
                      <td className="px-4 py-3">{getStatusBadge(tagihan.status)}</td>
                      <td className="px-4 py-3 text-sm">{tagihan.billId}</td>
                      <td className="px-4 py-3 text-sm">{tagihan.dueDate}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-500">
                        {formatCurrency(tagihan.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(tagihan)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 sm:hidden">
              {mockTagihanKas.map((tagihan) => (
                <div
                  key={tagihan.id}
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{tagihan.dueDate}</span>
                    {getStatusBadge(tagihan.status)}
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedTagihan && (
        <DetailTagihanKas
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          tagihan={selectedTagihan}
        />
      )}
    </div>
  )
}
