import { memo, useState, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { Card, Radio, InputNumber, Input, Button, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import type { Software } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface SoftwareCostFormProps {
  mode: 'total' | 'individual'
  totalCost?: number
  software?: Software[]
  onSave: (mode: 'total' | 'individual', totalCost?: number, software?: Software[]) => void
  onCancel: () => void
}

export const SoftwareCostForm: FC<SoftwareCostFormProps> = memo(({
  mode: initialMode,
  totalCost: initialTotal,
  software: initialSoftware,
  onSave,
  onCancel
}) => {
  const [mode, setMode] = useState<'total' | 'individual'>(initialMode)
  const [totalCost, setTotalCost] = useState<number>(initialTotal || 0)
  const [software, setSoftware] = useState<Software[]>(initialSoftware || [])
  
  const [showAddSoftware, setShowAddSoftware] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCost, setNewCost] = useState<number>(0)

  // Edit software state
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCost, setEditCost] = useState<number>(0)

  const handleAddSoftware = useCallback(() => {
    if (newName && newCost > 0) {
      setSoftware([...software, { softwareName: newName, cost: newCost }])
      setNewName('')
      setNewCost(0)
      setShowAddSoftware(false)
    }
  }, [newName, newCost, software])

  /**
   * Handle remove software
   * If removing the last software, auto-save and exit edit mode
   */
  const handleRemove = useCallback((index: number) => {
    const updatedSoftware = software.filter((_, i) => i !== index)
    
    // If this was the last software, auto-save and exit
    if (updatedSoftware.length === 0) {
      onSave(mode, undefined, updatedSoftware)
    } else {
      // Otherwise, just update the state
      setSoftware(updatedSoftware)
    }
  }, [software, mode, onSave])

  const handleEdit = useCallback((index: number) => {
    const item = software[index]
    setEditingIndex(index)
    setEditName(item.softwareName)
    setEditCost(item.cost)
    setShowAddSoftware(false)
  }, [software])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditName('')
    setEditCost(0)
  }, [])

  const handleUpdate = useCallback(() => {
    if (editName && editCost > 0 && editingIndex !== null) {
      const updated = [...software]
      updated[editingIndex] = { softwareName: editName, cost: editCost }
      setSoftware(updated)
      handleCancelEdit()
    }
  }, [editName, editCost, editingIndex, software, handleCancelEdit])

  const handleSave = useCallback(() => {
    if (mode === 'total') {
      onSave(mode, totalCost, undefined)
    } else {
      onSave(mode, undefined, software)
    }
  }, [mode, totalCost, software, onSave])

  /**
   * Validation - memoized to ensure reactivity
   * For 'total' mode: totalCost must be > 0
   * For 'individual' mode: at least one software must exist
   */
  const isValid = useMemo(() => {
    if (mode === 'total') {
      return totalCost > 0
    }
    return software.length > 0
  }, [mode, totalCost, software.length])

  return (
    <Card className="w-full bg-blue-50 border border-blue-200">
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong className="block mb-2">Software Cost Mode</Text>
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio value="total">Total Cost</Radio>
            <Radio value="individual">Individual Software</Radio>
          </Radio.Group>
        </div>

        {mode === 'total' && (
          <div>
            <Text strong className="block mb-2">Total Monthly Software Cost</Text>
            <InputNumber
              value={totalCost}
              onChange={(value) => setTotalCost(value || 0)}
              size="large"
              className="w-full"
              prefix="$"
              min={0}
              precision={2}
              placeholder="Enter total monthly cost"
            />
          </div>
        )}

        {mode === 'individual' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <Text strong>Software Subscriptions</Text>
              {!showAddSoftware && (
                <Button type="link" onClick={() => setShowAddSoftware(true)}>
                  + Add Software
                </Button>
              )}
            </div>

            {showAddSoftware && (
              <Card size="small" className="mb-2 bg-white">
                <Space direction="vertical" size="small" className="w-full">
                  <Input placeholder="Software Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  <InputNumber
                    placeholder="Monthly Cost"
                    value={newCost}
                    onChange={(value) => setNewCost(value || 0)}
                    className="w-full"
                    prefix="$"
                    min={0}
                    precision={2}
                  />
                  <div className="flex gap-2">
                    <Button size="small" onClick={() => setShowAddSoftware(false)}>Cancel</Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleAddSoftware}
                      disabled={!newName || newCost <= 0}
                    >
                      Add
                    </Button>
                  </div>
                </Space>
              </Card>
            )}

            {software.map((item, index) => (
              <div key={index}>
                {editingIndex === index ? (
                  <Card size="small" className="mb-2 bg-green-50 border border-green-200">
                    <Space direction="vertical" size="small" className="w-full">
                      <Text strong className="text-green-700">Editing Software</Text>
                      <Input placeholder="Software Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <InputNumber
                        placeholder="Monthly Cost"
                        value={editCost}
                        onChange={(value) => setEditCost(value || 0)}
                        className="w-full"
                        prefix="$"
                        min={0}
                        precision={2}
                      />
                      <div className="flex gap-2">
                        <Button size="small" onClick={handleCancelEdit}>Cancel</Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={handleUpdate}
                          disabled={!editName || editCost <= 0}
                        >
                          Update
                        </Button>
                      </div>
                    </Space>
                  </Card>
                ) : (
                  <Card size="small" className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text strong>{item.softwareName}</Text>
                      </div>
                      <div className="text-right">
                        <Text strong>{formatCurrency(item.cost)}</Text>
                        <br />
                        <div className="flex gap-1 justify-end">
                          <Button type="link" size="small" onClick={() => handleEdit(index)}>
                            Edit
                          </Button>
                          <Button type="link" danger size="small" onClick={() => handleRemove(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}

            {software.length === 0 && !showAddSoftware && (
              <Text type="secondary">No software added yet</Text>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onCancel} icon={<CloseOutlined />}>Cancel</Button>
          <Button type="primary" onClick={handleSave} icon={<SaveOutlined />} disabled={!isValid}>
            Save
          </Button>
        </div>
      </Space>
    </Card>
  )
})

SoftwareCostForm.displayName = 'SoftwareCostForm'
