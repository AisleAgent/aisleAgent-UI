import { Button, Typography } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Payment } from '../types'

const { Text } = Typography

interface PaymentCardProps {
  payment: Payment
  onEdit: () => void
  onDelete: () => void
  isAdvanceToken?: boolean
}

export function PaymentCard({ payment, onEdit, onDelete, isAdvanceToken = false }: PaymentCardProps) {
  return (
    <div className="flex justify-between items-center py-3">
      <div className="flex-1">
        <Text strong className={isAdvanceToken ? 'text-lg' : ''}>{payment.type}</Text>
        <br />
        <Text type="secondary">{payment.date}</Text>
      </div>
      <div className="text-right flex items-center gap-3">
        <div>
          <Text strong className={isAdvanceToken ? 'text-lg' : ''}>${payment.amount.toFixed(2)}</Text>
          <br />
          <Text type="secondary">via {payment.method}</Text>
        </div>
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
