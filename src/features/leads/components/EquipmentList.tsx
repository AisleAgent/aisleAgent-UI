import { useState, useCallback } from 'react'
import { Button, Card, Space, Divider, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { EquipmentForm } from './EquipmentForm'
import { EquipmentCard } from './EquipmentCard'
import type { Equipment } from '../types'

const { Text } = Typography

interface EquipmentListProps {
  equipment: Equipment[]
  onEquipmentChange: (equipment: Equipment[]) => void
}

export function EquipmentList({ equipment, onEquipmentChange }: EquipmentListProps) {
  const [showAddEquipment, setShowAddEquipment] = useState(false)
  const [newEquipmentName, setNewEquipmentName] = useState('')
  const [newEquipmentCost, setNewEquipmentCost] = useState<number>(0)
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editEquipmentName, setEditEquipmentName] = useState('')
  const [editEquipmentCost, setEditEquipmentCost] = useState<number>(0)

  const handleAddEquipment = useCallback(() => {
    setShowAddEquipment(true)
  }, [])

  const handleCancelAddEquipment = useCallback(() => {
    setShowAddEquipment(false)
    setNewEquipmentName('')
    setNewEquipmentCost(0)
  }, [])

  const handleSaveEquipment = useCallback(() => {
    if (newEquipmentName && newEquipmentCost > 0) {
      const newEquipment: Equipment = {
        name: newEquipmentName,
        cost: newEquipmentCost
      }
      
      onEquipmentChange([...equipment, newEquipment])
      handleCancelAddEquipment()
    }
  }, [newEquipmentName, newEquipmentCost, equipment, onEquipmentChange, handleCancelAddEquipment])

  const handleEditEquipment = useCallback((index: number) => {
    const item = equipment[index]
    setEditingIndex(index)
    setEditEquipmentName(item.name)
    setEditEquipmentCost(item.cost)
  }, [equipment])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditEquipmentName('')
    setEditEquipmentCost(0)
  }, [])

  const handleUpdateEquipment = useCallback(() => {
    if (editEquipmentName && editEquipmentCost > 0 && editingIndex !== null) {
      const updatedEquipment: Equipment = {
        name: editEquipmentName,
        cost: editEquipmentCost
      }
      
      const updatedList = [...equipment]
      updatedList[editingIndex] = updatedEquipment
      onEquipmentChange(updatedList)
      handleCancelEdit()
    }
  }, [editEquipmentName, editEquipmentCost, editingIndex, equipment, onEquipmentChange, handleCancelEdit])

  const handleDeleteEquipment = useCallback((index: number) => {
    const updatedList = equipment.filter((_, i) => i !== index)
    onEquipmentChange(updatedList)
  }, [equipment, onEquipmentChange])

  const total = equipment.reduce((sum, item) => sum + item.cost, 0)

  return (
    <Card 
      title="Equipment Allocation" 
      extra={
        <Button 
          type="text" 
          icon={<PlusOutlined />}
          onClick={handleAddEquipment}
        >
          Add
        </Button>
      }
      className="w-full"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* Add Equipment Form */}
        {showAddEquipment && (
          <EquipmentForm
            equipmentName={newEquipmentName}
            cost={newEquipmentCost}
            onNameChange={setNewEquipmentName}
            onCostChange={(value) => setNewEquipmentCost(value || 0)}
            onSave={handleSaveEquipment}
            onCancel={handleCancelAddEquipment}
            saveButtonText="Save"
          />
        )}

        {/* Equipment List */}
        {equipment?.map((item, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <EquipmentForm
                equipmentName={editEquipmentName}
                cost={editEquipmentCost}
                onNameChange={setEditEquipmentName}
                onCostChange={(value) => setEditEquipmentCost(value || 0)}
                onSave={handleUpdateEquipment}
                onCancel={handleCancelEdit}
                saveButtonText="Update"
              />
            ) : (
              <EquipmentCard
                equipment={item}
                onEdit={() => handleEditEquipment(index)}
                onDelete={() => handleDeleteEquipment(index)}
              />
            )}
          </div>
        ))}
        
        {equipment.length > 0 && (
          <>
            <Divider />
            <div className="flex justify-between font-semibold">
              <Text>Total</Text>
              <Text>${total.toFixed(2)}</Text>
            </div>
          </>
        )}
      </Space>
    </Card>
  )
}
