import { memo, useState, useCallback } from 'react'
import type { FC } from 'react'
import { Card, Button, Input, InputNumber, Space, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { formatCurrency } from '../../../utils'

const { Text } = Typography

interface GenericItem {
  name?: string
  agencyName?: string
  charges: number
}

interface GenericItemsListProps {
  title: string
  items: GenericItem[]
  onItemsChange: (items: GenericItem[]) => void
  namePlaceholder?: string
  nameField?: 'name' | 'agencyName'
}

/**
 * Generic Items List Component
 * Reusable component for Utilities, Advertisements, and Miscellaneous items
 * Follows DRY principle and component reusability
 * 
 * @param props - Component props
 */
export const GenericItemsList: FC<GenericItemsListProps> = memo(({
  title,
  items,
  onItemsChange,
  namePlaceholder = 'Item name',
  nameField = 'name'
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItems, setEditedItems] = useState<GenericItem[]>([])
  
  // New item state
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemCharges, setNewItemCharges] = useState<number>(0)

  const handleEdit = useCallback(() => {
    setEditedItems([...items])
    setIsEditing(true)
  }, [items])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditedItems([])
    setShowAddItem(false)
    setNewItemName('')
    setNewItemCharges(0)
  }, [])

  const handleSave = useCallback(() => {
    onItemsChange(editedItems)
    setIsEditing(false)
    setEditedItems([])
    setShowAddItem(false)
  }, [editedItems, onItemsChange])

  const handleAddItem = useCallback(() => {
    if (newItemName && newItemCharges > 0) {
      const newItem: GenericItem = { charges: newItemCharges }
      if (nameField === 'name') {
        newItem.name = newItemName
      } else {
        newItem.agencyName = newItemName
      }
      setEditedItems([...editedItems, newItem])
      setNewItemName('')
      setNewItemCharges(0)
      setShowAddItem(false)
    }
  }, [newItemName, newItemCharges, editedItems, nameField])

  const handleRemoveItem = useCallback((index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index))
  }, [editedItems])

  const handleUpdateItem = useCallback((index: number, field: 'name' | 'agencyName' | 'charges', value: string | number) => {
    const updated = [...editedItems]
    if (field === 'charges') {
      updated[index].charges = value as number
    } else if (field === 'name') {
      updated[index].name = value as string
    } else {
      updated[index].agencyName = value as string
    }
    setEditedItems(updated)
  }, [editedItems])

  const total = (isEditing ? editedItems : items).reduce((sum, item) => sum + item.charges, 0)
  const hasData = items.length > 0

  return (
    <Card
      title={title}
      extra={
        !isEditing ? (
          <Button 
            type={hasData ? "text" : "primary"} 
            icon={hasData ? <EditOutlined /> : undefined}
            onClick={handleEdit}
          >
            {hasData ? 'Edit' : 'Add'}
          </Button>
        ) : null
      }
      className="w-full"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* View Mode */}
        {!isEditing && (
          <>
            {items.length === 0 ? (
              <Text type="secondary">No items added yet</Text>
            ) : (
              <>
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                    <Text>{item.name || item.agencyName}</Text>
                    <Text strong>{formatCurrency(item.charges)}</Text>
                  </div>
                ))}
                <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-gray-200">
                  <Text>Total</Text>
                  <Text>{formatCurrency(total)}</Text>
                </div>
              </>
            )}
          </>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="bg-blue-50 p-3 rounded">
            {/* Add Item Button */}
            {!showAddItem && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setShowAddItem(true)}
                className="w-full mb-2"
              >
                Add Item
              </Button>
            )}

            {/* Add Item Form */}
            {showAddItem && (
              <Card size="small" className="mb-2 bg-white">
                <Space direction="vertical" size="small" className="w-full">
                  <Input
                    placeholder={namePlaceholder}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <InputNumber
                    placeholder="Monthly charges"
                    value={newItemCharges}
                    onChange={(value) => setNewItemCharges(value || 0)}
                    className="w-full"
                    prefix="$"
                    min={0}
                    precision={2}
                  />
                  <div className="flex gap-2">
                    <Button size="small" onClick={() => setShowAddItem(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleAddItem}
                      disabled={!newItemName || newItemCharges <= 0}
                    >
                      Add
                    </Button>
                  </div>
                </Space>
              </Card>
            )}

            {/* Existing Items */}
            {editedItems.map((item, index) => (
              <Card key={index} size="small" className="mb-2">
                <Space direction="vertical" size="small" className="w-full">
                  <Input
                    value={item.name || item.agencyName}
                    onChange={(e) => handleUpdateItem(index, nameField, e.target.value)}
                    placeholder={namePlaceholder}
                  />
                  <InputNumber
                    value={item.charges}
                    onChange={(value) => handleUpdateItem(index, 'charges', value || 0)}
                    className="w-full"
                    prefix="$"
                    min={0}
                    precision={2}
                  />
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                </Space>
              </Card>
            ))}

            {editedItems.length === 0 && !showAddItem && (
              <Text type="secondary">No items added yet. Click "Add Item" to get started.</Text>
            )}

            {/* Total in Edit Mode */}
            <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-gray-200">
              <Text>Total</Text>
              <Text>{formatCurrency(total)}</Text>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <Button onClick={handleCancel} icon={<CloseOutlined />}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                icon={<SaveOutlined />}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Space>
    </Card>
  )
})

GenericItemsList.displayName = 'GenericItemsList'
