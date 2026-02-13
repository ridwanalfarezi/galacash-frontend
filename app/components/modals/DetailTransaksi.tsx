'use client'

import { Calendar, File } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { TRANSACTION_CATEGORIES, type TransactionCategoryKey } from '~/lib/constants'
import { formatCurrency, getFilenameFromUrl } from '~/lib/utils'

interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
  category: string
  attachmentUrl?: string | null
}

const formatCategoryName = (category: string) => {
  if (category in TRANSACTION_CATEGORIES) {
    return TRANSACTION_CATEGORIES[category as TransactionCategoryKey].label
  }
  return category
}

interface DetailTransaksiProps {
  isOpen: boolean
  onClose: () => void
  transaction: HistoryTransaction
}

export function DetailTransaksi({ isOpen, onClose, transaction }: DetailTransaksiProps) {
  const handleOpenAttachment = () => {
    if (transaction.attachmentUrl) {
      window.open(transaction.attachmentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="flex-col gap-4 md:flex-row">
          <DialogTitle className="text-left text-2xl font-semibold">Detail Transaksi</DialogTitle>
          <div className="flex w-full items-center gap-2 rounded-lg border-2 border-gray-900 px-3 py-1 md:w-auto">
            <Calendar size={20} />
            <span className="">
              {new Date(transaction.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Keperluan</Label>
            <Input value={transaction.purpose} readOnly />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Tipe</Label>
              <Input value={transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} readOnly />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Kategori</Label>
              <Input value={formatCategoryName(transaction.category)} readOnly />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Nominal</Label>
            <Input value={formatCurrency(transaction.amount)} readOnly />
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Lampiran</Label>
            <div
              onClick={handleOpenAttachment}
              className={`flex w-full items-center justify-between rounded-md border-2 px-3 py-2 transition-colors ${
                transaction.attachmentUrl
                  ? 'cursor-pointer border-gray-500 hover:border-blue-500 hover:bg-blue-50'
                  : 'cursor-default border-gray-300 bg-gray-100'
              }`}
            >
              <span
                className={`truncate ${
                  transaction.attachmentUrl ? 'text-gray-900 hover:text-blue-600' : 'text-gray-500'
                }`}
              >
                {transaction.attachmentUrl
                  ? getFilenameFromUrl(transaction.attachmentUrl)
                  : 'Tidak ada lampiran'}
              </span>
              <File
                className={`h-5 w-5 ${
                  transaction.attachmentUrl ? 'text-gray-900 hover:text-blue-600' : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="w-full px-10 py-2 md:w-auto">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
