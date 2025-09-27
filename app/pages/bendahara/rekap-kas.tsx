import { Check, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'

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
    biayaPerBulan: 15000,
  },
  {
    nim: '1313624002',
    nama: 'Muhammad Naufal Aulia',
    status: {
      'Sep 2025': true,
      'Oct 2025': false,
      'Nov 2025': false,
      'Dec 2025': false,
    },
    biayaPerBulan: 15000,
  },
  {
    nim: '1313624003',
    nama: 'Muhammad Dheki akbar',
    status: {
      'Sep 2025': true,
      'Oct 2025': false,
      'Nov 2025': false,
      'Dec 2025': false,
    },
    biayaPerBulan: 15000,
  },
  {
    nim: '1313624004',
    nama: 'Muhammad adhi pratama putra',
    status: {
      'Sep 2025': true,
      'Oct 2025': false,
      'Nov 2025': false,
      'Dec 2025': false,
    },
    biayaPerBulan: 15000,
  },
]

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export default function BendaharaRekapkas() {
  return (
    <div className="p-6">
      <Card className="mx-auto max-w-[1440px] rounded-4xl border-0">
        <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
            <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
              Rekap Tagihan Kas
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-[16px] font-semibold">
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
              {dataTagihan.map((item, idx) => {
                // hitung jumlah bulan yang false
                const belumLunasCount = bulanList.filter((bulan) => !item.status[bulan]).length

                // total = biaya per bulan * jumlah false
                const totalBelum = item.biayaPerBulan * belumLunasCount

                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{item.nim}</td>
                    <td className="px-4 py-3">{item.nama}</td>

                    {bulanList.map((bulan) => (
                      <td key={bulan} className="px-4 py-3 text-center">
                        {item.status[bulan] ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-red-600" />
                        )}
                      </td>
                    ))}

                    <td className="px-4 py-3 font-bold text-blue-500">
                      {formatRupiah(totalBelum)}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/bendahara/rekap-kas/${item.nim}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
