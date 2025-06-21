'use client'

import type React from 'react'

import { Upload } from 'lucide-react'
import { useState } from 'react'
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

interface BuatAjuDanaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BuatAjuDanaModal({ isOpen, onClose }: BuatAjuDanaModalProps) {
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    category: '',
    amount: '',
    attachment: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, attachment: file }))
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl border-0 sm:max-w-[600px]"
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
              placeholder="Lorem ipsum dolor sit amet"
              value={formData.purpose}
              onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description" className="text-lg font-normal sm:text-xl">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              placeholder="Lorem ipsum dolor sit amet"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>{' '}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="category" className="text-lg font-normal sm:text-xl">
                Kategori
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
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
                  placeholder="Rp 99.999.999"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>
          </div>{' '}
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
          <div className="flex w-full border-t pt-6 sm:justify-end">
            <div className="flex w-full gap-2 sm:w-fit">
              <Button
                type="button"
                variant="outline"
                className="sm:flex-1 sm:px-10"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button type="submit" className="sm:flex-1 sm:px-10">
                Buat
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
