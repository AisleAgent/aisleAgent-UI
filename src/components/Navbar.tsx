import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { DASHBOARD_COPY } from '../features/dashboard/dashboardStatics'
import { ROUTES } from '../routes/routeStatics'
import { Button, Avatar, Drawer, Space } from 'antd'
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'

export function Navbar() {
  const { userData, signOutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const displayName = userData?.name || 'User'
  const photoURL = userData?.picture || undefined

  const navigationItems = [
    { key: ROUTES.DASHBOARD, label: 'Dashboard' },
    { key: ROUTES.LEADS, label: 'Leads' },
    { key: ROUTES.CALENDAR, label: 'Calendar' },
    { key: ROUTES.FIXED_COST, label: 'Fixed Cost' },
    { key: ROUTES.ADD_TEAM, label: 'Add Team' }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    signOutUser()
    navigate(ROUTES.LOGIN)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex-shrink-0">
            <div className="text-xl font-bold text-gray-900">
            <h1 
              className="text-4xl font-bold text-blue-600 drop-shadow-sm" 
              style={{ 
                fontFamily: 'Dancing Script, cursive',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              Servaya
            </h1>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          {location.pathname !== '/onboarding' && (
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
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
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Right: Desktop User Info */}
          <div className="hidden md:flex items-center">
            <Space size="middle">
              <span className="text-sm text-gray-600 hidden lg:inline">
                {displayName}
              </span>
              <Avatar 
                size={36}
                src={photoURL}
                icon={<UserOutlined />}
              />
              <Button
                type="default"
                onClick={handleLogout}
                icon={<LogoutOutlined />}
                size="small"
                className="lg:hidden"
              />
            </Space>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Avatar 
              size={32}
              src={photoURL}
              icon={<UserOutlined />}
            />
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <Avatar 
              size={40}
              src={photoURL}
              icon={<UserOutlined />}
            />
            <span className="text-base font-medium">{displayName}</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="flex flex-col space-y-1">
          {location.pathname !== '/onboarding' && navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={`text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                location.pathname === item.key
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Button
              type="default"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              block
              danger
            >
              {DASHBOARD_COPY.logout}
            </Button>
          </div>
        </div>
      </Drawer>
    </nav>
  )
}
