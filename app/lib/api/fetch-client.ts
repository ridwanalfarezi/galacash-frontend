/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIError } from './errors'

type FetchConfig = RequestInit & {
  params?: Record<string, any>
  data?: unknown
  responseType?: 'json' | 'blob' | 'text'
  _retry?: boolean
}

type FetchResponse<T = any> = {
  data: T
  status: number
  statusText: string
  headers: Headers
  config: FetchConfig
  request?: Request
}

export class FetchClient {
  private baseURL: string
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private processQueue(error: unknown = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve()
      }
    })
    this.failedQueue = []
  }

  private async request<T = any>(
    endpoint: string,
    config: FetchConfig = {}
  ): Promise<FetchResponse<T>> {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`,
      globalThis.location?.origin || 'http://localhost'
    )

    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const headers = new Headers(config.headers)
    if (!headers.has('Content-Type') && !(config.data instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }

    const fetchConfig: RequestInit = {
      ...config,
      headers,
      method: config.method || 'GET',
    }

    if (config.data && !(config.data instanceof FormData)) {
      fetchConfig.body = JSON.stringify(config.data)
    } else if (config.data instanceof FormData) {
      fetchConfig.body = config.data
    }

    if (import.meta.env.DEV) {
      console.log(`[API Request] ${fetchConfig.method} ${url.pathname}`, {
        params: config.params,
        data: config.data,
      })
    }

    try {
      const response = await fetch(url.toString(), fetchConfig)

      if (import.meta.env.DEV) {
        // Clone for logging since body can catch be consumed once
        const clone = response.clone()
        try {
          const logData = await clone.json()
          console.log(`[API Response] ${url.pathname}`, logData)
        } catch {
          console.log(`[API Response] ${url.pathname} (Non-JSON)`)
        }
      }

      if (!response.ok) {
        // Handle Errors
        const data = await response.json().catch(() => ({}))
        const error = new APIError(
          data.error?.message || data.message || response.statusText,
          data.error?.code || 'API_ERROR',
          response.status,
          data.error?.details || data.details
        )

        // Auth Retry Logic
        if (response.status === 401 && !config._retry) {
          if (error.code === 'TOKEN_EXPIRED') {
            if (this.isRefreshing) {
              return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject })
              }).then(() => {
                return this.request<T>(endpoint, config)
              })
            }

            config._retry = true
            this.isRefreshing = true

            try {
              await this.post('/auth/refresh')
              this.processQueue(null)
              this.isRefreshing = false
              return this.request<T>(endpoint, config)
            } catch (refreshErr) {
              this.processQueue(refreshErr)
              this.isRefreshing = false
              window.location.href = '/sign-in'
              throw refreshErr
            }
          } else if (error.code === 'INVALID_TOKEN' || error.code === 'UNAUTHORIZED') {
            if (endpoint.includes('/auth/me')) {
              throw error
            }
            if (!window.location.pathname.includes('/sign-in')) {
              window.location.href = '/sign-in'
            }
          }
        }

        throw error
      }

      let data: any
      if (config.responseType === 'blob') {
        data = await response.blob()
      } else if (config.responseType === 'text') {
        data = await response.text()
      } else {
        data = await response.json().catch(() => ({})) // Handle empty responses (204)
      }

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
      }
    } catch (err) {
      if (err instanceof APIError) throw err
      // Network errors
      throw new APIError(
        err instanceof Error ? err.message : 'Network error',
        'NETWORK_ERROR',
        0,
        err
      )
    }
  }

  async get<T = any>(url: string, config?: FetchConfig) {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  async post<T = any>(url: string, data?: unknown, config?: FetchConfig) {
    return this.request<T>(url, { ...config, method: 'POST', data })
  }

  async put<T = any>(url: string, data?: unknown, config?: FetchConfig) {
    return this.request<T>(url, { ...config, method: 'PUT', data })
  }

  async delete<T = any>(url: string, config?: FetchConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }
}

export const fetchClient = new FetchClient(import.meta.env.VITE_API_URL || '/api')
