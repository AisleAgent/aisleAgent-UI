import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import Login from '../features/login/login'
import Onboarding from '../features/onboarding/onboarding'
import Dashboard from '../features/dashboard/dashboard'
import Leads from '../features/leads/Leads'
import Calendar from '../features/calendar/Calendar'
import { ROUTES } from './routeStatics'
import { Spin } from 'antd'

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Loading..." />
      </div>
    )
  }
  
  return isAuthenticated() ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

// Public Route component (redirects to onboarding if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Redirecting..." />
      </div>
    )
  }
  
  return isAuthenticated() ? <Navigate to={ROUTES.ONBOARDING} replace /> : <>{children}</>
}

export function AppRoutes() {
  return (
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
        path={ROUTES.CALENDAR} 
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } 
      />
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.ONBOARDING} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.ONBOARDING} replace />} />
    </Routes>
  )
}
