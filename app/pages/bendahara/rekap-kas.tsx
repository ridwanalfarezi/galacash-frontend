import { Check, ChevronDown, ChevronRight, ChevronUp, Filter, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Popover, PopoverTrigger } from '~/components/ui/popover'
import { useIsMobile } from '~/hooks/use-mobile'

interface Tagihan {
  nim: string
  nama: string
  status: Record<string, boolean>
  biayaPerBulan: number
}

const bulanList = ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025']

const dataTagihan: Tagihan[] = [
  {
    nim: '1313624001',
    nama: 'Ridwan Alfarezi',
    status: {
      'Sep 2025': true,
      'Oct 2025': false,
      'Nov 2025': false,
      'Dec 2025': false,
    },
    biayaPerBulan: 16000,
  },
  {
    nim: '1313624002',
    nama: 'Muhammad Naufal Aulia',
    status: {
      'Sep 2025': true,
      'Oct 2025': true,
      'Nov 2025': false,
      'Dec 2025': false,
    },
    biayaPerBulan: 16000,
  },
  {
    nim: '1313624003',
    nama: 'Muhammad Dheki Akbar',
    status: {
      'Sep 2025': true,
      'Oct 2025': true,
      'Nov 2025': true,
      'Dec 2025': false,
    },
    biayaPerBulan: 16000,
  },
  {
    nim: '1313624004',
    nama: 'Muhammad Adhi Pratama Putra',
    status: {
      'Sep 2025': true,
      'Oct 2025': true,
      'Nov 2025': true,
      'Dec 2025': true,
    },
    biayaPerBulan: 16000,
  },
]

// 🔹 Hitung total belum bayar
function hitungTotalBelumBayar(tagihan: Tagihan, bulanList: string[]): number {
  const belumLunasCount = bulanList.filter((bulan) => !tagihan.status[bulan]).length
  return tagihan.biayaPerBulan * belumLunasCount
}

// 🔹 Cek apakah semua bulan sudah lunas
function getStatusLunas(tagihan: Tagihan, bulanList: string[]): boolean {
  return hitungTotalBelumBayar(tagihan, bulanList) === 0
}

// 🔹 Format angka ke Rupiah
function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

// 🔹 Warna untuk badge status lunas / belum lunas
function getStatusColor(statusLunas: boolean): string {
  return statusLunas ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
}

// 🔹 Warna icon untuk status bulan (✔️ atau ❌)
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

export default function BendaharaRekapkas() {
  const [isButtonsVisible, setIsButtonsVisible] = useState(true)

  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) setIsButtonsVisible(false)
  }, [isMobile])
  return (
    <div className="p-6">
      <Card className="mx-auto max-w-[1440px] rounded-4xl border-0">
        <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
            <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
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
                  <Button className="relative w-full sm:w-auto">
                    <Filter className="h-5 w-5" />
                    Filter
                  </Button>
                </PopoverTrigger>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Icons.Sort className="h-5 w-5" />
                    Sort
                  </Button>
                </PopoverTrigger>
              </Popover>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* display desktop */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full max-w-[1440px] text-left text-sm">
              <thead>
                <tr className="border-b text-[16px] font-semibold">
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
                {dataTagihan.map((item) => {
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
                        {formatRupiah(totalBelum)}
                      </td>

                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/bendahara/rekap-kas/${item.nim}`}
                            state={{ nama: item.nama }} // ✅ kirim nama ke halaman tujuan
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* display mobile */}
          <div className="space-y-4 sm:hidden">
            {dataTagihan.map((tagihan) => {
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

                  {/* Tabel mini bulan */}
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

                  {/* Total dan tombol */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-blue-500">{formatRupiah(totalBelum)}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/bendahara/rekap-kas/${tagihan.nim}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
