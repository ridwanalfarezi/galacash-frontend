'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
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
  debouncedSearch: string
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
  scope?: string
}

export function ExplorerProvider<T extends Record<string, unknown>>({
  children,
  defaultFilters,
  defaultSort,
  defaultLimit = 25,
  scope,
}: ExplorerProviderProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const getScopedKey = useCallback((key: string) => (scope ? `${scope}_${key}` : key), [scope])

  // --- Derived State from URL ---
  const urlSearch = searchParams.get(getScopedKey('q')) || ''
  const page = Number(searchParams.get(getScopedKey('p')) || '1')
  const limit = Number(searchParams.get(getScopedKey('l')) || String(defaultLimit))

  const sortKey = searchParams.get(getScopedKey('sk'))
  const sortDir = searchParams.get(getScopedKey('sd')) as 'asc' | 'desc' | null
  const sort = useMemo(() => {
    return sortKey && sortDir ? { key: sortKey, direction: sortDir } : defaultSort
  }, [sortKey, sortDir, defaultSort])

  const filters = useMemo(() => {
    const f: Record<string, unknown> = { ...defaultFilters }
    const prefix = getScopedKey('f_')
    searchParams.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        const filterKey = key.slice(prefix.length)
        f[filterKey] = value
      }
    })
    return f as T
  }, [searchParams, defaultFilters, getScopedKey])

  const pagination = useMemo(() => ({ page, limit }), [page, limit])

  // --- Search State & Debouncing ---
  const [search, setSearchState] = useState(urlSearch)

  // Sync local search when URL changes externally (e.g. back button)
  useEffect(() => {
    setSearchState(urlSearch)
  }, [urlSearch])

  // Debounced Search for API queries
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

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

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch)
  }, [])

  // Debounce URL update when local search changes
  useEffect(() => {
    if (search === urlSearch) return

    const timer = setTimeout(() => {
      updateParams({ [getScopedKey('q')]: search, [getScopedKey('p')]: '1' })
    }, 300)

    return () => clearTimeout(timer)
  }, [search, urlSearch, getScopedKey, updateParams])

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const updates: Record<string, string | null> = { [getScopedKey('p')]: '1' }
      Object.entries(newFilters).forEach(([key, val]) => {
        updates[getScopedKey(`f_${key}`)] = val ? String(val) : null
      })
      updateParams(updates)
    },
    [updateParams, getScopedKey]
  )

  const setSort = useCallback(
    (newSort: SortConfig<unknown> | undefined) => {
      updateParams({
        [getScopedKey('sk')]: (newSort?.key as string) || null,
        [getScopedKey('sd')]: newSort?.direction || null,
      })
    },
    [updateParams, getScopedKey]
  )

  const setPage = useCallback(
    (newPage: number) => {
      updateParams({ [getScopedKey('p')]: newPage.toString() })
    },
    [updateParams, getScopedKey]
  )

  const setLimit = useCallback(
    (newLimit: number) => {
      updateParams({ [getScopedKey('l')]: newLimit.toString(), [getScopedKey('p')]: '1' })
    },
    [updateParams, getScopedKey]
  )

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const value = useMemo(
    () => ({
      search,
      debouncedSearch,
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
    [
      search,
      debouncedSearch,
      filters,
      sort,
      pagination,
      setSearch,
      setFilters,
      setSort,
      setPage,
      setLimit,
      reset,
    ]
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
