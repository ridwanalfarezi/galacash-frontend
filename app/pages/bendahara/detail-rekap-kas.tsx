import { ChevronRight } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'

interface Tagihan {
  nim: number
  bulan: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  idTagihan: string
  name: string
  dueDate: string
  kasKelas: string
  admin: string
  total: string
}

const dataTagihan: Tagihan[] = [
  {
    nim: 1,
    bulan: 'Desember',
    status: 'Belum Dibayar',
    idTagihan: 'INV-20241201-020-001',
    name: 'Muhammad Naufal Aulia',
    dueDate: '31 Desember 2024',
    kasKelas: 'Rp 30.000,00',
    admin: 'Rp 1.000,00',
    total: 'Rp 31.000,00',
  },
  {
    nim: 2,
    bulan: 'November',
    status: 'Menunggu Konfirmasi',
    idTagihan: 'INV-20241101-020-001',
    name: 'Muhammad Naufal Aulia',
    dueDate: '30 November 2024',
    kasKelas: 'Rp 30.000,00',
    admin: 'Rp 1.000,00',
    total: 'Rp 31.000,00',
  },
  {
    nim: 3,
    bulan: 'Oktober',
    status: 'Sudah Dibayar',
    idTagihan: 'INV-20241001-020-001',
    name: 'Muhammad Naufal Aulia',
    dueDate: '31 October 2024',
    kasKelas: 'Rp 30.000,00',
    admin: 'Rp 1.000,00',
    total: 'Rp 31.000,00',
  },
  {
    nim: 4,
    bulan: 'September',
    status: 'Sudah Dibayar',
    idTagihan: 'INV-20240901-020-001',
    name: 'Muhammad Naufal Aulia',
    dueDate: '30 September 2024',
    kasKelas: 'Rp 30.000,00',
    admin: 'Rp 1.000,00',
    total: 'Rp 31.000,00',
  },
]

const statusColor: Record<Tagihan['status'], string> = {
  'Belum Dibayar': 'bg-red-100 text-red-700',
  'Menunggu Konfirmasi': 'bg-yellow-100 text-yellow-600',
  'Sudah Dibayar': 'bg-green-100 text-green-700',
}

export default function BendaharaDetailRekapKas() {
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
          <table className="w-full text-left text-sm">
            <thead className="border-b text-[16px]">
              <tr>
                <th className="px-4 py-3">Bulan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">ID Tagihan</th>
                <th className="px-4 py-3">Tenggat Waktu</th>
                <th className="px-4 py-3">Total Tagihan</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {dataTagihan.map((row, idx) => (
                <tr key={idx} className="border-b transition hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.bulan}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${statusColor[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.idTagihan}</td>
                  <td className="px-4 py-3">{row.dueDate}</td>
                  <td className="px-4 py-3 font-semibold text-blue-500">{row.total}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
