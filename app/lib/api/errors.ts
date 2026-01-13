/**
 * Custom API error class for typed error handling
 */
export class APIError extends Error {
  public code: string
  public statusCode?: number
  public details?: any

  constructor(message: string, code: string = 'API_ERROR', statusCode?: number, details?: any) {
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
  static fromResponse(error: any): APIError {
    const response = error.response

    if (!response) {
      return new APIError(error.message || 'Network error', 'NETWORK_ERROR', 0, error)
    }

    const data = response.data
    const message = data?.error?.message || data?.message || 'An error occurred'
    const code = data?.error?.code || 'API_ERROR'
    const details = data?.error?.details || data?.details

    return new APIError(message, code, response.status, details)
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
