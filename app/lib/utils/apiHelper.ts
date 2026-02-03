/**
 * Utility to robustly map paginated API responses
 */
export interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Maps various API response structures to a consistent PaginatedResult format.
 *
 * Supports structures like:
 * 1. Flattened: { data: [...], total: 83, page: 1, limit: 50, totalPages: 2 }
 * 2. Nested pagination: { bills: [...], pagination: { totalItems: 83, ... } }
 * 3. Differently named items: { applications: [...], ... }
 * 4. Fallback for raw arrays
 *
 * @param responseData The 'data' field from the API response
 * @param itemsKey Optional key for the items array if not 'data' or 'bills' etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPaginatedResponse<T>(responseData: any, itemsKey?: string): PaginatedResult<T> {
  if (!responseData) {
    return { data: [], page: 1, limit: 20, total: 0, totalPages: 1 }
  }

  // 1. Extract items array
  let items: T[] = []

  if (itemsKey && Array.isArray(responseData[itemsKey])) {
    items = responseData[itemsKey]
  } else if (Array.isArray(responseData.data)) {
    items = responseData.data
  } else if (Array.isArray(responseData.bills)) {
    items = responseData.bills
  } else if (Array.isArray(responseData.applications)) {
    items = responseData.applications
  } else if (Array.isArray(responseData.transactions)) {
    items = responseData.transactions
  } else if (Array.isArray(responseData.students)) {
    items = responseData.students
  } else if (Array.isArray(responseData)) {
    items = responseData
  }

  // 2. Extract pagination info
  const pagination = responseData.pagination || {}

  const page = Number(pagination.page ?? responseData.page ?? 1)
  const limit = Number(pagination.limit ?? responseData.limit ?? 20)
  const total = Number(
    pagination.totalItems ??
      pagination.total ??
      responseData.totalItems ??
      responseData.total ??
      items.length
  )
  const totalPages = Number(
    (pagination.totalPages ??
      responseData.totalPages ??
      (limit > 0 ? Math.ceil(total / limit) : 1)) ||
      1
  )

  return {
    data: items,
    page,
    limit,
    total,
    totalPages,
  }
}
