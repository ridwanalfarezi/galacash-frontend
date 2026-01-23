import { ArrowDown, ArrowUp, ArrowUpDown, Filter, Search, X } from 'lucide-react'
import * as React from 'react'

import { type SortConfig } from '~/components/shared/explorer/ExplorerContext'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'

// --- Table Components ---

interface DataTableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
  containerClassName?: string
}

export function DataTable({ children, className, containerClassName, ...props }: DataTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm',
        containerClassName
      )}
    >
      <table className={cn('w-full text-left text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function DataTableHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('border-gray-100 bg-gray-50/50 [&_tr]:border-b', className)} {...props}>
      {children}
    </thead>
  )
}

export function DataTableBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
      {children}
    </tbody>
  )
}

export function DataTableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'group data-[state=selected]:bg-muted border-b border-gray-100 transition-colors hover:bg-blue-50/30',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

interface FilterOption {
  label: string
  value: string
}

interface DataTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortKey?: string
  currentSort?: SortConfig<unknown>
  onSort?: (sort: SortConfig<unknown> | undefined) => void
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string
  filterOptions?: FilterOption[]
  filterOnly?: boolean
}

export function DataTableHead({
  children,
  className,
  sortKey,
  currentSort,
  onSort,
  filterValue,
  onFilterChange,
  filterPlaceholder = 'Filter...',
  filterOptions,
  filterOnly = false,
  ...props
}: DataTableHeadProps) {
  const isSorted = currentSort?.key === sortKey
  const isAsc = currentSort?.direction === 'asc'

  const handleSort = () => {
    if (!sortKey || !onSort) return

    if (isSorted) {
      if (isAsc) {
        onSort({ key: sortKey, direction: 'desc' })
      } else {
        onSort(undefined)
      }
    } else {
      onSort({ key: sortKey, direction: 'asc' })
    }
  }

  return (
    <th
      className={cn(
        'text-muted-foreground group/th h-12 px-4 text-left align-middle font-semibold whitespace-nowrap',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        <div className="flex-1">
          {sortKey && onSort && !filterOnly ? (
            <button
              onClick={handleSort}
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              {children}
              {isSorted ? (
                isAsc ? (
                  <ArrowUp className="size-3.5 text-blue-500" />
                ) : (
                  <ArrowDown className="size-3.5 text-blue-500" />
                )
              ) : (
                <ArrowUpDown className="size-3.5 opacity-0 transition-opacity group-hover/th:opacity-50" />
              )}
            </button>
          ) : (
            children
          )}
        </div>

        {onFilterChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-6 hover:bg-gray-200/50',
                  filterValue ? 'bg-blue-50/50 text-blue-500' : 'text-muted-foreground/40'
                )}
              >
                <Filter className="size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              {filterOptions ? (
                <div className="p-1">
                  {filterOptions.map((opt) => {
                    const isActive = filterValue === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange(isActive ? '' : opt.value)}
                        className={cn(
                          'flex w-full items-center rounded-md px-2 py-1.5 text-xs transition-colors',
                          isActive
                            ? 'bg-blue-50 font-medium text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                  {filterValue && (
                    <div className="mt-1 border-t border-gray-100 pt-1">
                      <button
                        onClick={() => onFilterChange('')}
                        className="flex w-full items-center rounded-md px-2 py-1.5 text-[10px] font-bold tracking-wider text-red-500 uppercase hover:bg-red-50"
                      >
                        Hapus Filter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <Input
                    placeholder={filterPlaceholder}
                    defaultValue={filterValue || ''}
                    className="h-8 text-xs focus-visible:ring-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onFilterChange((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                  {filterValue && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-gray-400 hover:text-red-500"
                      onClick={() => onFilterChange('')}
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </th>
  )
}

export function DataTableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('p-4 align-middle whitespace-nowrap', className)} {...props}>
      {children}
    </td>
  )
}

// --- Card Components ---

export function DataCardContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('flex flex-col gap-4 lg:hidden', className)}>{children}</div>
}

export function DataCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-sm active:scale-[98%]',
        onClick ? 'cursor-pointer hover:border-blue-100' : '',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// --- Mobile Helpers ---

export function DataMobileFilters({
  search,
  onSearchChange,
  placeholder = 'Cari data...',
}: {
  search: string
  onSearchChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative w-full">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-2xl border-gray-100 bg-white/50 pl-9 focus:bg-white focus:ring-blue-100"
      />
    </div>
  )
}
