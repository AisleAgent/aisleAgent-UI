/**
 * Application-wide constants
 * Centralized location for all magic strings, numbers, and configuration values
 * Following DRY principle and improving maintainability
 */

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'userData',
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
} as const

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ITEMS_PER_PAGE: 10,
} as const

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM DD, YYYY',
  TIME: 'hh:mm A',
  DATETIME: 'MMMM DD, YYYY hh:mm A',
  API: 'YYYY-MM-DD',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Changes saved successfully!',
  DELETE_SUCCESS: 'Item deleted successfully!',
  UPDATE_SUCCESS: 'Item updated successfully!',
  CREATE_SUCCESS: 'Item created successfully!',
} as const

// Accessibility
export const A11Y = {
  ARIA_LABELS: {
    CLOSE: 'Close',
    EDIT: 'Edit',
    DELETE: 'Delete',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    MENU: 'Menu',
    SEARCH: 'Search',
  },
} as const

export type StorageKey = keyof typeof STORAGE_KEYS
export type ErrorMessage = keyof typeof ERROR_MESSAGES
export type SuccessMessage = keyof typeof SUCCESS_MESSAGES
