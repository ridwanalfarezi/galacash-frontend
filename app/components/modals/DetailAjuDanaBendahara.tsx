'use client'

import { File } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

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

interface DetailAjuDanaModalProps {
  isOpen: boolean
  onClose: () => void
  application: Application
}

export function DetailAjuDanaBendahara({ isOpen, onClose, application }: DetailAjuDanaModalProps) {
  const formatCurrency = (amount: number) => {
    return `Rp. ${amount.toLocaleString('id-ID')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-[600px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold sm:text-3xl">Detail Pengajuan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Keperluan</Label>
            <Input value={application.purpose} readOnly />
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Deskripsi</Label>
            <Textarea value={application.description || application.purpose} readOnly />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Kategori</Label>
              <Input value={application.category} readOnly />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Nominal</Label>
              <Input value={formatCurrency(application.amount)} readOnly />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Lampiran</Label>
            <div className="flex w-full items-center justify-between rounded-md border-2 border-gray-500 px-3 py-2">
              <span className="text-gray-900">
                {application.attachment || 'Photo_17082098_143209.png'}
              </span>
              <File className="h-5 w-5 text-gray-900" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button className="bg-red-100 text-red-900 hover:bg-red-200">Tolak</Button>
              <Button className="bg-green-100 text-green-900 hover:bg-green-200">Terima</Button>
            </div>
            <Button onClick={onClose} className="px-10 py-2">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
