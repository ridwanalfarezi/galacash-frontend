'use client'

import { Upload } from 'lucide-react'
import { useState } from 'react'

import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { SingleDatePicker } from '~/components/ui/single-date-picker'
import { formatCurrency } from '~/lib/utils'

interface BuatTransaksiProps {
  isOpen: boolean
  onClose: () => void
}

export function BuatTransaksi({ isOpen, onClose }: BuatTransaksiProps) {
  const [transaction, setTransaction] = useState({
    date: new Date().toISOString(),
    purpose: '',
    type: 'income' as 'income' | 'expense',
    amount: 0,
    attachment: null as File | null,
  })

  // Keep a separate editable amount string to allow typing
  const [amountInput, setAmountInput] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTransaction((prev) => ({ ...prev, attachment: file }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-[600px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="flex-row items-center gap-4">
          <DialogTitle className="text-2xl font-semibold sm:text-3xl">Buat Transaksi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Tanggal</Label>
            <SingleDatePicker
              className="w-full justify-start"
              date={transaction.date ? new Date(transaction.date) : undefined}
              onChange={(date) => {
                setTransaction((prev) => ({
                  ...prev,
                  date: date?.toISOString() || prev.date,
                }))
              }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Keperluan</Label>
            <Input
              value={transaction.purpose}
              placeholder="Masukkan keperluan"
              onChange={(e) => setTransaction((prev) => ({ ...prev, purpose: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Tipe</Label>
              <Select
                value={transaction.type}
                onValueChange={(value) =>
                  setTransaction((prev) => ({ ...prev, type: value as 'income' | 'expense' }))
                }
              >
                <SelectTrigger className="w-full rounded-md border-2 border-gray-500 py-4.5 text-base focus:border-gray-900">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">
                    <Icons.ArrowDownCircle className="h-5 w-5 text-green-600" />
                    Pemasukan
                  </SelectItem>
                  <SelectItem value="expense">
                    <Icons.ArrowUpCircle className="h-5 w-5 text-red-800" />
                    Pengeluaran
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-normal sm:text-xl">Nominal</Label>
              <Input
                inputMode="numeric"
                placeholder="0"
                value={amountInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d]/g, '')
                  setAmountInput(raw)
                  setTransaction((prev) => ({
                    ...prev,
                    amount: Number(raw || 0),
                  }))
                }}
                onBlur={() => {
                  // Show formatted when leaving field
                  setAmountInput(transaction.amount ? formatCurrency(transaction.amount) : '')
                }}
                onFocus={() => {
                  // Show raw number when focusing
                  setAmountInput(transaction.amount ? String(transaction.amount) : '')
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Lampiran</Label>
            <div className="relative">
              <Input type="file" onChange={handleFileChange} className="hidden" id="attachment" />
              <Label
                htmlFor="attachment"
                className="flex w-full cursor-pointer items-center justify-between rounded-md border-2 border-gray-500 px-3 py-2 text-base focus-within:border-gray-900 hover:bg-gray-50"
              >
                <span className={transaction.attachment ? 'text-gray-900' : 'text-gray-500'}>
                  {transaction.attachment ? transaction.attachment.name : 'Upload File'}
                </span>
                <Upload className="h-6 w-6 text-gray-900" />
              </Label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="px-10 py-2">
              Tambahkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
