'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'

import { CurrencyInput, FileUpload } from '~/components/form'
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
import { Textarea } from '~/components/ui/textarea'
import { type FundCategoryKey, getFundCategoryOptions } from '~/lib/constants'
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { fundApplicationService } from '~/lib/services/fund-application.service'

interface BuatAjuDanaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BuatAjuDanaModal({ isOpen, onClose }: BuatAjuDanaModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    category: '' as FundCategoryKey | '',
    amount: 0,
    attachment: null as File | null,
    attachmentPreview: '' as string,
  })

  // Get dynamic options
  const categoryOptions = getFundCategoryOptions()

  const createApplication = useMutation({
    mutationFn: async () => {
      if (!formData.purpose || !formData.category || formData.amount <= 0) {
        throw new Error('Lengkapi keperluan, kategori, dan nominal yang valid')
      }
      return fundApplicationService.createApplication({
        purpose: formData.purpose,
        category: formData.category as FundCategoryKey,
        amount: formData.amount,
        description: formData.description || undefined,
        attachment: formData.attachment || undefined,
      })
    },
    onSuccess: () => {
      toast.success('Pengajuan dana berhasil dibuat')
      queryClient.invalidateQueries({ queryKey: fundApplicationQueries.my().queryKey })
      setFormData({
        purpose: '',
        description: '',
        category: '',
        amount: 0,
        attachment: null,
        attachmentPreview: '',
      })
      onClose()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Gagal membuat pengajuan dana'
      toast.error(message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createApplication.mutate()
  }

  const handleFileChange = (file: File | null) => {
    // Always revoke previous URL first to prevent memory leak
    if (formData.attachmentPreview) {
      URL.revokeObjectURL(formData.attachmentPreview)
    }

    if (file) {
      const previewUrl = file.type.startsWith('image') ? URL.createObjectURL(file) : ''
      setFormData((prev) => ({ ...prev, attachment: file, attachmentPreview: previewUrl }))
    } else {
      setFormData((prev) => ({ ...prev, attachment: null, attachmentPreview: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-0 sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold sm:text-3xl">Ajukan Dana</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-lg font-normal sm:text-xl">Keperluan</Label>
            <Input
              id="purpose"
              placeholder="Contoh: Pembelian buku referensi"
              value={formData.purpose}
              onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description" className="text-lg font-normal sm:text-xl">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              placeholder="Berikan detail penggunaan dana"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="category" className="text-lg font-normal sm:text-xl">
                Kategori
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value as FundCategoryKey }))
                }
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

            <div className="space-y-1">
              <Label htmlFor="amount" className="text-lg font-normal sm:text-xl">
                Nominal
              </Label>
              <CurrencyInput
                id="amount"
                value={formData.amount}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, amount: value }))}
                placeholder="Rp 0"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="attachment" className="text-lg font-normal sm:text-xl">
              Lampiran
            </Label>
            <FileUpload
              id="attachment"
              file={formData.attachment}
              previewUrl={formData.attachmentPreview}
              onChange={handleFileChange}
              label="Upload File Pendukung"
            />
          </div>
          <div className="flex w-full border-t pt-6 sm:justify-end">
            <div className="flex w-full gap-2 sm:w-fit">
              <Button
                type="button"
                variant="secondary"
                className="w-1/2 sm:flex-1 sm:px-10 md:w-auto"
                onClick={onClose}
                disabled={createApplication.isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="w-1/2 sm:flex-1 sm:px-10 md:w-auto"
                disabled={createApplication.isPending}
              >
                {createApplication.isPending ? 'Memproses...' : 'Buat'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
