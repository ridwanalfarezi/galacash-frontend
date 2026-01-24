import { useMemo, useState } from 'react'

import { CurrencyInput, FileUpload } from '~/components/form'
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
import { getTransactionCategoryOptions } from '~/lib/constants'
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
    category: '', // Starts empty to force selection
    amount: 0,
    attachment: null as File | null,
    attachmentPreview: '' as string,
  })

  // Get options based on selected type
  const categoryOptions = useMemo(
    () => getTransactionCategoryOptions(transaction.type),
    [transaction.type]
  )

  const createTransaction = useCreateTransaction()

  const handleFileChange = (file: File | null) => {
    if (file) {
      const previewUrl = file.type.startsWith('image') ? URL.createObjectURL(file) : ''
      setTransaction((prev) => ({ ...prev, attachment: file, attachmentPreview: previewUrl }))
    } else {
      if (transaction.attachmentPreview) {
        URL.revokeObjectURL(transaction.attachmentPreview)
      }
      setTransaction((prev) => ({ ...prev, attachment: null, attachmentPreview: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!transaction.purpose || !transaction.amount || !transaction.category) {
      return
    }

    await createTransaction.mutateAsync({
      date: transaction.date,
      description: transaction.purpose,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      attachment: transaction.attachment || undefined,
    })

    // Reset form and close
    setTransaction({
      date: new Date().toISOString(),
      purpose: '',
      type: 'income',
      category: '',
      amount: 0,
      attachment: null,
      attachmentPreview: '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-0 sm:max-w-150"
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
                  setTransaction((prev) => ({
                    ...prev,
                    type: value as 'income' | 'expense',
                    category: '', // Reset category on type change
                  }))
                }
              >
                <SelectTrigger className="w-full rounded-md border-2 border-gray-500 py-4.5 text-base focus:border-gray-900">
                  <SelectValue placeholder="Pilih Tipe" />
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
              <Label className="text-lg font-normal sm:text-xl">Kategori</Label>
              <Select
                value={transaction.category}
                onValueChange={(value) => setTransaction((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-full rounded-md border-2 border-gray-500 py-4.5 text-base focus:border-gray-900">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Nominal</Label>
            <CurrencyInput
              value={transaction.amount}
              onValueChange={(value) => setTransaction((prev) => ({ ...prev, amount: value }))}
              placeholder="Rp 0"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Lampiran</Label>
            <FileUpload
              file={transaction.attachment}
              previewUrl={transaction.attachmentPreview}
              onChange={handleFileChange}
              label="Upload Bukti Transaksi"
            />
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
                  !transaction.purpose ||
                  !transaction.amount ||
                  !transaction.category ||
                  createTransaction.isPending
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
