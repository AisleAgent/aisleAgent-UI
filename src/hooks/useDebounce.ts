import { useEffect, useState } from 'react'

/**
 * Custom hook for debouncing values
 * Useful for search inputs, API calls, and expensive operations
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   // API call with debounced value
 *   fetchResults(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function to cancel the timeout if value changes
    // or component unmounts
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Re-run effect when value or delay changes

  return debouncedValue
}
