import { lazy, Suspense, memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { ROUTES } from './routeStatics'
import { Spin } from 'antd'

/**
 * Lazy-loaded route components for code splitting
 * Improves initial load time by splitting code into smaller chunks
 * Components are loaded on-demand when routes are accessed
 */
const Login = lazy(() => import('../features/login/login'))
const Onboarding = lazy(() => import('../features/onboarding/onboarding'))
const Dashboard = lazy(() => import('../features/dashboard/dashboard'))
const Leads = lazy(() => import('../features/leads/Leads'))
const LeadDetails = lazy(() => import('../features/leads/LeadDetails'))
const LeadProgress = lazy(() => import('../features/leads/LeadProgress'))
const Calendar = lazy(() => import('../features/calendar/Calendar'))

/**
 * Loading fallback component for Suspense
 * Displays centered spinner while lazy components load
 */
const LoadingFallback = memo(() => (
  <div 
    className="min-h-screen flex items-center justify-center bg-gray-50"
    role="status"
    aria-label="Loading content"
  >
    <Spin size="large" tip="Loading..." />
  </div>
))
LoadingFallback.displayName = 'LoadingFallback'

/**
 * Protected Route Component
 * Restricts access to authenticated users only
 * Redirects to login if user is not authenticated
 * 
 * @param children - Child components to render if authenticated
 */
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return <LoadingFallback />
  }
  
  return isAuthenticated() ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
})
ProtectedRoute.displayName = 'ProtectedRoute'

/**
 * Public Route Component
 * Redirects authenticated users to onboarding
 * Allows unauthenticated users to access public pages
 * 
 * @param children - Child components to render if not authenticated
 */
const PublicRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return <LoadingFallback />
  }
  
  return isAuthenticated() ? <Navigate to={ROUTES.ONBOARDING} replace /> : <>{children}</>
})
PublicRoute.displayName = 'PublicRoute'

/**
 * Application Routes Component
 * Defines all application routes with lazy loading and Suspense
 * Implements code splitting for optimal performance
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
      <Route 
        path={ROUTES.LOGIN} 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path={ROUTES.ONBOARDING} 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.DASHBOARD} 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.LEADS} 
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.LEAD_DETAILS} 
        element={
          <ProtectedRoute>
            <LeadDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.LEAD_PROGRESS} 
        element={
          <ProtectedRoute>
            <LeadProgress />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.CALENDAR} 
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } 
      />
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LEADS} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LEADS} replace />} />
      </Routes>
    </Suspense>
  )
}
