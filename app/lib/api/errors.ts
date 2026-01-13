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
    const axiosError = error as Record<string, unknown>
    const response = axiosError?.response as Record<string, unknown> | undefined

    if (!response) {
      const message = (error as Record<string, unknown>)?.message || 'Network error'
      return new APIError(String(message), 'NETWORK_ERROR', 0, error)
    }

    const data = response?.data as Record<string, unknown> | undefined
    const message =
      (data?.error as Record<string, unknown>)?.message || data?.message || 'An error occurred'
    const code = (data?.error as Record<string, unknown>)?.code || 'API_ERROR'
    const details = (data?.error as Record<string, unknown>)?.details || data?.details

    return new APIError(String(message), String(code), response?.status as number, details)
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
