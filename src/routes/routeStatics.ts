export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  
  // Protected routes
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  LEADS: '/leads',
  CALENDAR: '/calendar',
  
  // Root and fallback
  ROOT: '/',
  CATCH_ALL: '*'
} as const

export const ROUTE_COPY = {
  // Route titles and descriptions
  LOGIN_TITLE: 'Sign In',
  DASHBOARD_TITLE: 'Dashboard',
  
  // Navigation messages
  REDIRECTING_TO_LOGIN: 'Redirecting to login...',
  REDIRECTING_TO_DASHBOARD: 'Redirecting to dashboard...',
  
  // Error messages
  ACCESS_DENIED: 'Access denied. Please sign in to continue.',
  PAGE_NOT_FOUND: 'Page not found'
} as const
