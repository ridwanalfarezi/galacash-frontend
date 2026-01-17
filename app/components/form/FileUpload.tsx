import { Upload, X } from 'lucide-react'
import * as React from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

interface FileUploadProps {
  id?: string
  label?: string
  file: File | null
  previewUrl?: string
  accept?: string
  onChange: (file: File | null) => void
  className?: string
}

export function FileUpload({
  id = 'file-upload',
  label = 'Upload File',
  file,
  previewUrl,
  accept,
  onChange,
  className,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    onChange(selectedFile)
  }

  const clearFile = () => {
    onChange(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input id={id} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        <Label
          htmlFor={id}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-md border-2 border-gray-500 px-3 py-2 text-base focus-within:border-gray-900 hover:bg-gray-50',
            !file && 'text-gray-500',
            file && 'text-gray-900'
          )}
        >
          <span>{file ? file.name : label}</span>
          <Upload className="h-6 w-6 text-gray-900" />
        </Label>
      </div>

      {file && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-12 w-12 rounded-md object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-sm text-gray-600">
                File
              </div>
            )}
            <div className="space-y-0.5 text-sm">
              <p className="line-clamp-1 font-medium text-gray-900">{file.name}</p>
              <p className="text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile} type="button">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
