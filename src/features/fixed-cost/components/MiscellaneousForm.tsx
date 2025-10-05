import { memo, useState, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { Card, Input, InputNumber, Button, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import type { MiscellaneousItem } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface MiscellaneousFormProps {
  miscellaneous: MiscellaneousItem[]
  onSave: (miscellaneous: MiscellaneousItem[]) => void
  onCancel: () => void
}

/**
 * Miscellaneous Form Component
 * Manages other and miscellaneous expenses with add/edit/delete functionality
 * Follows React best practices with memoization and proper state management
 * 
 * @param props - Component props
 */
export const MiscellaneousForm: FC<MiscellaneousFormProps> = memo(({
  miscellaneous: initialMiscellaneous,
  onSave,
  onCancel
}) => {
  const [miscellaneous, setMiscellaneous] = useState<MiscellaneousItem[]>(initialMiscellaneous)
  
  // New miscellaneous state - Start with form open if no items exist
  const [showAddItem, setShowAddItem] = useState(initialMiscellaneous.length === 0)
  const [newName, setNewName] = useState('')
  const [newCharges, setNewCharges] = useState<number>(0)

  // Edit miscellaneous state
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCharges, setEditCharges] = useState<number>(0)

  /**
   * Handle add miscellaneous item
   * Adds new item to the list
   */
  const handleAddItem = useCallback(() => {
    if (newName && newCharges > 0) {
      setMiscellaneous([...miscellaneous, { name: newName, charges: newCharges }])
      setNewName('')
      setNewCharges(0)
      setShowAddItem(false)
    }
  }, [newName, newCharges, miscellaneous])

  /**
   * Handle remove miscellaneous item
   * If removing the last item, auto-save and exit edit mode
   */
  const handleRemove = useCallback((index: number) => {
    const updatedMiscellaneous = miscellaneous.filter((_, i) => i !== index)
    
    // If this was the last item, auto-save and exit
    if (updatedMiscellaneous.length === 0) {
      onSave(updatedMiscellaneous)
    } else {
      // Otherwise, just update the state
      setMiscellaneous(updatedMiscellaneous)
    }
  }, [miscellaneous, onSave])

  /**
   * Handle edit miscellaneous item
   * Opens edit form with item data
   */
  const handleEdit = useCallback((index: number) => {
    const item = miscellaneous[index]
    setEditingIndex(index)
    setEditName(item.name)
    setEditCharges(item.charges)
    setShowAddItem(false)
  }, [miscellaneous])

  /**
   * Handle cancel edit
   * Resets edit state
   */
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditName('')
    setEditCharges(0)
  }, [])

  /**
   * Handle update miscellaneous item
   * Updates item at editing index
   */
  const handleUpdate = useCallback(() => {
    if (editName && editCharges > 0 && editingIndex !== null) {
      const updated = [...miscellaneous]
      updated[editingIndex] = { name: editName, charges: editCharges }
      setMiscellaneous(updated)
      handleCancelEdit()
    }
  }, [editName, editCharges, editingIndex, miscellaneous, handleCancelEdit])

  /**
   * Handle save
   * Saves all miscellaneous items and exits edit mode
   */
  const handleSave = useCallback(() => {
    onSave(miscellaneous)
  }, [miscellaneous, onSave])

  /**
   * Validation - memoized to ensure reactivity
   * At least one item must exist
   */
  const isValid = useMemo(() => {
    return miscellaneous.length > 0
  }, [miscellaneous.length])

  /**
   * Calculate total charges
   */
  const total = useMemo(() => {
    return miscellaneous.reduce((sum, item) => sum + item.charges, 0)
  }, [miscellaneous])

  return (
    <Card className="w-full bg-blue-50 border border-blue-200">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center">
          <Text strong>Other & Miscellaneous Charges</Text>
          {!showAddItem && (
            <Button type="link" onClick={() => setShowAddItem(true)}>
              + Add Item
            </Button>
          )}
        </div>

        {/* Add Form */}
        {showAddItem && (
          <Card size="small" className="mb-2 bg-white">
            <Space direction="vertical" size="small" className="w-full">
              <Input 
                placeholder="Item name" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
              />
              <InputNumber
                placeholder="Monthly Charges"
                value={newCharges}
                onChange={(value) => setNewCharges(value || 0)}
                className="w-full"
                prefix="$"
                min={0}
                precision={2}
              />
              <div className="flex gap-2">
                <Button size="small" onClick={() => setShowAddItem(false)}>Cancel</Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleAddItem}
                  disabled={!newName || newCharges <= 0}
                >
                  Add
                </Button>
              </div>
            </Space>
          </Card>
        )}

        {/* Miscellaneous Items List */}
        {miscellaneous.map((item, index) => (
          <div key={index}>
            {editingIndex === index ? (
              /* Edit Form */
              <Card size="small" className="mb-2 bg-green-50 border border-green-200">
                <Space direction="vertical" size="small" className="w-full">
                  <Text strong className="text-green-700">Editing Item</Text>
                  <Input 
                    placeholder="Item name" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                  />
                  <InputNumber
                    placeholder="Monthly Charges"
                    value={editCharges}
                    onChange={(value) => setEditCharges(value || 0)}
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
                      disabled={!editName || editCharges <= 0}
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
                    <Text strong>{item.name}</Text>
                  </div>
                  <div className="text-right">
                    <Text strong>{formatCurrency(item.charges)}</Text>
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

        {miscellaneous.length === 0 && !showAddItem && (
          <Text type="secondary">No miscellaneous items added yet</Text>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <Text strong>Total:</Text>
          <Text strong className="text-xl text-blue-600">{formatCurrency(total)}</Text>
        </div>

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

MiscellaneousForm.displayName = 'MiscellaneousForm'

