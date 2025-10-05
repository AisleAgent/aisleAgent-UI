import { memo, useState, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { Card, Radio, InputNumber, Input, Button, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import type { Employee } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface EmployeeSalaryFormProps {
  mode: 'total' | 'individual'
  totalSalary?: number
  employees?: Employee[]
  onSave: (mode: 'total' | 'individual', totalSalary?: number, employees?: Employee[]) => void
  onCancel: () => void
}

/**
 * Employee Salary Form Component
 * Allows switching between total salary or individual employee breakdown
 * 
 * @param props - Component props
 */
export const EmployeeSalaryForm: FC<EmployeeSalaryFormProps> = memo(({
  mode: initialMode,
  totalSalary: initialTotal,
  employees: initialEmployees,
  onSave,
  onCancel
}) => {
  const [mode, setMode] = useState<'total' | 'individual'>(initialMode)
  const [totalSalary, setTotalSalary] = useState<number>(initialTotal || 0)
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees || [])
  
  // New employee form state
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [newEmployeeId, setNewEmployeeId] = useState('')
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeePhone, setNewEmployeePhone] = useState('')
  const [newEmployeeSalary, setNewEmployeeSalary] = useState<number>(0)

  // Edit employee state
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editEmployeeId, setEditEmployeeId] = useState('')
  const [editEmployeeName, setEditEmployeeName] = useState('')
  const [editEmployeePhone, setEditEmployeePhone] = useState('')
  const [editEmployeeSalary, setEditEmployeeSalary] = useState<number>(0)

  const handleAddEmployee = useCallback(() => {
    if (newEmployeeId && newEmployeeName && newEmployeePhone && newEmployeeSalary > 0) {
      setEmployees([...employees, {
        employeeId: newEmployeeId,
        name: newEmployeeName,
        phoneNumber: newEmployeePhone,
        salary: newEmployeeSalary
      }])
      // Reset form
      setNewEmployeeId('')
      setNewEmployeeName('')
      setNewEmployeePhone('')
      setNewEmployeeSalary(0)
      setShowAddEmployee(false)
    }
  }, [newEmployeeId, newEmployeeName, newEmployeePhone, newEmployeeSalary, employees])

  /**
   * Handle remove employee
   * If removing the last employee, auto-save and exit edit mode
   */
  const handleRemoveEmployee = useCallback((index: number) => {
    const updatedEmployees = employees.filter((_, i) => i !== index)
    
    // If this was the last employee, auto-save and exit
    if (updatedEmployees.length === 0) {
      onSave(mode, undefined, updatedEmployees)
    } else {
      // Otherwise, just update the state
      setEmployees(updatedEmployees)
    }
  }, [employees, mode, onSave])

  /**
   * Handle edit employee
   * Opens edit form with employee data
   */
  const handleEditEmployee = useCallback((index: number) => {
    const employee = employees[index]
    setEditingIndex(index)
    setEditEmployeeId(employee.employeeId)
    setEditEmployeeName(employee.name)
    setEditEmployeePhone(employee.phoneNumber)
    setEditEmployeeSalary(employee.salary)
    setShowAddEmployee(false) // Close add form if open
  }, [employees])

  /**
   * Handle cancel edit
   * Resets edit state
   */
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditEmployeeId('')
    setEditEmployeeName('')
    setEditEmployeePhone('')
    setEditEmployeeSalary(0)
  }, [])

  /**
   * Handle update employee
   * Updates employee at editing index
   */
  const handleUpdateEmployee = useCallback(() => {
    if (editEmployeeId && editEmployeeName && editEmployeePhone && editEmployeeSalary > 0 && editingIndex !== null) {
      const updatedEmployees = [...employees]
      updatedEmployees[editingIndex] = {
        employeeId: editEmployeeId,
        name: editEmployeeName,
        phoneNumber: editEmployeePhone,
        salary: editEmployeeSalary
      }
      setEmployees(updatedEmployees)
      handleCancelEdit()
    }
  }, [editEmployeeId, editEmployeeName, editEmployeePhone, editEmployeeSalary, editingIndex, employees, handleCancelEdit])

  const handleSave = useCallback(() => {
    if (mode === 'total') {
      onSave(mode, totalSalary, undefined)
    } else {
      onSave(mode, undefined, employees)
    }
  }, [mode, totalSalary, employees, onSave])

  /**
   * Validation - memoized to ensure reactivity
   * For 'total' mode: totalSalary must be > 0
   * For 'individual' mode: at least one employee must exist
   */
  const isValid = useMemo(() => {
    if (mode === 'total') {
      return totalSalary > 0
    }
    return employees.length > 0
  }, [mode, totalSalary, employees.length])

  return (
    <Card className="w-full bg-blue-50 border border-blue-200">
      <Space direction="vertical" size="middle" className="w-full">
        {/* Mode Selection */}
        <div>
          <Text strong className="block mb-2">Salary Calculation Mode</Text>
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio value="total">Total Salary</Radio>
            <Radio value="individual">Individual Employees</Radio>
          </Radio.Group>
        </div>

        {/* Total Salary Mode */}
        {mode === 'total' && (
          <div>
            <Text strong className="block mb-2">Total Monthly Salary</Text>
            <InputNumber
              value={totalSalary}
              onChange={(value) => setTotalSalary(value || 0)}
              size="large"
              className="w-full"
              prefix="$"
              min={0}
              precision={2}
              placeholder="Enter total monthly salary"
            />
          </div>
        )}

        {/* Individual Employees Mode */}
        {mode === 'individual' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <Text strong>Employees</Text>
              {!showAddEmployee && (
                <Button type="link" onClick={() => setShowAddEmployee(true)}>
                  + Add Employee
                </Button>
              )}
            </div>

            {/* Add Employee Form */}
            {showAddEmployee && (
              <Card size="small" className="mb-2 bg-white">
                <Space direction="vertical" size="small" className="w-full">
                  <Input
                    placeholder="Employee ID"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                  />
                  <Input
                    placeholder="Name"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newEmployeePhone}
                    onChange={(e) => setNewEmployeePhone(e.target.value)}
                  />
                  <InputNumber
                    placeholder="Monthly Salary"
                    value={newEmployeeSalary}
                    onChange={(value) => setNewEmployeeSalary(value || 0)}
                    className="w-full"
                    prefix="$"
                    min={0}
                    precision={2}
                  />
                  <div className="flex gap-2">
                    <Button size="small" onClick={() => setShowAddEmployee(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleAddEmployee}
                      disabled={!newEmployeeId || !newEmployeeName || !newEmployeePhone || newEmployeeSalary <= 0}
                    >
                      Add
                    </Button>
                  </div>
                </Space>
              </Card>
            )}

            {/* Employee List */}
            {employees.map((emp, index) => (
              <div key={index}>
                {editingIndex === index ? (
                  /* Edit Form */
                  <Card size="small" className="mb-2 bg-green-50 border border-green-200">
                    <Space direction="vertical" size="small" className="w-full">
                      <Text strong className="text-green-700">Editing Employee</Text>
                      <Input
                        placeholder="Employee ID"
                        value={editEmployeeId}
                        onChange={(e) => setEditEmployeeId(e.target.value)}
                      />
                      <Input
                        placeholder="Name"
                        value={editEmployeeName}
                        onChange={(e) => setEditEmployeeName(e.target.value)}
                      />
                      <Input
                        placeholder="Phone Number"
                        value={editEmployeePhone}
                        onChange={(e) => setEditEmployeePhone(e.target.value)}
                      />
                      <InputNumber
                        placeholder="Monthly Salary"
                        value={editEmployeeSalary}
                        onChange={(value) => setEditEmployeeSalary(value || 0)}
                        className="w-full"
                        prefix="$"
                        min={0}
                        precision={2}
                      />
                      <div className="flex gap-2">
                        <Button size="small" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={handleUpdateEmployee}
                          disabled={!editEmployeeId || !editEmployeeName || !editEmployeePhone || editEmployeeSalary <= 0}
                        >
                          Update
                        </Button>
                      </div>
                    </Space>
                  </Card>
                ) : (
                  /* Display Card */
                  <Card size="small" className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text strong>{emp.name}</Text>
                        <br />
                        <Text type="secondary" className="text-sm">ID: {emp.employeeId}</Text>
                        <br />
                        <Text type="secondary" className="text-sm">{emp.phoneNumber}</Text>
                      </div>
                      <div className="text-right">
                        <Text strong>{formatCurrency(emp.salary)}</Text>
                        <br />
                        <div className="flex gap-1 justify-end">
                          <Button
                            type="link"
                            size="small"
                            onClick={() => handleEditEmployee(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => handleRemoveEmployee(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}

            {employees.length === 0 && !showAddEmployee && (
              <Text type="secondary">No employees added yet</Text>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            icon={<SaveOutlined />}
            disabled={!isValid}
          >
            Save
          </Button>
        </div>
      </Space>
    </Card>
  )
})

EmployeeSalaryForm.displayName = 'EmployeeSalaryForm'
