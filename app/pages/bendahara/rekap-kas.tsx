'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronRight, ChevronUp, Filter, Receipt, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { Icons } from '~/components/icons'
import Export from '~/components/icons/export'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Popover, PopoverTrigger } from '~/components/ui/popover'
import { useIsMobile } from '~/hooks/use-mobile'
import { bendaharaQueries } from '~/lib/queries/bendahara.queries'
import { formatCurrency } from '~/lib/utils'

interface StudentBill {
  nim: string
  nama: string
  status: Record<string, boolean>
  biayaPerBulan: number
  userId: string
}

export default function BendaharaRekapkas() {
  const isMobile = useIsMobile()
  const [isButtonsVisible, setIsButtonsVisible] = useState(!isMobile)

  // Fetch students data from API
  const { data: studentsData } = useQuery(bendaharaQueries.students())

  // Fetch rekap kas summary from API
  const { data: rekapData } = useQuery(bendaharaQueries.rekapKas())

  // Generate month list for the current semester
  const bulanList = useMemo(() => {
    const months = []
    const now = new Date()
    const startMonth = now.getMonth() >= 6 ? 6 : 0 // July-Dec or Jan-June
    const year = now.getFullYear()

    for (let i = 0; i < 6; i++) {
      const monthIndex = (startMonth + i) % 12
      const monthYear = monthIndex < startMonth ? year + 1 : year
      const date = new Date(monthYear, monthIndex, 1)
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      months.push(monthStr)
    }
    return months.slice(0, 4) // Show only 4 months
  }, [])

  // Map API data to local format
  const dataTagihan: StudentBill[] = useMemo(() => {
    if (!studentsData?.students) return []
    return studentsData.students.map((student) => {
      // Create status object - placeholder until we fetch actual bill data
      // TODO: Fetch actual bill status per student when API supports it
      const status: Record<string, boolean> = {}
      bulanList.forEach((bulan) => {
        // For now, use the student's paymentStatus if available, otherwise default to false
        status[bulan] = (student as Record<string, unknown>).paymentStatus === 'up-to-date'
      })

      return {
        nim: student.nim || '',
        nama: student.name || '',
        status,
        biayaPerBulan: ((rekapData as Record<string, unknown>)?.monthlyAmount as number) || 16000,
        userId: student.id || '',
      }
    })
  }, [studentsData, rekapData, bulanList])

  // Calculate total unpaid
  function hitungTotalBelumBayar(tagihan: StudentBill, bulanList: string[]): number {
    const belumLunasCount = bulanList.filter((bulan) => !tagihan.status[bulan]).length
    return tagihan.biayaPerBulan * belumLunasCount
  }

  // Check if all months are paid
  function getStatusLunas(tagihan: StudentBill, bulanList: string[]): boolean {
    return hitungTotalBelumBayar(tagihan, bulanList) === 0
  }

  // Color for paid/unpaid badge
  function getStatusColor(statusLunas: boolean): string {
    return statusLunas ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
  }

  // Icon color for month status
  function getMonthStatusColor(isPaid: boolean): string {
    return isPaid ? 'text-green-500' : 'text-red-500'
  }

  function renderStatusBulan(isLunas: boolean) {
    return isLunas ? (
      <Check className={`mx-auto h-5 w-5 ${getMonthStatusColor(true)}`} />
    ) : (
      <X className={`mx-auto h-5 w-5 ${getMonthStatusColor(false)}`} />
    )
  }

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
              {/* Filter Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative w-full bg-white text-black sm:w-auto"
                  >
                    <Filter className="h-5 w-5" />
                    Filter
                  </Button>
                </PopoverTrigger>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="hover: w-full bg-white text-black sm:w-auto"
                  >
                    <Icons.Sort className="h-5 w-5" />
                    Sort
                  </Button>
                </PopoverTrigger>
              </Popover>
              <Button className="w-full sm:w-auto">
                <Export className="h-5 w-5" />
                Export
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
                  {bulanList.map((bulan) => (
                    <th key={bulan} className="px-4 py-3 text-center font-medium">
                      {bulan}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium">Belum Terbayar</th>
                  <th className="w-12" />
                </tr>
              </thead>

              <tbody className="text-sm">
                {dataTagihan.length === 0 ? (
                  <tr>
                    <td colSpan={bulanList.length + 4} className="py-12">
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
                  dataTagihan.map((item) => {
                    const totalBelum = hitungTotalBelumBayar(item, bulanList)

                    return (
                      <tr key={item.nim} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{item.nim}</td>
                        <td className="px-4 py-3">{item.nama}</td>

                        {bulanList.map((bulan) => (
                          <td key={bulan} className="px-4 py-3 text-center">
                            {renderStatusBulan(item.status[bulan])}
                          </td>
                        ))}

                        <td className="px-4 py-3 font-bold text-blue-500">
                          {formatCurrency(totalBelum)}
                        </td>

                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              to={`/bendahara/rekap-kas/${item.userId}`}
                              state={{ nama: item.nama }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* display mobile */}
          <div className="space-y-4 sm:hidden">
            {dataTagihan.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-gray-400">
                  <Receipt className="mx-auto size-12" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada data mahasiswa</h3>
                <p className="text-sm text-gray-500">Belum ada data tagihan kas</p>
              </div>
            ) : (
              dataTagihan.map((tagihan) => {
                const totalBelum = hitungTotalBelumBayar(tagihan, bulanList)
                const statusLunas = getStatusLunas(tagihan, bulanList)

                return (
                  <div
                    key={tagihan.nim}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-base font-semibold">{tagihan.nama}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(statusLunas)}`}
                      >
                        {statusLunas ? 'sudah Lunas' : 'Belum Lunas'}
                      </span>
                    </div>

                    {/* Mini month table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-gray-200 text-center text-xs">
                        <thead>
                          <tr>
                            {bulanList.map((bulan) => (
                              <th key={bulan} className="border-b px-2 py-2 font-medium">
                                {bulan}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {bulanList.map((bulan) => (
                              <td key={bulan} className="border-b px-4 py-3 text-center">
                                {renderStatusBulan(tagihan.status[bulan])}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Total and button */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-blue-500">{formatCurrency(totalBelum)}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          to={`/bendahara/rekap-kas/${tagihan.userId}`}
                          state={{ nama: tagihan.nama }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
