import { PaginationControls } from '~/components/shared/PaginationControls'
import { useExplorer } from '~/components/shared/explorer/ExplorerContext'
import {
  Select,
  SelectContent,
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

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <Select
            value={pagination.limit.toString()}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.limit.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {total > 0 && (
          <span className="hidden sm:inline">
            Menampilkan {start}-{end} dari {total}
          </span>
        )}
      </div>

      <div className="flex justify-center">
        <PaginationControls
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
