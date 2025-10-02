import { useAuthUser } from '../../lib/useAuthUser'
import { signOutUser } from '../../lib/auth'
import { DASHBOARD_COPY } from './dashboardStatics'
import Calendar from '../calendar/Calendar'

export default function Dashboard() {
  const { user } = useAuthUser()

  const displayName = user?.displayName || 'User'
  const photoURL = user?.photoURL || undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">{DASHBOARD_COPY.navbarTitle}</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{displayName}</span>
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="h-9 w-9 rounded-full border border-gray-200" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white grid place-items-center text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => signOutUser()}
              className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DASHBOARD_COPY.logout}
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">{DASHBOARD_COPY.welcomePrefix} {displayName}</h1>
          <p className="mt-2 text-gray-600">{DASHBOARD_COPY.signedInNote}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Calendar />
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="font-medium text-gray-900">Schedule a Meeting</div>
                <div className="text-sm text-gray-600">Create a new calendar event</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="font-medium text-gray-900">View Full Calendar</div>
                <div className="text-sm text-gray-600">Open Google Calendar</div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


