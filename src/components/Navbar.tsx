import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { DASHBOARD_COPY } from '../features/dashboard/dashboardStatics'
import { ROUTES } from '../routes/routeStatics'
import { Button, Avatar, Space } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'

export function Navbar() {
  const { userData, signOutUser } = useAuth()
  const navigate = useNavigate()

  const displayName = userData?.name || 'User'
  const photoURL = userData?.picture || undefined

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          {DASHBOARD_COPY.navbarTitle}
        </div>
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
