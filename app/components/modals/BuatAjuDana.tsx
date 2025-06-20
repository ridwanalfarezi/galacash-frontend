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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Ajukan Dana</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-base font-medium">
              Keperluan
            </Label>
            <Input
              id="purpose"
              placeholder="Lorem ipsum dolor sit amet"
              value={formData.purpose}
              onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              placeholder="Lorem ipsum dolor sit amet"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Kategori
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="h-12">
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

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">
                Nominal
              </Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                  Rp.
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="99.999.999"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="h-12 pl-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment" className="text-base font-medium">
              Lampiran
            </Label>
            <div className="relative">
              <Input id="attachment" type="file" onChange={handleFileChange} className="hidden" />
              <Label
                htmlFor="attachment"
                className="flex h-12 w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-gray-500">
                  {formData.attachment ? formData.attachment.name : 'Upload File'}
                </span>
                <Upload className="h-4 w-4 text-gray-400" />
              </Label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="h-12 bg-blue-600 px-8 py-2 text-base font-medium hover:bg-blue-700"
            >
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
