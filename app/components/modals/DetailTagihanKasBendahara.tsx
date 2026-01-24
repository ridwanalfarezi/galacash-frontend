'use client'

import { Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { useConfirmPayment } from '~/lib/queries/bendahara.queries'
import { formatCurrency } from '~/lib/utils'

import { Icons } from '../icons'

interface TagihanKasDetail {
  id: string
  month: string
  status: 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Sudah Dibayar'
  billId: string
  dueDate: string
  totalAmount: number
  name: string
  kasKelas: number
  biayaAdmin: number
  metodePembayaran?: 'bank' | 'ewallet' | 'cash'
  paymentProofUrl?: string | null
}

interface DetailTagihanKasProps {
  isOpen: boolean
  onClose: () => void
  tagihan: TagihanKasDetail
}

export function DetailTagihanKasBendahara({ isOpen, onClose, tagihan }: DetailTagihanKasProps) {
  const { mutate: confirmPayment, isPending: isConfirming } = useConfirmPayment()

  const getStatusBadge = (status: TagihanKasDetail['status']) => {
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

  const handleClose = () => onClose()

  const handleConfirmPayment = () => {
    if (confirm('Apakah Anda yakin ingin mengonfirmasi pembayaran ini?')) {
      confirmPayment(tagihan.id, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const handleViewProof = () => {
    if (tagihan.paymentProofUrl) {
      window.open(tagihan.paymentProofUrl, '_blank')
    } else {
      toast.info('Bukti pembayaran tidak tersedia (atau belum diimplementasikan di backend)')
    }
  }

  const renderPaymentInfo = () => {
    // Show payment info if waiting confirmation OR already paid
    if (tagihan?.status === 'Menunggu Konfirmasi' || tagihan?.status === 'Sudah Dibayar') {
      const metode = tagihan?.metodePembayaran ?? 'cash'

      const metodeLabel =
        metode === 'bank' ? 'Bank Transfer' : metode === 'ewallet' ? 'E-Wallet' : 'Cash'

      return (
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Pembayaran Tagihan Kas</h3>
            <div className="space-y-3">
              <Label className="text-base font-medium">Metode Pembayaran</Label>
              <div className="flex items-center gap-3 rounded-lg border-3 border-blue-500 bg-blue-50 p-4">
                {metode === 'bank' && <Icons.Bank className="h-5 w-5 text-blue-500" />}
                {metode === 'ewallet' && <Icons.Wallet className="h-5 w-5 text-blue-500" />}
                {metode === 'cash' && <Icons.Money className="h-5 w-5 text-blue-500" />}
                <span className="font-medium text-gray-900">{metodeLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  const renderAdminActions = () => {
    switch (tagihan.status) {
      case 'Belum Dibayar':
        return (
          <div className="space-y-3">
            <p className="text-center text-gray-600 italic">
              Tagihan ini belum dibayar oleh {tagihan.name}.
            </p>
            <Button className="w-full" onClick={handleClose}>
              Tutup
            </Button>
          </div>
        )

      case 'Menunggu Konfirmasi':
        return (
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleViewProof}>
              <Upload className="mr-2 h-4 w-4" />
              Lihat Bukti Pembayaran
            </Button>
            <Button className="w-full" onClick={handleConfirmPayment} disabled={isConfirming}>
              {isConfirming ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </Button>
            <Button className="w-full" variant="outline" onClick={handleClose}>
              Tutup
            </Button>
          </div>
        )

      case 'Sudah Dibayar':
        return (
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleViewProof}>
              <Upload className="mr-2 h-4 w-4" />
              Lihat Bukti Pembayaran
            </Button>
            <Button className="w-full" onClick={handleClose}>
              Tutup
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-semibold">Detail Tagihan Kas</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informasi Tagihan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Informasi Tagihan</h3>
              {getStatusBadge(tagihan.status)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="font-medium">ID Tagihan:</Label>
                <span className="text-gray-600">{tagihan.billId}</span>
              </div>

              <div className="flex justify-between">
                <Label className="font-medium">Nama:</Label>
                <span className="text-gray-600">{tagihan.name}</span>
              </div>

              <div className="flex justify-between">
                <Label className="font-medium">Batas Waktu:</Label>
                <span className="text-gray-600">{tagihan.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Detail Tagihan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detail Tagihan</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Kas Kelas</span>
                <span>{formatCurrency(tagihan.kasKelas)}</span>
              </div>

              <div className="flex justify-between">
                <span>Biaya Admin</span>
                <span>{formatCurrency(tagihan.biayaAdmin)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(tagihan.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran (Hanya tampil jika sudah bayar / menunggu konfirmasi) */}
          {renderPaymentInfo()}

          {/* Aksi Admin */}
          {renderAdminActions()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
