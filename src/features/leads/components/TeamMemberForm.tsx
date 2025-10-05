import { Button, Card, Input, InputNumber, Select, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

interface TeamMemberFormProps {
  memberName: string
  contactNumber: string
  email: string
  memberType: 'employee' | 'freelancer'
  charges: number
  onNameChange: (value: string) => void
  onContactChange: (value: string) => void
  onEmailChange: (value: string) => void
  onTypeChange: (value: 'employee' | 'freelancer') => void
  onChargesChange: (value: number | null) => void
  onSave: () => void
  onCancel: () => void
  saveButtonText?: string
}

export function TeamMemberForm({
  memberName,
  contactNumber,
  email,
  memberType,
  charges,
  onNameChange,
  onContactChange,
  onEmailChange,
  onTypeChange,
  onChargesChange,
  onSave,
  onCancel,
  saveButtonText = 'Save'
}: TeamMemberFormProps) {
  const isValid = memberName && contactNumber && memberType && (memberType === 'employee' || (memberType === 'freelancer' && charges > 0))

  return (
    <Card 
      className="w-full bg-blue-50 border border-blue-200"
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong className="block mb-2">Name</Text>
          <Input
            placeholder="Enter team member name"
            value={memberName}
            onChange={(e) => onNameChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Contact Number</Text>
          <Input
            placeholder="Enter contact number"
            value={contactNumber}
            onChange={(e) => onContactChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Email <Text type="secondary">(Optional)</Text></Text>
          <Input
            placeholder="Enter email address"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Type</Text>
          <Select
            value={memberType}
            onChange={onTypeChange}
            size="large"
            className="w-full"
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'freelancer', label: 'Freelancer' }
            ]}
          />
        </div>
        {memberType === 'freelancer' && (
          <div>
            <Text strong className="block mb-2">Charges</Text>
            <InputNumber
              placeholder="Enter freelancer charges"
              value={charges}
              onChange={onChargesChange}
              size="large"
              className="w-full"
              prefix="$"
              min={0}
              precision={2}
            />
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button 
            onClick={onCancel}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
          <Button 
            type="primary"
            onClick={onSave}
            icon={<SaveOutlined />}
            disabled={!isValid}
          >
            {saveButtonText}
          </Button>
        </div>
      </Space>
    </Card>
  )
}
