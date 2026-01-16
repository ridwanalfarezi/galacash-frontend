'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, X } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

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
import { fundApplicationQueries } from '~/lib/queries/fund-application.queries'
import { fundApplicationService } from '~/lib/services/fund-application.service'

interface BuatAjuDanaModalProps {
  isOpen: boolean
  onClose: () => void
}

type Category = 'education' | 'health' | 'emergency' | 'equipment'

export function BuatAjuDanaModal({ isOpen, onClose }: BuatAjuDanaModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    category: '' as Category | '',
    amount: '',
    attachment: null as File | null,
    attachmentPreview: '' as string,
  })

  const parsedAmount = useMemo(() => {
    const numeric = formData.amount.replace(/[^0-9]/g, '')
    return numeric ? Number(numeric) : 0
  }, [formData.amount])

  const createApplication = useMutation({
    mutationFn: async () => {
      if (!formData.purpose || !formData.category || parsedAmount <= 0) {
        throw new Error('Lengkapi keperluan, kategori, dan nominal yang valid')
      }
      return fundApplicationService.createApplication({
        purpose: formData.purpose,
        category: formData.category as Category,
        amount: parsedAmount,
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
        amount: '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = file.type.startsWith('image') ? URL.createObjectURL(file) : ''
      setFormData((prev) => ({ ...prev, attachment: file, attachmentPreview: previewUrl }))
    }
  }

  const clearAttachment = () => {
    if (formData.attachmentPreview) {
      URL.revokeObjectURL(formData.attachmentPreview)
    }
    setFormData((prev) => ({ ...prev, attachment: null, attachmentPreview: '' }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl border-0 sm:max-w-150"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader>
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
                  setFormData((prev) => ({ ...prev, category: value as Category }))
                }
              >
                <SelectTrigger className="w-full rounded-md border-2 border-gray-500 py-4.5 text-base focus:border-gray-900">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Pendidikan</SelectItem>
                  <SelectItem value="health">Kesehatan</SelectItem>
                  <SelectItem value="emergency">Darurat</SelectItem>
                  <SelectItem value="equipment">Peralatan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="amount" className="text-lg font-normal sm:text-xl">
                Nominal
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="Rp 99.999.999"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Hanya angka, tanpa titik/koma</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="attachment" className="text-lg font-normal sm:text-xl">
                Lampiran
              </Label>
              <div className="relative">
                <Input id="attachment" type="file" onChange={handleFileChange} className="hidden" />
                <Label
                  htmlFor="attachment"
                  className="flex w-full cursor-pointer items-center justify-between rounded-md border-2 border-gray-500 px-3 py-2 text-base focus-within:border-gray-900 hover:bg-gray-50"
                >
                  <span className={formData.attachment ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.attachment ? formData.attachment.name : 'Upload File'}
                  </span>
                  <Upload className="h-6 w-6 text-gray-900" />
                </Label>
              </div>
            </div>
            {formData.attachment && (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  {formData.attachmentPreview ? (
                    <img
                      src={formData.attachmentPreview}
                      alt="Lampiran"
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-sm text-gray-600">
                      File
                    </div>
                  )}
                  <div className="space-y-0.5 text-sm">
                    <p className="font-medium text-gray-900">{formData.attachment.name}</p>
                    <p className="text-gray-500">
                      {(formData.attachment.size / 1024).toFixed(1)} KB
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
                disabled={createApplication.isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="sm:flex-1 sm:px-10"
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
