/**
 * Utility to robustly map paginated API responses
 */
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponseData<T = unknown> {
  data?: T[];
  bills?: T[];
  applications?: T[];
  transactions?: T[];
  students?: T[];
  page?: number;
  limit?: number;
  total?: number;
  totalItems?: number;
  totalPages?: number;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalItems?: number;
    totalPages?: number;
  };
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
export function mapPaginatedResponse<T>(
  responseData: PaginatedResponseData<T> | T[] | undefined | null,
  itemsKey?: string
): PaginatedResult<T> {
  if (!responseData) {
    return { data: [], page: 1, limit: 20, total: 0, totalPages: 1 };
  }

  // 1. Extract items array
  let items: T[] = [];

  if (Array.isArray(responseData)) {
    items = responseData;
  } else if (itemsKey && Array.isArray((responseData as Record<string, unknown>)[itemsKey])) {
    items = (responseData as Record<string, unknown>)[itemsKey] as T[];
  } else if (Array.isArray(responseData.data)) {
    items = responseData.data;
  } else if (Array.isArray(responseData.bills)) {
    items = responseData.bills;
  } else if (Array.isArray(responseData.applications)) {
    items = responseData.applications;
  } else if (Array.isArray(responseData.transactions)) {
    items = responseData.transactions;
  } else if (Array.isArray(responseData.students)) {
    items = responseData.students;
  }

  // 2. Extract pagination info
  const pagination =
    responseData && !Array.isArray(responseData) ? responseData.pagination || {} : {};

  const page = Number(
    pagination.page ??
      (responseData && !Array.isArray(responseData) ? responseData.page : undefined) ??
      1
  );
  const limit = Number(
    pagination.limit ??
      (responseData && !Array.isArray(responseData) ? responseData.limit : undefined) ??
      20
  );
  const total = Number(
    pagination.totalItems ??
      pagination.total ??
      (responseData && !Array.isArray(responseData) ? responseData.totalItems : undefined) ??
      (responseData && !Array.isArray(responseData) ? responseData.total : undefined) ??
      items.length
  );
  const totalPages = Number(
    (pagination.totalPages ??
      (responseData && !Array.isArray(responseData) ? responseData.totalPages : undefined) ??
      (limit > 0 ? Math.ceil(total / limit) : 1)) ||
      1
  );

  return {
    data: items,
    page,
    limit,
    total,
    totalPages,
  };
}
