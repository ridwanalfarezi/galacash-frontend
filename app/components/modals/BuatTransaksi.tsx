'use client'

import { Upload, X } from 'lucide-react'
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
import { useCreateTransaction } from '~/lib/queries/bendahara.queries'

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
    attachmentPreview: '' as string,
  })

  const createTransaction = useCreateTransaction()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = file.type.startsWith('image') ? URL.createObjectURL(file) : ''
      setTransaction((prev) => ({ ...prev, attachment: file, attachmentPreview: previewUrl }))
    }
  }

  const clearAttachment = () => {
    if (transaction.attachmentPreview) {
      URL.revokeObjectURL(transaction.attachmentPreview)
    }
    setTransaction((prev) => ({ ...prev, attachment: null, attachmentPreview: '' }))
  }

  const handleSubmit = async () => {
    if (!transaction.purpose || !transaction.amount) {
      return
    }

    await createTransaction.mutateAsync({
      date: transaction.date,
      description: transaction.purpose,
      type: transaction.type,
      amount: transaction.amount,
      category: 'other',
      attachment: transaction.attachment || undefined,
    })

    // Reset form and close
    setTransaction({
      date: new Date().toISOString(),
      purpose: '',
      type: 'income',
      amount: 0,
      attachment: null,
      attachmentPreview: '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl border-0 sm:max-w-150"
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
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Rp 99.999.999"
                  value={
                    transaction.amount ? `Rp ${transaction.amount.toLocaleString('id-ID')}` : ''
                  }
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/[^0-9]/g, '')
                    setTransaction((prev) => ({
                      ...prev,
                      amount: numeric === '' ? 0 : Number(numeric),
                    }))
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
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
            {transaction.attachment && (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  {transaction.attachmentPreview ? (
                    <img
                      src={transaction.attachmentPreview}
                      alt="Lampiran"
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-sm text-gray-600">
                      File
                    </div>
                  )}
                  <div className="space-y-0.5 text-sm">
                    <p className="font-medium text-gray-900">{transaction.attachment.name}</p>
                    <p className="text-gray-500">
                      {(transaction.attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearAttachment}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex w-full border-t pt-6 sm:justify-end">
            <div className="flex w-full gap-2 sm:w-fit">
              <Button
                type="button"
                variant="secondary"
                className="sm:flex-1 sm:px-10"
                onClick={onClose}
                disabled={createTransaction.isPending}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !transaction.purpose || !transaction.amount || createTransaction.isPending
                }
                className="sm:flex-1 sm:px-10"
              >
                {createTransaction.isPending ? 'Menambahkan...' : 'Tambahkan'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
