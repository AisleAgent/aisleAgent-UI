import { Button, Card, Input, InputNumber, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

interface EquipmentFormProps {
  equipmentName: string
  cost: number
  onNameChange: (value: string) => void
  onCostChange: (value: number | null) => void
  onSave: () => void
  onCancel: () => void
  saveButtonText?: string
}

export function EquipmentForm({
  equipmentName,
  cost,
  onNameChange,
  onCostChange,
  onSave,
  onCancel,
  saveButtonText = 'Save'
}: EquipmentFormProps) {
  const isValid = equipmentName && cost > 0

  return (
    <Card 
      className="w-full bg-blue-50 border border-blue-200"
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong className="block mb-2">Equipment Name</Text>
          <Input
            placeholder="Enter equipment name"
            value={equipmentName}
            onChange={(e) => onNameChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Cost</Text>
          <InputNumber
            placeholder="Enter cost"
            value={cost}
            onChange={onCostChange}
            size="large"
            className="w-full"
            prefix="$"
            min={0}
            precision={2}
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
