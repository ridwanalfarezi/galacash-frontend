import { fetchClient } from './fetch-client'

export const apiClient = fetchClient

/**
 * Helper function to handle file uploads
 */
export const uploadFile = async (endpoint: string, formData: FormData): Promise<unknown> => {
  const response = await apiClient.post(endpoint, formData)
  return response.data
}
