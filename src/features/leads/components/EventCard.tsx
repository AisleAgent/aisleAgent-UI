import { Button, Card, Typography } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Event } from '../types'

const { Text } = Typography

interface EventCardProps {
  event: Event
  onEdit: () => void
  onDelete: () => void
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <Card 
      className="w-full hover:shadow-md transition-shadow"
      bodyStyle={{ padding: '16px' }}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Text strong className="text-lg block">{event.name}</Text>
          <Text type="secondary">{event.date} - {event.time}</Text>
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
