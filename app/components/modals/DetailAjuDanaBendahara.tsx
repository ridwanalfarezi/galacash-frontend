'use client'

import { useQuery } from '@tanstack/react-query'
import { File } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  bendaharaQueries,
  useApproveFundApplication,
  useRejectFundApplication,
} from '~/lib/queries/bendahara.queries'
import { formatCurrency, getFilenameFromUrl } from '~/lib/utils'

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
  const { data: detailData } = useQuery(bendaharaQueries.fundApplicationDetail(application.id))
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  const approveMutation = useApproveFundApplication()
  const rejectMutation = useRejectFundApplication()

  const handleOpenAttachment = (e: React.MouseEvent) => {
    e.stopPropagation()
    const attachmentUrl = detailData?.attachmentUrl || application.attachment
    if (attachmentUrl) {
      window.open(attachmentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleApprove = async () => {
    if (application.status !== 'pending') {
      toast.error('Hanya pengajuan dengan status pending yang bisa disetujui')
      return
    }

    try {
      await approveMutation.mutateAsync(application.id)
      onClose()
    } catch (error) {
      // Error is already handled by mutation
      console.error(error)
    }
  }

  const handleReject = async () => {
    if (application.status !== 'pending') {
      toast.error('Hanya pengajuan dengan status pending yang bisa ditolak')
      return
    }

    if (!showRejectInput) {
      setShowRejectInput(true)
      return
    }

    if (!rejectionReason.trim()) {
      toast.error('Alasan penolakan harus diisi')
      return
    }

    try {
      await rejectMutation.mutateAsync({ id: application.id, rejectionReason })
      setShowRejectInput(false)
      setRejectionReason('')
      onClose()
    } catch (error) {
      // Error is already handled by mutation
      console.error(error)
    }
  }

  const handleCancelReject = () => {
    setShowRejectInput(false)
    setRejectionReason('')
  }

  const isProcessing = approveMutation.isPending || rejectMutation.isPending
  const isPending = application.status === 'pending'

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
                detailData?.attachmentUrl || application.attachment
                  ? 'cursor-pointer border-gray-500 hover:border-blue-500 hover:bg-blue-50'
                  : 'cursor-default border-gray-300 bg-gray-100'
              }`}
            >
              <span
                className={`truncate ${
                  detailData?.attachmentUrl || application.attachment
                    ? 'text-gray-900 hover:text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {detailData?.attachmentUrl
                  ? getFilenameFromUrl(detailData.attachmentUrl)
                  : application.attachment
                    ? getFilenameFromUrl(application.attachment)
                    : 'Tidak ada lampiran'}
              </span>
              <File
                className={`h-5 w-5 ${
                  detailData?.attachmentUrl || application.attachment
                    ? 'text-gray-900 hover:text-blue-600'
                    : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          {showRejectInput && (
            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Alasan Penolakan</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Masukkan alasan penolakan..."
                rows={3}
                disabled={isProcessing}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            {showRejectInput ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelReject}
                  disabled={isProcessing}
                  className="border-gray-300"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="bg-red-700 text-white hover:bg-red-800"
                >
                  {rejectMutation.isPending ? 'Memproses...' : 'Konfirmasi Tolak'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing || !isPending}
                  className="bg-red-700 text-white hover:bg-red-800 disabled:bg-gray-400"
                >
                  {!isPending ? 'Sudah Diproses' : 'Tolak'}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing || !isPending}
                  className="bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-400"
                >
                  {approveMutation.isPending
                    ? 'Memproses...'
                    : !isPending
                      ? 'Sudah Diproses'
                      : 'Terima'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
