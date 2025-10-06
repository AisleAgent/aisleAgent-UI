import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography,
  Row,
  Col,
  message,
  Space,
  Table,
  Tag,
  Popconfirm
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined
} from '@ant-design/icons'
import { Navbar } from '../../components/Navbar'

const { Title, Text } = Typography

/**
 * Team Member Interface
 */
interface TeamMember {
  id: string
  name: string
  contact: string
  email?: string
  createdAt: string
}

/**
 * Team Member Form Values Interface
 */
interface TeamMemberFormValues {
  id: string
  name: string
  contact: string
  email?: string
}

/**
 * Mock team members data
 * In production, this would come from an API
 */
const mockTeamMembers: TeamMember[] = [
  {
    id: 'EMP001',
    name: 'John Doe',
    contact: '+1-555-123-4567',
    email: 'john.doe@example.com',
    createdAt: '2024-01-15'
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    contact: '+1-555-987-6543',
    email: 'jane.smith@example.com',
    createdAt: '2024-01-20'
  },
  {
    id: 'EMP003',
    name: 'Mike Johnson',
    contact: '+1-555-456-7890',
    createdAt: '2024-02-01'
  }
]

/**
 * AddTeamMember Component
 * Allows adding new team members to the system and displays them in a table
 * 
 * Features:
 * - Form validation
 * - Email is optional
 * - Table display of team members
 * - Edit and delete functionality
 * - Responsive layout
 * - Back navigation
 * - Success feedback
 * 
 * @returns {JSX.Element} AddTeamMember component
 */
