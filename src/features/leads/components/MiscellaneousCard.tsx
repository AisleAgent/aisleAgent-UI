import { Button, Typography } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { MiscellaneousExpense } from '../types'

const { Text } = Typography

interface MiscellaneousCardProps {
  expense: MiscellaneousExpense
  onEdit: () => void
  onDelete: () => void
}

export function MiscellaneousCard({ expense, onEdit, onDelete }: MiscellaneousCardProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex gap-4 flex-1">
        <Text className="w-32">{expense.category}</Text>
        <Text className="flex-1">{expense.description}</Text>
      </div>
      <div className="flex items-center gap-3">
        <Text strong>${expense.cost.toFixed(2)}</Text>
        <div className="flex items-center gap-1">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            className="text-blue-400 hover:text-blue-600"
            onClick={onEdit}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />}
            size="small"
            className="text-red-400 hover:text-red-600"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  )
}
