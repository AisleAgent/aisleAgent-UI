import { memo } from 'react'
import type { FC } from 'react'
import { Card, Button, Typography, Tag } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { EmployeeSalaryCategory } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface EmployeeSalaryCardProps {
  data: EmployeeSalaryCategory
  total: number
  onEdit: () => void
}

/**
 * Employee Salary Display Card
 * Shows summary in view mode
 * 
 * @param props - Component props
 */
export const EmployeeSalaryCard: FC<EmployeeSalaryCardProps> = memo(({
  data,
  total,
  onEdit
}) => {
  // Check if there's any data
  const hasData = total > 0 || (data.employees && data.employees.length > 0)

  return (
    <Card
      title="Employee Salary"
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
        <Text type="secondary">No employee salary data added yet</Text>
      ) : (
        // Data exists - show full details
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Text type="secondary">Mode:</Text>
            <Tag color={data.mode === 'total' ? 'blue' : 'green'}>
              {data.mode === 'total' ? 'Total Salary' : 'Individual Breakdown'}
            </Tag>
          </div>

          {data.mode === 'total' && (
            <div className="flex justify-between items-center">
              <Text>Total Monthly Salary:</Text>
              <Text strong className="text-lg">{formatCurrency(data.totalSalary || 0)}</Text>
            </div>
          )}

          {data.mode === 'individual' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text type="secondary">Employees:</Text>
                <Text type="secondary">{data.employees?.length || 0} employee(s)</Text>
              </div>
              {data.employees?.map((emp, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                  <div>
                    <Text>{emp.name}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">ID: {emp.employeeId}</Text>
                  </div>
                  <Text>{formatCurrency(emp.salary)}</Text>
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

EmployeeSalaryCard.displayName = 'EmployeeSalaryCard'
