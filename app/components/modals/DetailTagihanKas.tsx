'use client'

import { Copy, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { useCancelPayment, usePayBill } from '~/lib/queries/cash-bill.queries'
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
}

interface DetailTagihanKasProps {
  isOpen: boolean
  onClose: () => void
  tagihan: TagihanKasDetail
}

export function DetailTagihanKas({ isOpen, onClose, tagihan }: DetailTagihanKasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize payment method based on status - only auto-select for waiting confirmation
  const initialMethod = tagihan.status === 'Menunggu Konfirmasi' ? ('bank' as const) : undefined
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'ewallet' | 'bank' | 'cash' | undefined
  >(initialMethod)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { mutate: payBill, isPending: isPaying } = usePayBill()
  const { mutate: cancelPayment, isPending: isCanceling } = useCancelPayment()

  const handleUploadProof = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB')
        return
      }
      setPaymentProof(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveFile = () => {
    setPaymentProof(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      toast.error('Pilih metode pembayaran terlebih dahulu')
      return
    }
    // Only require proof if it's NOT cash (or based on business logic)
    // Assuming proof is required for bank/ewallet
    if (selectedPaymentMethod !== 'cash' && !paymentProof) {
      toast.error('Upload bukti pembayaran terlebih dahulu')
      return
    }

    payBill(
      {
        billId: tagihan.id,
        data: {
          paymentMethod: selectedPaymentMethod,
          paymentProof: paymentProof!, // Non-null assertion safe if check passed
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const handleCancelPayment = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan pembayaran ini?')) {
      cancelPayment(tagihan.id, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const handleClose = () => {
    onClose()
  }

  const handleViewProof = () => {
    // In a real app, this would open the uploaded proof URL
    // Since we don't have the URL in the summarized tagihan object here,
    // we would generally need to fetch the detail or pass it in.
    toast.info('Fitur lihat bukti pembayaran belum tersedia di demo ini')
  }

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

  const handleCopyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber)
    toast.success('Nomor rekening disalin')
  }

  const handlePaymentMethodSelect = (method: 'ewallet' | 'bank' | 'cash') => {
    setSelectedPaymentMethod(method)
  }

  const renderPaymentMethods = () => {
    if (tagihan.status === 'Sudah Dibayar') {
      return null
    }

    // For "Menunggu Konfirmasi" status, auto-select bank and show only bank option
    const isWaitingConfirmation = tagihan.status === 'Menunggu Konfirmasi'
    const showBankOnly = isWaitingConfirmation

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Pembayaran Tagihan Kas</h3>
          <div className="space-y-3">
            <Label className="text-base font-medium">Metode Pembayaran</Label>

            {/* Bank Option - Always show, auto-selected for waiting confirmation */}
            <button
              onClick={() => !isWaitingConfirmation && handlePaymentMethodSelect('bank')}
              disabled={isWaitingConfirmation}
              className={`flex w-full items-center gap-3 rounded-lg border-3 p-4 text-left transition-colors ${
                selectedPaymentMethod === 'bank' || isWaitingConfirmation
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-900 hover:border-blue-500 hover:bg-blue-50'
              } ${isWaitingConfirmation ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <Icons.Bank
                className={`h-5 w-5 ${selectedPaymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-900'}`}
              />
              <span
                className={`font-medium ${selectedPaymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-900'}`}
              >
                Bank
              </span>
            </button>

            {!showBankOnly && (
              <>
                {/* E-Wallet Option */}
                <button
                  onClick={() => handlePaymentMethodSelect('ewallet')}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border-3 p-4 text-left transition-colors ${
                    selectedPaymentMethod === 'ewallet'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-900 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Icons.Wallet
                    className={`h-5 w-5 ${selectedPaymentMethod === 'ewallet' ? 'text-blue-500' : 'text-gray-900'}`}
                  />
                  <span
                    className={`font-medium ${selectedPaymentMethod === 'ewallet' ? 'text-blue-500' : 'text-gray-900'}`}
                  >
                    E-Wallet
                  </span>
                </button>

                {/* Cash Option */}
                <button
                  onClick={() => handlePaymentMethodSelect('cash')}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border-3 p-4 text-left transition-colors ${
                    selectedPaymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-900 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Icons.Money
                    className={`h-5 w-5 ${selectedPaymentMethod === 'cash' ? 'text-blue-500' : 'text-gray-900'}`}
                  />
                  <span
                    className={`font-medium ${selectedPaymentMethod === 'cash' ? 'text-blue-500' : 'text-gray-900'}`}
                  >
                    Cash
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bank Account Details - Show when bank is selected or waiting for confirmation */}
        {(selectedPaymentMethod === 'bank' || isWaitingConfirmation) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-500 p-4">
              <div>
                <p className="font-medium">Bank Mandiri a.n Fathya Khairani R</p>
                <p className="text-sm text-gray-500">123-456-789-000</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAccountNumber('123-456-789-000')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-500 p-4">
              <div>
                <p className="font-medium">Bank Mandiri a.n Careal Alif Mafazi</p>
                <p className="text-sm text-gray-500">123-456-789-000</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAccountNumber('123-456-789-000')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* E-Wallet Account Details - Show when e-wallet is selected */}
        {selectedPaymentMethod === 'ewallet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">GoPay - Fathya Khairani R</p>
                <p className="text-sm text-gray-500">0812-3456-7890</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAccountNumber('0812-3456-7890')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">OVO - Careal Alif Mafazi</p>
                <p className="text-sm text-gray-500">0856-7890-1234</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAccountNumber('0856-7890-1234')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">DANA - Fathya Khairani R</p>
                <p className="text-sm text-gray-500">0821-9876-5432</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAccountNumber('0821-9876-5432')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {tagihan.status === 'Belum Dibayar' && (
            <>
              <Button variant="outline" className="w-full" onClick={handleUploadProof}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Bukti Pembayaran
              </Button>
              <Button className="w-full" onClick={handlePayNow} disabled={isPaying || isCanceling}>
                {isPaying ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </>
          )}

          {tagihan.status === 'Menunggu Konfirmasi' && (
            <>
              <Button variant="outline" className="w-full" onClick={handleViewProof}>
                <Upload className="mr-2 h-4 w-4" />
                Lihat Bukti Pembayaran
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleCancelPayment}
                disabled={isPaying || isCanceling}
              >
                {isCanceling ? 'Membatalkan...' : 'Batalkan Pembayaran'}
              </Button>
              <Button className="w-full" onClick={handleClose}>
                Tutup
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderPaidStatus = () => {
    if (tagihan.status !== 'Sudah Dibayar') {
      return null
    }

    return (
      <div className="space-y-4">
        <Button variant="outline" className="w-full" onClick={handleViewProof}>
          <Upload className="mr-2 h-4 w-4" />
          Lihat Bukti Pembayaran
        </Button>
        <Button className="w-full" onClick={handleClose}>
          Tutup
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-semibold">Detail Tagihan Kas</DialogTitle>
        </DialogHeader>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="space-y-6">
          {/* Bill Information */}
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

          {/* Bill Details */}
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

          {/* Payment Methods or Paid Status */}
          {renderPaymentMethods()}
          {renderPaidStatus()}

          {/* File Preview Section */}
          {paymentProof && (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{paymentProof.name}</p>
                    <p className="text-xs text-gray-500">
                      {(paymentProof.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
