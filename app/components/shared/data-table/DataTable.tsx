import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import type { SortConfig } from '~/components/shared/explorer/ExplorerContext'
import { cn } from '~/lib/utils'

interface DataTableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
  containerClassName?: string
}

export function DataTable({ children, className, containerClassName, ...props }: DataTableProps) {
  return (
    <div className={cn('overflow-x-auto', containerClassName)}>
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
    <thead className={cn('[&_tr]:border-b', className)} {...props}>
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
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

interface DataTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortKey?: string
  currentSort?: SortConfig<unknown>
  onSort?: (sort: SortConfig<unknown>) => void
}

export function DataTableHead({
  children,
  className,
  sortKey,
  currentSort,
  onSort,
  ...props
}: DataTableHeadProps) {
  const isSorted = currentSort?.key === sortKey
  const isAsc = currentSort?.direction === 'asc'

  const handleSort = () => {
    if (!sortKey || !onSort) return

    if (isSorted) {
      onSort({
        key: sortKey,
        direction: isAsc ? 'desc' : 'asc',
      })
    } else {
      onSort({
        key: sortKey,
        direction: 'desc', // Default to desc
      })
    }
  }

  if (sortKey && onSort) {
    return (
      <th
        className={cn(
          'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      >
        <button onClick={handleSort} className="hover:text-foreground flex items-center gap-1">
          {children}
          {isSorted ? (
            isAsc ? (
              <ArrowUp className="size-4" />
            ) : (
              <ArrowDown className="size-4" />
            )
          ) : (
            <ArrowUpDown className="size-4 opacity-50" />
          )}
        </button>
      </th>
    )
  }

  return (
    <th
      className={cn(
        'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function DataTableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props}>
      {children}
    </td>
  )
}
