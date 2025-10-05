import { memo, useState, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { Card, Input, InputNumber, Button, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import type { Utility } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface UtilitiesFormProps {
  utilities: Utility[]
  onSave: (utilities: Utility[]) => void
  onCancel: () => void
}

/**
 * Utilities Form Component
 * Manages rent and utility expenses with add/edit/delete functionality
 * Follows React best practices with memoization and proper state management
 * 
 * @param props - Component props
 */
export const UtilitiesForm: FC<UtilitiesFormProps> = memo(({
  utilities: initialUtilities,
  onSave,
  onCancel
}) => {
  const [utilities, setUtilities] = useState<Utility[]>(initialUtilities)
  
  // New utility state - Start with form open if no utilities exist
  const [showAddUtility, setShowAddUtility] = useState(initialUtilities.length === 0)
  const [newName, setNewName] = useState('')
  const [newCharges, setNewCharges] = useState<number>(0)

  // Edit utility state
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCharges, setEditCharges] = useState<number>(0)

  /**
   * Handle add utility
   * Adds new utility to the list
   */
  const handleAddUtility = useCallback(() => {
    if (newName && newCharges > 0) {
      setUtilities([...utilities, { name: newName, charges: newCharges }])
      setNewName('')
      setNewCharges(0)
      setShowAddUtility(false)
    }
  }, [newName, newCharges, utilities])

  /**
   * Handle remove utility
   * If removing the last utility, auto-save and exit edit mode
   */
  const handleRemove = useCallback((index: number) => {
    const updatedUtilities = utilities.filter((_, i) => i !== index)
    
    // If this was the last utility, auto-save and exit
    if (updatedUtilities.length === 0) {
      onSave(updatedUtilities)
    } else {
      // Otherwise, just update the state
      setUtilities(updatedUtilities)
    }
  }, [utilities, onSave])

  /**
   * Handle edit utility
   * Opens edit form with utility data
   */
  const handleEdit = useCallback((index: number) => {
    const item = utilities[index]
    setEditingIndex(index)
    setEditName(item.name)
    setEditCharges(item.charges)
    setShowAddUtility(false)
  }, [utilities])

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
   * Handle update utility
   * Updates utility at editing index
   */
  const handleUpdate = useCallback(() => {
    if (editName && editCharges > 0 && editingIndex !== null) {
      const updated = [...utilities]
      updated[editingIndex] = { name: editName, charges: editCharges }
      setUtilities(updated)
      handleCancelEdit()
    }
  }, [editName, editCharges, editingIndex, utilities, handleCancelEdit])

  /**
   * Handle save
   * Saves all utilities and exits edit mode
   */
  const handleSave = useCallback(() => {
    onSave(utilities)
  }, [utilities, onSave])

  /**
   * Validation - memoized to ensure reactivity
   * At least one utility must exist
   */
  const isValid = useMemo(() => {
    return utilities.length > 0
  }, [utilities.length])

  /**
   * Calculate total charges
   */
  const total = useMemo(() => {
    return utilities.reduce((sum, item) => sum + item.charges, 0)
  }, [utilities])

  return (
    <Card className="w-full bg-blue-50 border border-blue-200">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center">
          <Text strong>Rent & Utilities</Text>
          {!showAddUtility && (
            <Button type="link" onClick={() => setShowAddUtility(true)}>
              + Add Utility
            </Button>
          )}
        </div>

        {/* Add Form */}
        {showAddUtility && (
          <Card size="small" className="mb-2 bg-white">
            <Space direction="vertical" size="small" className="w-full">
              <Input 
                placeholder="Utility name (e.g., Rent, Electricity)" 
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
                <Button size="small" onClick={() => setShowAddUtility(false)}>Cancel</Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleAddUtility}
                  disabled={!newName || newCharges <= 0}
                >
                  Add
                </Button>
              </div>
            </Space>
          </Card>
        )}

        {/* Utilities List */}
        {utilities.map((item, index) => (
          <div key={index}>
            {editingIndex === index ? (
              /* Edit Form */
              <Card size="small" className="mb-2 bg-green-50 border border-green-200">
                <Space direction="vertical" size="small" className="w-full">
                  <Text strong className="text-green-700">Editing Utility</Text>
                  <Input 
                    placeholder="Utility name" 
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

        {utilities.length === 0 && !showAddUtility && (
          <Text type="secondary">No utilities added yet</Text>
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

UtilitiesForm.displayName = 'UtilitiesForm'
