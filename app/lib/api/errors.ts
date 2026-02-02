/**
 * Custom API error class for typed error handling
 */
export class APIError extends Error {
  public code: string
  public statusCode?: number
  public details?: unknown

  constructor(message: string, code: string = 'API_ERROR', statusCode?: number, details?: unknown) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.statusCode = statusCode
    this.details = details

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError)
    }
  }

  /**
   * Create APIError from axios error response
   */
  static fromResponse(error: unknown): APIError {
    // Handle existing APIError
    if (error instanceof APIError) {
      return error
    }

    const err = error as Record<string, unknown>
    // Handle Axios-like response structure (kept for backward compatibility during migration)
    const response = err?.response as Record<string, unknown> | undefined

    // Handle Fetch-like response structure (if passed directly) or standard error object
    const data = (response?.data || err) as Record<string, unknown> | undefined

    if (!response && !data?.error) {
      const message = err?.message || 'Network error'
      return new APIError(String(message), 'NETWORK_ERROR', 0, error)
    }

    const errorData = (data?.error || data) as Record<string, unknown>
    const message = errorData?.message || 'An error occurred'
    const code = errorData?.code || 'API_ERROR'
    const details = errorData?.details

    // Try to get status from property or response object
    const status = (response?.status || err?.status || 0) as number

    return new APIError(String(message), String(code), status, details)
  }

  /**
   * Check if error is a specific type
   */
  isCode(code: string): boolean {
    return this.code === code
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return (
      this.code === 'TOKEN_EXPIRED' || this.code === 'INVALID_TOKEN' || this.code === 'UNAUTHORIZED'
    )
  }
}

/**
 * Extract error message from any error type
 * Centralizes the error extraction logic used in mutations
 *
 * @param error - The error object (can be APIError, Axios error, or unknown)
 * @param fallback - Fallback message if extraction fails
 * @returns The error message string
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  // Handle APIError directly
  if (error instanceof APIError) {
    return error.message
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message
  }

  // Handle axios-like error responses
  const axiosError = error as Record<string, unknown>
  const response = axiosError?.response as Record<string, unknown> | undefined
  const data = response?.data as Record<string, unknown> | undefined
  const errorObj = data?.error as Record<string, unknown> | undefined
  const message = errorObj?.message as string | undefined

  return message || fallback
}
