import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { DASHBOARD_COPY } from '../features/dashboard/dashboardStatics'
import { ROUTES } from '../routes/routeStatics'
import { Button, Avatar, Space } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'

export function Navbar() {
  const { userData, signOutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const displayName = userData?.name || 'User'
  const photoURL = userData?.picture || undefined

  const navigationItems = [
    { key: ROUTES.DASHBOARD, label: 'Dashboard' },
    { key: ROUTES.LEADS, label: 'Leads' },
    { key: ROUTES.CALENDAR, label: 'Calendar' }
  ]

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="text-lg font-semibold text-gray-900">
          Servaya
        </div>

        {/* Center: Navigation */}
        {location.pathname !== '/onboarding' && (
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.key}
                href={item.key}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(item.key)
                }}
                className={`font-medium text-sm transition-colors duration-200 hover:text-blue-600 ${
                  location.pathname === item.key
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Right: User Info */}
        <Space size="middle">
          <span className="text-sm text-gray-600">
            {displayName}
          </span>
          <Avatar 
            size={36}
            src={photoURL}
            icon={<UserOutlined />}
          />
          <Button
            type="default"
            onClick={() => {
              signOutUser()
              navigate(ROUTES.LOGIN)
            }}
            icon={<LogoutOutlined />}
            size="small"
          >
            {DASHBOARD_COPY.logout}
          </Button>
        </Space>
      </div>
    </nav>
  )
}
