'use client'
import { ArrowDown, ArrowUp, ArrowUpDown, Check, X } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export interface SortOption {
  id: string
  label: string
  field: string
  direction: 'asc' | 'desc'
  category: string
}

interface SortDropdownProps {
  currentSort: SortOption | null
  onSortChange: (sortOption: SortOption | null) => void
  trigger?: React.ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}

const sortOptions: SortOption[] = [
  {
    id: 'date-newest',
    label: 'Tanggal Terbaru',
    field: 'date',
    direction: 'desc',
    category: 'Tanggal',
  },
  {
    id: 'date-oldest',
    label: 'Tanggal Terlama',
    field: 'date',
    direction: 'asc',
    category: 'Tanggal',
  },
  {
    id: 'amount-highest',
    label: 'Nominal Tertinggi',
    field: 'amount',
    direction: 'desc',
    category: 'Nominal',
  },
  {
    id: 'amount-lowest',
    label: 'Nominal Terendah',
    field: 'amount',
    direction: 'asc',
    category: 'Nominal',
  },
  {
    id: 'purpose-a-z',
    label: 'Keperluan: A ke Z',
    field: 'purpose',
    direction: 'asc',
    category: 'Keperluan',
  },
  {
    id: 'purpose-z-a',
    label: 'Keperluan: Z ke A',
    field: 'purpose',
    direction: 'desc',
    category: 'Keperluan',
  },
  {
    id: 'category-a-z',
    label: 'Kategori: A ke Z',
    field: 'category',
    direction: 'asc',
    category: 'Kategori',
  },
  {
    id: 'category-z-a',
    label: 'Kategori: Z ke A',
    field: 'category',
    direction: 'desc',
    category: 'Kategori',
  },
  {
    id: 'status-a-z',
    label: 'Status: A ke Z',
    field: 'status',
    direction: 'asc',
    category: 'Status',
  },
  {
    id: 'status-z-a',
    label: 'Status: Z ke A',
    field: 'status',
    direction: 'desc',
    category: 'Status',
  },
  {
    id: 'applicant-a-z',
    label: 'Pengaju: A ke Z',
    field: 'applicant',
    direction: 'asc',
    category: 'Pengaju',
  },
  {
    id: 'applicant-z-a',
    label: 'Pengaju: Z ke A',
    field: 'applicant',
    direction: 'desc',
    category: 'Pengaju',
  },
]

const groupedSortOptions = sortOptions.reduce(
  (acc, option) => {
    if (!acc[option.category]) acc[option.category] = []
    acc[option.category].push(option)
    return acc
  },
  {} as Record<string, SortOption[]>
)

export function SortDropdown({
  currentSort,
  onSortChange,
  trigger,
  align = 'end',
  className,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSortSelect = (optionId: string) => {
    const option = sortOptions.find((opt) => opt.id === optionId)
    if (option) onSortChange(option)
    setIsOpen(false)
  }

  const handleClearSort = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSortChange(null)
    setIsOpen(false)
  }

  const getSortIcon = (direction: 'asc' | 'desc') =>
    direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />

  const defaultTrigger = (
    <Button
      variant={currentSort ? 'default' : 'outline'}
      size="sm"
      className={`${
        currentSort ? 'bg-blue-700 text-white hover:bg-blue-700' : ''
      } flex items-center gap-2 transition-all duration-200`}
    >
      <ArrowUpDown className="h-4 w-4" />
      {currentSort ? (
        <span className="flex items-center gap-1">
          Sort: {currentSort.category}
          {getSortIcon(currentSort.direction)}
        </span>
      ) : (
        'Sort'
      )}
      {currentSort && (
        <Badge className="ml-1 h-5 bg-white px-1.5 py-0.5 text-xs text-blue-600">1</Badge>
      )}
    </Button>
  )

  // Bagi ke dua kolom
  const leftCategories = ['Tanggal', 'Nominal', 'Keperluan']
  const rightCategories = Object.keys(groupedSortOptions).filter(
    (cat) => !leftCategories.includes(cat)
  )

  const leftColumnData = leftCategories.map((cat) => [cat, groupedSortOptions[cat]] as const)
  const rightColumnData = rightCategories.map((cat) => [cat, groupedSortOptions[cat]] as const)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className={className}>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-lg p-2">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Urutkan Data</span>
          {currentSort && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSort}
              className="h-6 px-2 text-xs hover:bg-red-50 hover:text-red-600"
            >
              <X className="mr-1 h-3 w-3" />
              Reset
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[leftColumnData, rightColumnData].map((columnData, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {columnData.map(([category, options], idx) => (
                <div key={category}>
                  <DropdownMenuLabel className="bg-gray-50 px-2 py-1.5 text-sm font-medium text-gray-500">
                    {category}
                  </DropdownMenuLabel>
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => handleSortSelect(option.id)}
                      className={`hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between py-2.5 transition-colors ${
                        currentSort?.id === option.id ? 'bg-blue-50 text-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{option.label.replace(`${category}: `, '')}</span>
                        {getSortIcon(option.direction)}
                      </div>
                      {currentSort?.id === option.id && <Check className="h-4 w-4 text-blue-500" />}
                    </DropdownMenuItem>
                  ))}
                  {idx < columnData.length - 1 && <DropdownMenuSeparator />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
