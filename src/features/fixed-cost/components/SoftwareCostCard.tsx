import { memo } from 'react'
import type { FC } from 'react'
import { Card, Button, Typography, Tag } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { SoftwareCostCategory } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface SoftwareCostCardProps {
  data: SoftwareCostCategory
  total: number
  onEdit: () => void
}

export const SoftwareCostCard: FC<SoftwareCostCardProps> = memo(({ data, total, onEdit }) => {
  // Check if there's any data
  const hasData = total > 0 || (data.software && data.software.length > 0)

  return (
    <Card
      title="Software Cost"
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
        <Text type="secondary">No software cost data added yet</Text>
      ) : (
        // Data exists - show full details
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Text type="secondary">Mode:</Text>
            <Tag color={data.mode === 'total' ? 'blue' : 'green'}>
              {data.mode === 'total' ? 'Total Cost' : 'Individual Breakdown'}
            </Tag>
          </div>

          {data.mode === 'total' && (
            <div className="flex justify-between items-center">
              <Text>Total Monthly Cost:</Text>
              <Text strong className="text-lg">{formatCurrency(data.totalCost || 0)}</Text>
            </div>
          )}

          {data.mode === 'individual' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text type="secondary">Software:</Text>
                <Text type="secondary">{data.software?.length || 0} subscription(s)</Text>
              </div>
              {data.software?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                  <Text>{item.softwareName}</Text>
                  <Text strong>{formatCurrency(item.cost)}</Text>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <Text strong>Total:</Text>
            <Text strong className="text-xl text-blue-600">{formatCurrency(total)}</Text>
          </div>
        </div>
      )}
    </Card>
  )
})

SoftwareCostCard.displayName = 'SoftwareCostCard'
