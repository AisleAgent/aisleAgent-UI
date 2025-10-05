import { Button, Typography } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Equipment } from '../types'

const { Text } = Typography

interface EquipmentCardProps {
  equipment: Equipment
  onEdit: () => void
  onDelete: () => void
}

export function EquipmentCard({ equipment, onEdit, onDelete }: EquipmentCardProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex-1">
        <Text>{equipment.name}</Text>
      </div>
      <div className="flex items-center gap-3">
        <Text strong>${equipment.cost.toFixed(2)}</Text>
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
