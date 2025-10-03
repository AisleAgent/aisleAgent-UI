import { useAuth } from '../../lib/authContext'
import { Navbar } from '../../components/Navbar'
import { DASHBOARD_COPY } from './dashboardStatics'
import { Card, Descriptions, Tag } from 'antd'

export default function Dashboard() {
  const { userData } = useAuth()

  const displayName = userData?.name || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {DASHBOARD_COPY.welcomePrefix} {displayName}
            </h1>
            <p className="mt-2 text-gray-600">
              {DASHBOARD_COPY.signedInNote}
            </p>
          </div>
          
          <Card 
            title="Welcome to your Dashboard" 
            className="shadow-lg"
          >
            <p className="text-gray-600 mb-4">
              You are successfully authenticated and can access all features.
            </p>
            
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Email">
                {userData?.email}
              </Descriptions.Item>
              <Descriptions.Item label="User Type">
                <Tag color="blue">{userData?.userType || 'Standard'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={userData?.isActive ? 'green' : 'red'}>
                  {userData?.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </main>
    </div>
  )
}


