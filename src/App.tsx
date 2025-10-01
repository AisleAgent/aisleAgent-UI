import Login from './features/login/login'
import Dashboard from './features/dashboard/dashboard'
import { useAuthUser } from './lib/useAuthUser'

function App() {
  const { user, loading } = useAuthUser()  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return user ? <Dashboard /> : <Login />
}

export default App