export function AddTeamMember() {
  const navigate = useNavigate()
  const [form] = Form.useForm<TeamMemberFormValues>()
  const [loading, setLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [editingId, setEditingId] = useState<string | null>(null)

  /**
   * Handle form submission (Add or Update)
   * In production, this would make an API call
   */
  const handleSubmit = useCallback(async (values: TeamMemberFormValues) => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (editingId) {
        // Update existing team member
        setTeamMembers(prev => 
          prev.map(member => 
            member.id === editingId 
              ? { ...values, createdAt: member.createdAt }
              : member
          )
        )
        message.success('Team member updated successfully!')
        setEditingId(null)
      } else {
        // Check for duplicate ID
        if (teamMembers.some(member => member.id === values.id)) {
          message.error('Employee ID already exists!')
          setLoading(false)
          return
        }
        
        // Add new team member
        const newMember: TeamMember = {
          ...values,
          createdAt: new Date().toISOString().split('T')[0]
        }
        setTeamMembers(prev => [...prev, newMember])
        message.success('Team member added successfully!')
      }
      
      // Reset form
      form.resetFields()
    } catch (error) {
      console.error('Error saving team member:', error)
      message.error('Failed to save team member. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [form, editingId, teamMembers])

  /**
   * Handle edit team member
   */
  const handleEdit = useCallback((member: TeamMember) => {
    setEditingId(member.id)
    form.setFieldsValue({
      id: member.id,
      name: member.name,
      contact: member.contact,
      email: member.email
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [form])

  /**
   * Handle delete team member
   */
  const handleDelete = useCallback((id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id))
    message.success('Team member deleted successfully!')
    
    // If deleting the member being edited, clear the form
    if (editingId === id) {
      setEditingId(null)
      form.resetFields()
    }
  }, [editingId, form])

  /**
   * Handle cancel editing
   */
  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    form.resetFields()
  }, [form])

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  /**
   * Validate phone number format
   */
  const validatePhone = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter contact number')
    }
    
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
      return Promise.reject('Please enter a valid contact number')
    }
    
    return Promise.resolve()
  }

  /**
   * Validate email format (optional field)
   */
  const validateEmail = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve() // Email is optional
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return Promise.reject('Please enter a valid email address')
    }
    
    return Promise.resolve()
  }

  /**
   * Table columns definition
   */
  const columns: ColumnsType<TeamMember> = useMemo(() => [
    {
      title: 'Employee ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Space>
          <IdcardOutlined className="text-blue-600" />
          <Text strong>{id}</Text>
        </Space>
      ),
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact: string) => (
        <Space>
          <PhoneOutlined className="text-green-600" />
          <Text>{contact}</Text>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email?: string) => email ? (
        <Space>
          <MailOutlined className="text-purple-600" />
          <Text>{email}</Text>
        </Space>
      ) : (
        <Tag color="default">Not provided</Tag>
      )
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            className="text-blue-600 hover:text-blue-700"
          />
          <Popconfirm
            title="Delete team member"
            description="Are you sure you want to delete this team member?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ], [handleEdit, handleDelete])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Title level={2} className="mb-2">Team Management</Title>
              <Text type="secondary">
                Add and manage your team members
              </Text>
            </div>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Form Card */}
        <Card 
          className="mb-8 shadow-sm"
          title={
            <Space>
              <UserAddOutlined className="text-blue-600" />
              <span>{editingId ? 'Edit Team Member' : 'Add New Team Member'}</span>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark="optional"
          >
            <Row gutter={16}>
              {/* ID Field */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="id"
                  label="Employee ID"
                  rules={[
                    { required: true, message: 'Please enter employee ID' },
                    { min: 3, message: 'ID must be at least 3 characters' },
                    { max: 20, message: 'ID must not exceed 20 characters' }
                  ]}
                  tooltip="Unique identifier for the team member"
                >
                  <Input 
                    placeholder="e.g., EMP001" 
                    size="large"
                    maxLength={20}
                    disabled={!!editingId}
                  />
                </Form.Item>
              </Col>

              {/* Name Field */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { min: 2, message: 'Name must be at least 2 characters' },
                    { max: 50, message: 'Name must not exceed 50 characters' }
                  ]}
                >
                  <Input 
                    placeholder="e.g., John Doe" 
                    size="large"
                    maxLength={50}
                  />
                </Form.Item>
              </Col>

              {/* Contact Field */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="contact"
                  label="Contact Number"
                  rules={[
                    { validator: validatePhone }
                  ]}
                >
                  <Input 
                    placeholder="e.g., +1-555-123-4567" 
                    size="large"
                    maxLength={20}
                  />
                </Form.Item>
              </Col>

              {/* Email Field (Optional) */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { validator: validateEmail }
                  ]}
                  tooltip="Email is optional"
                >
                  <Input 
                    type="email"
                    placeholder="e.g., john.doe@example.com" 
                    size="large"
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Action Buttons */}
            <Form.Item className="mb-0 mt-6">
              <Space className="w-full justify-end">
                {editingId && (
                  <Button 
                    size="large"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button 
                  type="primary" 
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingId ? 'Update Team Member' : 'Add Team Member'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Team Members Table */}
        <Card 
          className="shadow-sm"
          title={
            <Space>
              <UserAddOutlined className="text-purple-600" />
              <span>Team Members ({teamMembers.length})</span>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={teamMembers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} members`,
              pageSizeOptions: ['10', '20', '50']
            }}
            scroll={{ x: 800 }}
            locale={{
              emptyText: (
                <div className="py-8">
                  <UserAddOutlined className="text-4xl text-gray-300 mb-3" />
                  <Text type="secondary" className="block">No team members yet</Text>
                  <Text type="secondary" className="text-sm">Add your first team member using the form above</Text>
                </div>
              )
            }}
          />
        </Card>

        {/* Helper Text */}
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="small">
              <Text strong className="text-blue-900">Tips:</Text>
              <ul className="text-blue-800 text-sm ml-4 space-y-1">
                <li>Employee ID must be unique and cannot be changed after creation</li>
                <li>Click the edit icon to update team member details</li>
                <li>Use the delete icon to remove team members from the system</li>
                <li>Contact number should include country code for international numbers</li>
                <li>Email address is optional but recommended for better communication</li>
              </ul>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddTeamMember

