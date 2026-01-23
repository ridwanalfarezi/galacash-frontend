'use client'

import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '~/components/ui/collapsible'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Slider } from '~/components/ui/slider'

export interface FilterState {
  status: string[]
  applicants: string[]
  categories: string[]
  amountRange: [number, number]
}

interface FilterComponentProps {
  currentFilters: FilterState
  onFilterChange: (filters: FilterState) => void
  applicants: string[]
  categories: string[]
  maxAmount: number
  className?: string
  trigger?: React.ReactNode
}

const statusOptions = [
  { id: 'approved', label: 'Diterima', color: 'bg-green-50 text-green-700' },
  { id: 'rejected', label: 'Ditolak', color: 'bg-red-50 text-red-700' },
  { id: 'pending', label: 'Menunggu', color: 'bg-yellow-300 text-yellow-700' },
]

type ExpandedSections = {
  status: boolean
  applicants: boolean
  categories: boolean
  amount: boolean
}

interface FilterContentProps {
  localFilters: FilterState
  expandedSections: ExpandedSections
  toggleSection: (section: keyof ExpandedSections) => void
  handleStatusChange: (statusId: string, checked: boolean) => void
  handleApplicantChange: (applicant: string, checked: boolean) => void
  handleCategoryChange: (category: string, checked: boolean) => void
  handleFilterChange: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void
  formatCurrency: (amount: number) => string
  applicants: string[]
  categories: string[]
  maxAmount: number
}

function FilterContent({
  localFilters,
  expandedSections,
  toggleSection,
  handleStatusChange,
  handleApplicantChange,
  handleCategoryChange,
  handleFilterChange,
  formatCurrency,
  applicants,
  categories,
  maxAmount,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('status')}>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Status</span>
            {expandedSections.status ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        <Collapsible open={expandedSections.status}>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {statusOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.id}`}
                    checked={localFilters.status.includes(option.id)}
                    onCheckedChange={(checked) => handleStatusChange(option.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`status-${option.id}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <span className="text-sm">{option.label}</span>
                    <Badge variant="secondary" className={`${option.color} text-xs`}>
                      {option.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Applicants Filter */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('applicants')}>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Pengaju</span>
            {expandedSections.applicants ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        <Collapsible open={expandedSections.applicants}>
          <CollapsibleContent>
            <CardContent>
              <div className="max-h-48 space-y-3 overflow-y-auto">
                {applicants.map((applicant) => (
                  <div key={applicant} className="flex items-center space-x-2">
                    <Checkbox
                      id={`applicant-${applicant}`}
                      checked={localFilters.applicants.includes(applicant)}
                      onCheckedChange={(checked) =>
                        handleApplicantChange(applicant, checked as boolean)
                      }
                    />
                    <Label htmlFor={`applicant-${applicant}`} className="flex-1 cursor-pointer">
                      <span className="text-sm">{applicant}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Categories Filter */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('categories')}>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Kategori</span>
            {expandedSections.categories ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        <Collapsible open={expandedSections.categories}>
          <CollapsibleContent>
            <CardContent>
              <div className="max-h-48 space-y-3 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={localFilters.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category}`} className="flex-1 cursor-pointer">
                      <span className="text-sm">{category}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Amount Range Filter */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('amount')}>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Rentang Jumlah</span>
            {expandedSections.amount ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        <Collapsible open={expandedSections.amount}>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Minimum</span>
                  <span className="font-medium">
                    Rp {formatCurrency(localFilters.amountRange[0])}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Maksimum</span>
                  <span className="font-medium">
                    Rp {formatCurrency(localFilters.amountRange[1])}
                  </span>
                </div>
              </div>

              <Slider
                value={localFilters.amountRange}
                onValueChange={(value) =>
                  handleFilterChange('amountRange', value as [number, number])
                }
                min={0}
                max={maxAmount}
                step={1000}
                className="w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-amount" className="text-xs">
                    Min
                  </Label>
                  <Input
                    id="min-amount"
                    type="number"
                    value={localFilters.amountRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (value >= 0 && value <= localFilters.amountRange[1]) {
                        handleFilterChange('amountRange', [value, localFilters.amountRange[1]])
                      }
                    }}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-amount" className="text-xs">
                    Max
                  </Label>
                  <Input
                    id="max-amount"
                    type="number"
                    value={localFilters.amountRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (value <= maxAmount && value >= localFilters.amountRange[0]) {
                        handleFilterChange('amountRange', [localFilters.amountRange[0], value])
                      }
                    }}
                    className="h-9"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}

export function FilterComponent({
  currentFilters,
  onFilterChange,
  applicants,
  categories,
  maxAmount,
  className,
  trigger,
}: FilterComponentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    applicants: true,
    categories: true,
    amount: true,
  })

  const hasActiveFilters =
    currentFilters.status.length > 0 ||
    currentFilters.applicants.length > 0 ||
    currentFilters.categories.length > 0 ||
    currentFilters.amountRange[0] > 0 ||
    currentFilters.amountRange[1] < maxAmount

  const activeFilterCount =
    currentFilters.status.length +
    currentFilters.applicants.length +
    currentFilters.categories.length +
    (currentFilters.amountRange[0] > 0 || currentFilters.amountRange[1] < maxAmount ? 1 : 0)

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleStatusChange = (statusId: string, checked: boolean) => {
    const newStatus = checked
      ? [...localFilters.status, statusId]
      : localFilters.status.filter((s) => s !== statusId)
    handleFilterChange('status', newStatus)
  }

  const handleApplicantChange = (applicant: string, checked: boolean) => {
    const newApplicants = checked
      ? [...localFilters.applicants, applicant]
      : localFilters.applicants.filter((a) => a !== applicant)
    handleFilterChange('applicants', newApplicants)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...localFilters.categories, category]
      : localFilters.categories.filter((c) => c !== category)
    handleFilterChange('categories', newCategories)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant={hasActiveFilters ? 'default' : 'secondary'}
            className={`${className} ${
              hasActiveFilters ? 'bg-blue-500 text-white hover:bg-blue-700' : ''
            } relative`}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 min-w-5 bg-white px-1.5 py-0.5 text-xs text-blue-500">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto border-l px-6 py-6">
        <SheetHeader className="mb-4 p-0">
          <SheetTitle className="text-2xl">Filter Pengajuan Dana</SheetTitle>
        </SheetHeader>
        <FilterContent
          localFilters={localFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          handleStatusChange={handleStatusChange}
          handleApplicantChange={handleApplicantChange}
          handleCategoryChange={handleCategoryChange}
          handleFilterChange={handleFilterChange}
          formatCurrency={formatCurrency}
          applicants={applicants}
          categories={categories}
          maxAmount={maxAmount}
        />
      </SheetContent>
    </Sheet>
  )
}
