'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronRight, ChevronUp, Receipt, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { RekapKasSkeleton } from '~/components/data-display'
import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { useIsMobile } from '~/hooks/use-mobile'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { transactionService } from '~/lib/services/transaction.service'
import { formatCurrency } from '~/lib/utils'

export default function BendaharaRekapkas() {
  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)
  const [searchQuery, setSearchQuery] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Fetch rekap kas data from API with search filter
  const { data: rekapData, isLoading } = useQuery(
    bendaharaQueries.rekapKas({
      search: searchQuery || undefined,
    })
  )

  // Color for paid/unpaid status
  function getStatusBadge(status: 'up-to-date' | 'has-arrears') {
    if (status === 'up-to-date') {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <Check className="mr-1 h-3 w-3" />
          Lunas
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        <X className="mr-1 h-3 w-3" />
        Menunggak
      </span>
    )
  }

  // Handle export transactions
  const handleExport = async () => {
    try {
      setIsExporting(true)
      toast.info('Mengekspor transaksi...', { duration: 2000 })

      const blob = await transactionService.exportTransactions({})

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rekap-kas-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Rekap kas berhasil diekspor')
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
    <div className="p-6">
      <Card className="mx-auto max-w-360 rounded-4xl border-0">
        <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
            <CardTitle className="text-xl font-semibold md:text-2xl xl:text-3xl">
              Rekap Tagihan Kas
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
              <div className="relative w-full sm:w-56">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9"
                />
              </div>

              <Button className="w-full sm:w-auto" onClick={handleExport} disabled={isExporting}>
                <Icons.Export className="h-5 w-5" />
                {isExporting ? 'Mengekspor...' : 'Export'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* display desktop */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full max-w-360 text-left text-sm">
              <thead>
                <tr className="border-b text-base font-semibold">
                  <th className="px-4 py-3 text-left font-medium">NIM</th>
                  <th className="w-72 px-4 py-3 text-left font-medium">Nama</th>
                  <th className="px-4 py-3 text-right font-medium">Total Terbayar</th>
                  <th className="px-4 py-3 text-right font-medium">Belum Terbayar</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="w-12" />
                </tr>
              </thead>

              <tbody className="text-sm">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 text-gray-400">
                          <Receipt className="mx-auto size-12" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          Tidak ada data mahasiswa
                        </h3>
                        <p className="text-sm text-gray-500">Belum ada data tagihan kas</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((item) => (
                    <tr
                      key={item.userId}
                      className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 font-medium">{item.nim}</td>
                      <td className="px-4 py-4 font-semibold">{item.name}</td>
                      <td className="px-4 py-4 text-right font-medium whitespace-nowrap text-green-600">
                        {formatCurrency(item.totalPaid)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold whitespace-nowrap text-red-600">
                        {formatCurrency(item.totalUnpaid)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(item.paymentStatus)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Link
                            to={`/bendahara/rekap-kas/${item.userId}`}
                            state={{ nama: item.name }}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* display mobile */}
          <div className="space-y-4 sm:hidden">
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-gray-400">
                  <Receipt className="mx-auto size-12" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada data mahasiswa</h3>
                <p className="text-sm text-gray-500">Belum ada data tagihan kas</p>
              </div>
            ) : (
              students.map((student) => (
                <Link
                  key={student.userId}
                  to={`/bendahara/rekap-kas/${student.userId}`}
                  state={{ nama: student.name }}
                  className="block"
                >
                  <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all active:scale-[0.98]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="line-clamp-1 text-base font-bold text-gray-900">
                          {student.name}
                        </h3>
                        <p className="text-xs text-gray-500">{student.nim}</p>
                      </div>
                      {getStatusBadge(student.paymentStatus)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                          Terbayar
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(student.totalPaid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                          Tunggakan
                        </p>
                        <p className="text-sm font-bold text-red-600">
                          {formatCurrency(student.totalUnpaid)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
