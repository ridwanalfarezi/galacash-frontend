'use client'

import { Download } from 'lucide-react'
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

export function DetailAjuDanaModal({ isOpen, onClose, application }: DetailAjuDanaModalProps) {
  const formatCurrency = (amount: number) => {
    return `Rp. ${amount.toLocaleString('id-ID')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Detail Pengajuan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">Keperluan</Label>
            <Input value={application.purpose} readOnly className="h-12 bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Deskripsi</Label>
            <Textarea
              value={application.description || application.purpose}
              readOnly
              className="min-h-[100px] resize-none bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base font-medium">Kategori</Label>
              <Input value={application.category} readOnly className="h-12 bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Nominal</Label>
              <Input
                value={formatCurrency(application.amount)}
                readOnly
                className="h-12 bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Lampiran</Label>
            <div className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
              <span className="text-gray-700">
                {application.attachment || 'Photo_17082098_143209.png'}
              </span>
              <Download className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              className="h-12 bg-blue-600 px-8 py-2 text-base font-medium hover:bg-blue-700"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
