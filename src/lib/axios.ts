import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// Create base Axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'http://k8s-default-aisleapp-8acdd70192-960815e26835d3bf.elb.ap-south-1.amazonaws.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor - add auth token to requests
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add backend JWT token if available
      const authToken = localStorage.getItem('auth_token')
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`
      }

      // Log request in development
      if (import.meta.env.DEV) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
        })
      }

      return config
    },
    (error: AxiosError) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle responses and errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        })
      }

      return response
    },
    (error: AxiosError) => {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('❌ API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        })
      }

      // Handle common HTTP errors
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            // Unauthorized - redirect to login or refresh token
            console.warn('Unauthorized access - consider redirecting to login')
            break
          case 403:
            // Forbidden
            console.warn('Access forbidden')
            break
          case 404:
            // Not found
            console.warn('Resource not found')
            break
          case 500:
            // Server error
            console.error('Server error')
            break
          default:
            console.error(`HTTP Error ${status}:`, data)
        }
      } else if (error.request) {
        // Network error
        console.error('Network error - no response received')
      } else {
        // Request setup error
        console.error('Request setup error:', error.message)
      }

      return Promise.reject(error)
    }
  )

  return instance
}

// Export configured Axios instance
export const api = createAxiosInstance()

// Export types for convenience
export type { AxiosResponse, AxiosError, AxiosRequestConfig }

// Helper functions for common HTTP methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config),
}

export default api
