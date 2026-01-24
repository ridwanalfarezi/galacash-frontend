'use client'

import { Calendar } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { formatCurrency } from '~/lib/utils'

interface HistoryTransaction {
  id: string
  date: string
  purpose: string
  type: 'income' | 'expense'
  amount: number
}

interface DetailTransaksiProps {
  isOpen: boolean
  onClose: () => void
  transaction: HistoryTransaction
}

export function DetailTransaksi({ isOpen, onClose, transaction }: DetailTransaksiProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="flex-row items-center gap-4">
          <DialogTitle className="text-2xl font-semibold sm:text-3xl">Detail Transaksi</DialogTitle>
          <div className="flex items-center gap-2 rounded-lg border-2 border-gray-900 px-3 py-1">
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
              <Label className="text-lg font-normal sm:text-xl">Nominal</Label>
              <Input value={formatCurrency(transaction.amount)} readOnly />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="px-10 py-2">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
