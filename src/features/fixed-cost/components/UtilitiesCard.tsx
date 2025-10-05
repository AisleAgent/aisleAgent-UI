import { memo } from 'react'
import type { FC } from 'react'
import { Card, Button, Typography } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { Utility } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface UtilitiesCardProps {
  utilities: Utility[]
  total: number
  onEdit: () => void
}

/**
 * Utilities Display Card
 * Shows rent and utilities summary in view mode
 * 
 * @param props - Component props
 */
export const UtilitiesCard: FC<UtilitiesCardProps> = memo(({ utilities, total, onEdit }) => {
  // Check if there's any data
  const hasData = utilities.length > 0

  return (
    <Card
      title="Rent & Utilities"
      extra={
        <Button 
          type="text"
          icon={hasData ? <EditOutlined /> : <PlusOutlined />}
          onClick={onEdit}
        >
          {hasData ? 'Edit' : 'Add'}
        </Button>
      }
      className="w-full"
    >
      {!hasData ? (
        // Empty state - clean and minimal
        <Text type="secondary">No utilities added yet</Text>
      ) : (
        // Data exists - show full details
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <Text type="secondary">Utilities:</Text>
            <Text type="secondary">{utilities.length} item(s)</Text>
          </div>
          
          {utilities.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
              <Text>{item.name}</Text>
              <Text strong>{formatCurrency(item.charges)}</Text>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <Text strong>Total:</Text>
            <Text strong className="text-xl text-blue-600">{formatCurrency(total)}</Text>
          </div>
        </div>
      )}
    </Card>
  )
})

UtilitiesCard.displayName = 'UtilitiesCard'

