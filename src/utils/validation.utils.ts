/**
 * Validation Utility Functions
 * Pure functions for data validation
 * Reusable across the application
 */

import { VALIDATION } from '../constants/app.constants'

/**
 * Validate email address
 * @param email - Email string to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email)
}

/**
 * Validate phone number
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 */
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone)
}

/**
 * Validate URL
 * @param url - URL string to validate
 * @returns True if valid URL
 */
export const isValidUrl = (url: string): boolean => {
  return VALIDATION.URL_REGEX.test(url)
}

/**
 * Validate required field
 * @param value - Value to check
 * @returns True if value is not empty
 */
export const isRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

/**
 * Validate minimum length
 * @param value - String to check
 * @param minLength - Minimum required length
 * @returns True if meets minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

/**
 * Validate maximum length
 * @param value - String to check
 * @param maxLength - Maximum allowed length
 * @returns True if within maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength
}

/**
 * Validate number range
 * @param value - Number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Validate positive number
 * @param value - Number to check
 * @returns True if positive
 */
export const isPositive = (value: number): boolean => {
  return value > 0
}
