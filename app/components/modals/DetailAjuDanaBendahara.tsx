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

  const handleOpenAttachment = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (application.attachment) {
      window.open(application.attachment, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-150"
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
            <div
              onClick={handleOpenAttachment}
              className={`flex w-full items-center justify-between rounded-md border-2 px-3 py-2 transition-colors ${
                application.attachment
                  ? 'cursor-pointer border-gray-500 hover:border-blue-500 hover:bg-blue-50'
                  : 'cursor-default border-gray-300 bg-gray-100'
              }`}
            >
              <span
                className={`${
                  application.attachment ? 'text-gray-900 hover:text-blue-600' : 'text-gray-500'
                }`}
              >
                {application.attachment || 'Tidak ada lampiran'}
              </span>
              <File
                className={`h-5 w-5 ${
                  application.attachment ? 'text-gray-900 hover:text-blue-600' : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <div className="flex gap-2">
              <Button className="bg-red-700 text-white hover:bg-red-800">Tolak</Button>
              <Button className="bg-green-700 text-white hover:bg-green-800">Terima</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
