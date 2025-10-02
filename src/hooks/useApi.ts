import { useState, useEffect, useCallback } from 'react'
import { AxiosResponse, AxiosError } from '../lib/axios'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  immediate?: boolean // Whether to call the API immediately on mount
}

// Hook for making API calls with loading and error states
export function useApi<T = any>(
  apiCall: () => Promise<AxiosResponse<T>>,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiCall()
      setState({
        data: response.data,
        loading: false,
        error: null,
      })
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      })
      throw error
    }
  }, [apiCall])

  useEffect(() => {
    if (options.immediate) {
      execute()
    }
  }, [execute, options.immediate])

  return {
    ...state,
    execute,
    refetch: execute,
  }
}

// Hook for making API calls with manual trigger (no immediate execution)
export function useApiLazy<T = any>(apiCall: () => Promise<AxiosResponse<T>>) {
  return useApi(apiCall, { immediate: false })
}

// Hook for making API calls with parameters
export function useApiWithParams<T = any, P = any>(
  apiCall: (params: P) => Promise<AxiosResponse<T>>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiCall(params)
      setState({
        data: response.data,
        loading: false,
        error: null,
      })
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      })
      throw error
    }
  }, [apiCall])

  return {
    ...state,
    execute,
  }
}

// Example usage:
/*
// Immediate API call on component mount
const { data: user, loading, error, refetch } = useApi(() => userApi.getProfile())

// Manual API call
const { data, loading, error, execute } = useApiLazy(() => userApi.getProfile())

// API call with parameters
const { data, loading, error, execute } = useApiWithParams((userId: string) => 
  userApi.getById(userId)
)
*/

