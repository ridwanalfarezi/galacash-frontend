'use client'

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'

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

const ExplorerContext = createContext<ExplorerContextValue<Record<string, unknown>> | undefined>(
  undefined
)

interface ExplorerProviderProps<TFilters> {
  children: ReactNode
  defaultFilters?: TFilters
  defaultSort?: SortConfig<unknown>
  defaultLimit?: number
}

export function ExplorerProvider<T extends Record<string, unknown>>({
  children,
  defaultFilters,
  defaultSort,
  defaultLimit = 25,
}: ExplorerProviderProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams()

  // --- Derived State from URL ---
  const search = searchParams.get('q') || ''
  const page = Number(searchParams.get('p') || '1')
  const limit = Number(searchParams.get('l') || String(defaultLimit))

  const sortKey = searchParams.get('sk')
  const sortDir = searchParams.get('sd') as 'asc' | 'desc' | null
  const sort = useMemo(() => {
    return sortKey && sortDir ? { key: sortKey, direction: sortDir } : defaultSort
  }, [sortKey, sortDir, defaultSort])

  const filters = useMemo(() => {
    const f: Record<string, unknown> = { ...defaultFilters }
    searchParams.forEach((value, key) => {
      if (key.startsWith('f_')) {
        const filterKey = key.slice(2)
        f[filterKey] = value
      }
    })
    return f as T
  }, [searchParams, defaultFilters])

  const pagination = useMemo(() => ({ page, limit }), [page, limit])

  // --- URL Update Helpers ---
  const updateParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
              next.delete(key)
            } else {
              next.set(key, value)
            }
          })
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const setSearch = useCallback(
    (newSearch: string) => {
      updateParams({ q: newSearch, p: '1' })
    },
    [updateParams]
  )

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const updates: Record<string, string | null> = { p: '1' }
      Object.entries(newFilters).forEach(([key, val]) => {
        updates[`f_${key}`] = val ? String(val) : null
      })
      updateParams(updates)
    },
    [updateParams]
  )

  const setSort = useCallback(
    (newSort: SortConfig<unknown> | undefined) => {
      updateParams({
        sk: (newSort?.key as string) || null,
        sd: newSort?.direction || null,
      })
    },
    [updateParams]
  )

  const setPage = useCallback(
    (newPage: number) => {
      updateParams({ p: newPage.toString() })
    },
    [updateParams]
  )

  const setLimit = useCallback(
    (newLimit: number) => {
      updateParams({ l: newLimit.toString(), p: '1' })
    },
    [updateParams]
  )

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const value = useMemo(
    () => ({
      search,
      filters,
      sort,
      pagination,
      setSearch,
      setFilters,
      setSort,
      setPage,
      setLimit,
      reset,
    }),
    [search, filters, sort, pagination, setSearch, setFilters, setSort, setPage, setLimit, reset]
  )

  return (
    <ExplorerContext.Provider
      value={value as unknown as ExplorerContextValue<Record<string, unknown>>}
    >
      {children}
    </ExplorerContext.Provider>
  )
}

export function useExplorer<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): ExplorerContextValue<T> {
  const context = useContext(ExplorerContext)
  if (!context) {
    throw new Error('useExplorer must be used within an ExplorerProvider')
  }
  return context as unknown as ExplorerContextValue<T>
}
