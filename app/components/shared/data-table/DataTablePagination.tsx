'use client'

import { PaginationControls } from '~/components/shared/PaginationControls'
import { useExplorer } from '~/components/shared/explorer/ExplorerContext'

interface DataTablePaginationProps {
  totalPages?: number
  total?: number
}

export function DataTablePagination({ totalPages = 1 }: DataTablePaginationProps) {
  const { pagination, setPage } = useExplorer()

  if (totalPages <= 1) return null

  return (
    <div className="mt-4 flex justify-center">
      <PaginationControls
        currentPage={pagination.page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
