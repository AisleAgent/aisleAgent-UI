import { Button, Card, Input, InputNumber, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

interface MiscellaneousFormProps {
  category: string
  description: string
  cost: number
  onCategoryChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onCostChange: (value: number | null) => void
  onSave: () => void
  onCancel: () => void
  saveButtonText?: string
}

export function MiscellaneousForm({
  category,
  description,
  cost,
  onCategoryChange,
  onDescriptionChange,
  onCostChange,
  onSave,
  onCancel,
  saveButtonText = 'Save'
}: MiscellaneousFormProps) {
  const isValid = category && description && cost > 0

  return (
    <Card 
      className="w-full bg-blue-50 border border-blue-200"
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong className="block mb-2">Category</Text>
          <Input
            placeholder="Enter category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Description</Text>
          <Input
            placeholder="Enter description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
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
