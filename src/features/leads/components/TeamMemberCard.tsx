import { Button, Card, Typography, Avatar, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TeamMember } from '../types'

const { Text } = Typography

interface TeamMemberCardProps {
  member: TeamMember
  onEdit: () => void
  onDelete: () => void
}

export function TeamMemberCard({ member, onEdit, onDelete }: TeamMemberCardProps) {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card 
      className="w-full hover:shadow-md transition-shadow"
      bodyStyle={{ padding: '16px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Avatar size={48} className="bg-blue-500">
            {member.avatar || getInitials(member.name)}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Text strong className="text-lg">{member.name}</Text>
              <Tag color={member.type === 'employee' ? 'blue' : 'green'}>
                {member.type === 'employee' ? 'Employee' : 'Freelancer'}
              </Tag>
            </div>
            {member.contactNumber && (
              <Text type="secondary" className="block text-sm">{member.contactNumber}</Text>
            )}
            {member.email && (
              <Text type="secondary" className="block text-sm">{member.email}</Text>
            )}
            {member.type === 'freelancer' && member.charges && (
              <Text type="secondary" className="block text-sm">
                Charges: <Text strong>${member.charges.toFixed(2)}</Text>
              </Text>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="large"
            className="text-blue-400 hover:text-blue-600"
            onClick={onEdit}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />}
            size="large"
            className="text-red-400 hover:text-red-600"
            onClick={onDelete}
          />
        </div>
      </div>
    </Card>
  )
}
