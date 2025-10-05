import { Button, Card, Input, DatePicker, TimePicker, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'

const { Text } = Typography

interface EventFormProps {
  eventName: string
  eventDate: Dayjs | null
  eventTime: Dayjs | null
  onNameChange: (value: string) => void
  onDateChange: (date: Dayjs | null) => void
  onTimeChange: (time: Dayjs | null) => void
  onSave: () => void
  onCancel: () => void
  saveButtonText?: string
}

export function EventForm({
  eventName,
  eventDate,
  eventTime,
  onNameChange,
  onDateChange,
  onTimeChange,
  onSave,
  onCancel,
  saveButtonText = 'Save'
}: EventFormProps) {
  const isValid = eventName && eventDate && eventTime

  return (
    <Card 
      className="w-full bg-blue-50 border border-blue-200"
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong className="block mb-2">Event Name</Text>
          <Input
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => onNameChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Date</Text>
          <DatePicker
            value={eventDate}
            onChange={onDateChange}
            format="MMMM DD, YYYY"
            size="large"
            className="w-full"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Time</Text>
          <TimePicker
            value={eventTime}
            onChange={onTimeChange}
            format="hh:mm A"
            use12Hours
            size="large"
            className="w-full"
          />
        </div>
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
