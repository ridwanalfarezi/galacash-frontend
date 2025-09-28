import { ChevronRight } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface Pengajuan {
  tanggal: string
  keperluan: string
  kategori: 'Fotocopy' | 'Transport' | 'Makan'
  deskripsi: string
  status: 'Ditolak' | 'Diterima' | 'Pending'
  nominal: number
  nama: string
}

const dataPengajuan: Pengajuan[] = [
  {
    tanggal: '1313624001',
    keperluan: 'membeli danusan',
    kategori: 'Makan',
    deskripsi: 'lorem ipsum dolor sit amet',
    status: 'Ditolak',
    nominal: 15000,
    nama: 'Ridwan Alfarezi',
  },
  {
    tanggal: '1313624001',
    keperluan: 'fotocopy soal uas',
    kategori: 'Fotocopy',
    deskripsi: 'lorem ipsum dolor sit amet',
    status: 'Diterima',
    nominal: 15000,
    nama: 'Muhammad Naufal Aulia',
  },
  {
    tanggal: '1313624001',
    keperluan: 'buat ojek online',
    kategori: 'Transport',
    deskripsi: 'lorem ipsum dolor sit amet',
    status: 'Pending',
    nominal: 15000,
    nama: 'Nanadana Ammar',
  },
]

const statusColor: Record<Pengajuan['status'], string> = {
  Ditolak: 'bg-red-100 text-red-700',
  Diterima: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-600',
}

export default function BendaharaAjuDana() {
  return (
    <div className="p-6">
      <Card className="mx-auto max-w-[1440px] rounded-4xl border-0">
        <CardHeader className="flex flex-col items-center justify-between space-y-0 md:flex-row">
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-around">
            <CardTitle className="text-xl font-semibold md:text-2xl xl:text-[30px]">
              Rekap Pengajuan Dana
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-[16px] font-semibold">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Kepeprluan</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Nominal</th>
                  <th className="w-72 px-4 py-3">Pengaju</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className="text-sm">
                {dataPengajuan.map((item, idx) => {
                  return (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{item.tanggal}</td>
                      <td className="px-4 py-3">{item.keperluan}</td>
                      <td className="px-4 py-3">{item.kategori}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${statusColor[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.nominal}</td>
                      <td className="px-4 py-3">{item.nama}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
