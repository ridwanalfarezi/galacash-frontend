'use client'

import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface SortConfig<T> {
  key: keyof T | string
  direction: 'asc' | 'desc'
}

export interface PaginationConfig {
  page: number
  limit: number
}

interface ExplorerState<TFilters> {
  search: string
  filters: TFilters
  sort: SortConfig<unknown> | undefined
  pagination: PaginationConfig
}

interface ExplorerContextValue<TFilters> extends ExplorerState<TFilters> {
  setSearch: (search: string) => void
  setFilters: (filters: Partial<TFilters>) => void
  setSort: (sort: SortConfig<unknown> | undefined) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  reset: () => void
}

const ExplorerContext = createContext<ExplorerContextValue<unknown> | undefined>(undefined)

interface ExplorerProviderProps<TFilters> {
  children: ReactNode
  defaultFilters?: TFilters
  defaultSort?: SortConfig<unknown>
  defaultLimit?: number
}

export function ExplorerProvider<TFilters extends Record<string, unknown>>({
  children,
  defaultFilters = {} as TFilters,
  defaultSort,
  defaultLimit = 25,
}: ExplorerProviderProps<TFilters>) {
  const [search, setSearchState] = useState('')
  const [filters, setFiltersState] = useState<TFilters>(defaultFilters)
  const [sort, setSortState] = useState<SortConfig<unknown> | undefined>(defaultSort)
  const [pagination, setPaginationState] = useState<PaginationConfig>({
    page: 1,
    limit: defaultLimit,
  })

  // State setters wrapped in functions to prevent unnecessary recreation
  // Using useMemo for the value object to ensure stable reference unless state changes
  const value = useMemo(() => {
    return {
      search,
      filters,
      sort,
      pagination,
      setSearch: (newSearch: string) => {
        startTransition(() => {
          setSearchState(newSearch)
          setPaginationState((prev) => ({ ...prev, page: 1 })) // Reset page on search
        })
      },
      setFilters: (newFilters: Partial<TFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }))
        setPaginationState((prev) => ({ ...prev, page: 1 })) // Reset page on filter change
      },
      setSort: (newSort: SortConfig<unknown> | undefined) => {
        setSortState(newSort)
      },
      setPage: (newPage: number) => {
        setPaginationState((prev) => ({ ...prev, page: newPage }))
      },
      setLimit: (newLimit: number) => {
        setPaginationState((prev) => ({ ...prev, limit: newLimit, page: 1 }))
      },
      reset: () => {
        setSearchState('')
        setFiltersState(defaultFilters)
        setSortState(defaultSort)
        setPaginationState({ page: 1, limit: defaultLimit })
      },
    }
  }, [search, filters, sort, pagination, defaultFilters, defaultSort, defaultLimit])

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
}

// Custom hook to use the explorer context
export function useExplorer<TFilters extends Record<string, unknown> = Record<string, unknown>>() {
  const context = useContext(ExplorerContext)
  if (!context) {
    throw new Error('useExplorer must be used within an ExplorerProvider')
  }
  return context as ExplorerContextValue<TFilters>
}
