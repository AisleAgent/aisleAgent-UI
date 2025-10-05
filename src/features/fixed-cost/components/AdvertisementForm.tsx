import { memo, useState, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { Card, Input, InputNumber, Button, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import type { AdAgency } from '../types'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface AdvertisementFormProps {
  advertisements: AdAgency[]
  onSave: (advertisements: AdAgency[]) => void
  onCancel: () => void
}

/**
 * Advertisement Form Component
 * Manages advertisement agency expenses with add/edit/delete functionality
 * Follows React best practices with memoization and proper state management
 * 
 * @param props - Component props
 */
export const AdvertisementForm: FC<AdvertisementFormProps> = memo(({
  advertisements: initialAdvertisements,
  onSave,
  onCancel
}) => {
  const [advertisements, setAdvertisements] = useState<AdAgency[]>(initialAdvertisements)
  
  // New advertisement state - Start with form open if no advertisements exist
  const [showAddAd, setShowAddAd] = useState(initialAdvertisements.length === 0)
  const [newAgencyName, setNewAgencyName] = useState('')
  const [newCharges, setNewCharges] = useState<number>(0)

  // Edit advertisement state
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editAgencyName, setEditAgencyName] = useState('')
  const [editCharges, setEditCharges] = useState<number>(0)

  /**
   * Handle add advertisement
   * Adds new advertisement to the list
   */
  const handleAddAd = useCallback(() => {
    if (newAgencyName && newCharges > 0) {
      setAdvertisements([...advertisements, { agencyName: newAgencyName, charges: newCharges }])
      setNewAgencyName('')
      setNewCharges(0)
      setShowAddAd(false)
    }
  }, [newAgencyName, newCharges, advertisements])

  /**
   * Handle remove advertisement
   * If removing the last advertisement, auto-save and exit edit mode
   */
  const handleRemove = useCallback((index: number) => {
    const updatedAdvertisements = advertisements.filter((_, i) => i !== index)
    
    // If this was the last advertisement, auto-save and exit
    if (updatedAdvertisements.length === 0) {
      onSave(updatedAdvertisements)
    } else {
      // Otherwise, just update the state
      setAdvertisements(updatedAdvertisements)
    }
  }, [advertisements, onSave])

  /**
   * Handle edit advertisement
   * Opens edit form with advertisement data
   */
  const handleEdit = useCallback((index: number) => {
    const item = advertisements[index]
    setEditingIndex(index)
    setEditAgencyName(item.agencyName)
    setEditCharges(item.charges)
    setShowAddAd(false)
  }, [advertisements])

  /**
   * Handle cancel edit
   * Resets edit state
   */
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditAgencyName('')
    setEditCharges(0)
  }, [])

  /**
   * Handle update advertisement
   * Updates advertisement at editing index
   */
  const handleUpdate = useCallback(() => {
    if (editAgencyName && editCharges > 0 && editingIndex !== null) {
      const updated = [...advertisements]
      updated[editingIndex] = { agencyName: editAgencyName, charges: editCharges }
      setAdvertisements(updated)
      handleCancelEdit()
    }
  }, [editAgencyName, editCharges, editingIndex, advertisements, handleCancelEdit])

  /**
   * Handle save
   * Saves all advertisements and exits edit mode
   */
  const handleSave = useCallback(() => {
    onSave(advertisements)
  }, [advertisements, onSave])

  /**
   * Validation - memoized to ensure reactivity
   * At least one advertisement must exist
   */
  const isValid = useMemo(() => {
    return advertisements.length > 0
  }, [advertisements.length])

  /**
   * Calculate total charges
   */
  const total = useMemo(() => {
    return advertisements.reduce((sum, item) => sum + item.charges, 0)
  }, [advertisements])

  return (
    <Card className="w-full bg-blue-50 border border-blue-200">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center">
          <Text strong>Advertisement Charges</Text>
          {!showAddAd && (
            <Button type="link" onClick={() => setShowAddAd(true)}>
              + Add Agency
            </Button>
          )}
        </div>

        {/* Add Form */}
        {showAddAd && (
          <Card size="small" className="mb-2 bg-white">
            <Space direction="vertical" size="small" className="w-full">
              <Input 
                placeholder="Agency name" 
                value={newAgencyName} 
                onChange={(e) => setNewAgencyName(e.target.value)} 
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
                <Button size="small" onClick={() => setShowAddAd(false)}>Cancel</Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleAddAd}
                  disabled={!newAgencyName || newCharges <= 0}
                >
                  Add
                </Button>
              </div>
            </Space>
          </Card>
        )}

        {/* Advertisements List */}
        {advertisements.map((item, index) => (
          <div key={index}>
            {editingIndex === index ? (
              /* Edit Form */
              <Card size="small" className="mb-2 bg-green-50 border border-green-200">
                <Space direction="vertical" size="small" className="w-full">
                  <Text strong className="text-green-700">Editing Agency</Text>
                  <Input 
                    placeholder="Agency name" 
                    value={editAgencyName} 
                    onChange={(e) => setEditAgencyName(e.target.value)} 
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
                      disabled={!editAgencyName || editCharges <= 0}
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
                    <Text strong>{item.agencyName}</Text>
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

        {advertisements.length === 0 && !showAddAd && (
          <Text type="secondary">No advertisements added yet</Text>
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

AdvertisementForm.displayName = 'AdvertisementForm'
