'use client'

import { ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
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
  { id: 'pending', label: 'Pending', color: 'bg-yellow-300 text-yellow-700' },
]

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

  const handleFilterChange = (key: keyof FilterState, value: any) => {
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

  const handleClearAllFilters = () => {
    const clearedFilters = {
      status: [],
      applicants: [],
      categories: [],
      amountRange: [0, maxAmount] as [number, number],
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID')
  }

  const FilterContent = () => (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filter Data</h3>
          <p className="text-muted-foreground text-sm">
            Saring data sesuai kriteria yang diinginkan
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAllFilters}
            className="border-red-300 text-red-500 hover:bg-red-50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* FILTER SECTIONS */}
      <div className="space-y-4">
        <FilterSection
          title="Status"
          expanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
          badgeCount={localFilters.status.length > 0 ? localFilters.status.length : undefined}
        >
          {statusOptions.map((status) => (
            <CheckboxRow
              key={status.id}
              id={status.id}
              label={<Badge className={`${status.color} text-xs`}>{status.label}</Badge>}
              checked={localFilters.status.includes(status.id)}
              onChange={(checked) => handleStatusChange(status.id, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Pengaju"
          expanded={expandedSections.applicants}
          onToggle={() => toggleSection('applicants')}
          badgeCount={
            localFilters.applicants.length > 0 ? localFilters.applicants.length : undefined
          }
        >
          {applicants.map((applicant) => (
            <CheckboxRow
              key={applicant}
              id={applicant}
              label={applicant}
              checked={localFilters.applicants.includes(applicant)}
              onChange={(checked) => handleApplicantChange(applicant, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Kategori"
          expanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
          badgeCount={
            localFilters.categories.length > 0 ? localFilters.categories.length : undefined
          }
        >
          {categories.map((category) => (
            <CheckboxRow
              key={category}
              id={category}
              label={category}
              checked={localFilters.categories.includes(category)}
              onChange={(checked) => handleCategoryChange(category, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Rentang Nominal"
          expanded={expandedSections.amount}
          onToggle={() => toggleSection('amount')}
          badgeCount={
            localFilters.amountRange[0] > 0 || localFilters.amountRange[1] < maxAmount ? 1 : 0
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Minimum</Label>
                <Input
                  placeholder="Rp 0"
                  value={`Rp ${formatCurrency(localFilters.amountRange[0])}`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^\d]/g, '')) || 0
                    handleFilterChange('amountRange', [value, localFilters.amountRange[1]])
                  }}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Maksimum</Label>
                <Input
                  placeholder={`Rp ${formatCurrency(maxAmount)}`}
                  value={`Rp ${formatCurrency(localFilters.amountRange[1])}`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^\d]/g, '')) || maxAmount
                    handleFilterChange('amountRange', [localFilters.amountRange[0], value])
                  }}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="px-1">
              <Slider
                value={localFilters.amountRange}
                onValueChange={(value) => handleFilterChange('amountRange', value)}
                max={maxAmount}
                min={0}
                step={100000}
              />
              <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                <span>Rp 0</span>
                <span>Rp {formatCurrency(maxAmount)}</span>
              </div>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant={hasActiveFilters ? 'default' : 'outline'}
            size="sm"
            className={`${className} ${
              hasActiveFilters ? 'bg-blue-500 text-white hover:bg-blue-700' : ''
            } relative`}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 min-w-[1.25rem] bg-white px-1.5 py-0.5 text-xs text-blue-500">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto border-l px-6 py-6">
        <SheetHeader className="mb-4 p-0">
          <SheetTitle className="text-xl">Filter Pengajuan Dana</SheetTitle>
        </SheetHeader>
        <FilterContent />
      </SheetContent>
    </Sheet>
  )
}

function FilterSection({
  title,
  expanded,
  onToggle,
  badgeCount,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  badgeCount?: number
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-lg border shadow-sm">
      <Collapsible open={expanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                {title}
                {badgeCount && badgeCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {badgeCount}
                  </Badge>
                )}
              </CardTitle>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3 px-4 py-3">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center space-x-3 py-1">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onChange(value as boolean)} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
    </div>
  )
}
