import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { APIError } from './errors'

/**
 * Create axios instance with base configuration
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Required for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Track if a refresh is in progress to prevent concurrent refresh calls
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

/**
 * Request interceptor
 * Adds logging in development mode
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handles errors and automatic token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data)
    }
    return response
  },
  async (error: unknown) => {
    const axiosError = error as AxiosError
    const originalRequest = axiosError.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(APIError.fromResponse(axiosError))
    }

    // Convert to APIError
    const apiError = APIError.fromResponse(axiosError)

    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: originalRequest.url,
        status: apiError.statusCode,
        code: apiError.code,
        message: apiError.message,
      })
    }

    // Handle 401 errors
    if (apiError.statusCode === 401 && !originalRequest._retry) {
      // Check if it's a token expiration that can be refreshed
      if (apiError.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          // Queue this request to retry after refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => {
              return apiClient(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Attempt to refresh the token
          await apiClient.post('/auth/refresh')

          // Token refreshed successfully, process queued requests
          processQueue(null)
          isRefreshing = false

          // Retry the original request
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, log out user
          processQueue(refreshError)
          isRefreshing = false

          // Redirect to sign-in
          window.location.href = '/sign-in'

          return Promise.reject(APIError.fromResponse(refreshError))
        }
      } else if (apiError.code === 'INVALID_TOKEN' || apiError.code === 'UNAUTHORIZED') {
        // For /auth/me endpoint, don't redirect immediately - let the retry logic in requireAuth handle it
        if (originalRequest.url?.includes('/auth/me')) {
          // Just reject the error, requireAuth will handle retry
          return Promise.reject(apiError)
        }

        // For other endpoints, redirect to sign-in
        if (!window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in'
        }
      }
    }

    return Promise.reject(apiError)
  }
)

/**
 * Helper function to handle file uploads
 */
export const uploadFile = async (endpoint: string, formData: FormData): Promise<unknown> => {
  const response = await apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}
