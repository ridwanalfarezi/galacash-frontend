import { useExplorer } from '~/components/shared/explorer/ExplorerContext'
import { Field, FieldLabel } from '~/components/ui/field'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface DataTablePaginationProps {
  totalPages?: number
  total?: number
}

export function DataTablePagination({ totalPages = 1, total = 0 }: DataTablePaginationProps) {
  const { pagination, setPage, setLimit } = useExplorer()

  const start = (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, total)

  // Only hide if there's absolutely no data
  if (total === 0 && totalPages <= 1) return null

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-6">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel
            htmlFor="select-rows-per-page"
            className="hidden text-xs font-normal text-gray-500 min-[400px]:inline sm:text-sm"
          >
            Rows per page
          </FieldLabel>
          <Select
            value={pagination.limit.toString()}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="h-8 w-18 px-3 sm:w-20" id="select-rows-per-page">
              <SelectValue placeholder={pagination.limit.toString()} />
            </SelectTrigger>
            <SelectContent align="start" side="top">
              <SelectGroup>
                {[10, 25, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        {total > 0 && (
          <span className="text-xs text-gray-500 sm:text-sm">
            {start}-{end} of {total}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs font-medium sm:text-sm">
          Page {pagination.page} <span className="hidden min-[360px]:inline">of {totalPages}</span>
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.page > 1) setPage(pagination.page - 1)
                }}
                className={
                  pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.page < totalPages) setPage(pagination.page + 1)
                }}
                className={
                  pagination.page >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
