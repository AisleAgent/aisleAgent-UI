import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import Login from '../features/login/login'
import Dashboard from '../features/dashboard/dashboard'
import { ROUTES, ROUTE_COPY } from './routeStatics'

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">{ROUTE_COPY.REDIRECTING_TO_LOGIN}</div>
      </div>
    )
  }
  
  return isAuthenticated() ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

// Public Route component (redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">{ROUTE_COPY.REDIRECTING_TO_DASHBOARD}</div>
      </div>
    )
  }
  
  return isAuthenticated() ? <Navigate to={ROUTES.DASHBOARD} replace /> : <>{children}</>
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
        path={ROUTES.DASHBOARD} 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path={ROUTES.CATCH_ALL} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
