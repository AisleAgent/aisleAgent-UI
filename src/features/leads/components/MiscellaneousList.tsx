import { useState, useCallback } from 'react'
import { Button, Card, Space, Divider, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { MiscellaneousForm } from './MiscellaneousForm'
import { MiscellaneousCard } from './MiscellaneousCard'
import type { MiscellaneousExpense } from '../types'

const { Text } = Typography

interface MiscellaneousListProps {
  miscellaneous: MiscellaneousExpense[]
  onMiscellaneousChange: (miscellaneous: MiscellaneousExpense[]) => void
}

export function MiscellaneousList({ miscellaneous, onMiscellaneousChange }: MiscellaneousListProps) {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCost, setNewCost] = useState<number>(0)
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editCategory, setEditCategory] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCost, setEditCost] = useState<number>(0)

  const handleAddExpense = useCallback(() => {
    setShowAddExpense(true)
  }, [])

  const handleCancelAddExpense = useCallback(() => {
    setShowAddExpense(false)
    setNewCategory('')
    setNewDescription('')
    setNewCost(0)
  }, [])

  const handleSaveExpense = useCallback(() => {
    if (newCategory && newDescription && newCost > 0) {
      const newExpense: MiscellaneousExpense = {
        category: newCategory,
        description: newDescription,
        cost: newCost
      }
      
      onMiscellaneousChange([...miscellaneous, newExpense])
      handleCancelAddExpense()
    }
  }, [newCategory, newDescription, newCost, miscellaneous, onMiscellaneousChange, handleCancelAddExpense])

  const handleEditExpense = useCallback((index: number) => {
    const expense = miscellaneous[index]
    setEditingIndex(index)
    setEditCategory(expense.category)
    setEditDescription(expense.description)
    setEditCost(expense.cost)
  }, [miscellaneous])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditCategory('')
    setEditDescription('')
    setEditCost(0)
  }, [])

  const handleUpdateExpense = useCallback(() => {
    if (editCategory && editDescription && editCost > 0 && editingIndex !== null) {
      const updatedExpense: MiscellaneousExpense = {
        category: editCategory,
        description: editDescription,
        cost: editCost
      }
      
      const updatedList = [...miscellaneous]
      updatedList[editingIndex] = updatedExpense
      onMiscellaneousChange(updatedList)
      handleCancelEdit()
    }
  }, [editCategory, editDescription, editCost, editingIndex, miscellaneous, onMiscellaneousChange, handleCancelEdit])

  const handleDeleteExpense = useCallback((index: number) => {
    const updatedList = miscellaneous.filter((_, i) => i !== index)
    onMiscellaneousChange(updatedList)
  }, [miscellaneous, onMiscellaneousChange])

  const total = miscellaneous.reduce((sum, item) => sum + item.cost, 0)

  return (
    <Card 
      title="Other & Miscellaneous Charges" 
      extra={
        <Button 
          type="text" 
          icon={<PlusOutlined />}
          onClick={handleAddExpense}
        >
          Add
        </Button>
      }
      className="w-full"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* Add Expense Form */}
        {showAddExpense && (
          <MiscellaneousForm
            category={newCategory}
            description={newDescription}
            cost={newCost}
            onCategoryChange={setNewCategory}
            onDescriptionChange={setNewDescription}
            onCostChange={(value) => setNewCost(value || 0)}
            onSave={handleSaveExpense}
            onCancel={handleCancelAddExpense}
            saveButtonText="Save"
          />
        )}

        {/* Expense List */}
        {miscellaneous?.map((expense, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <MiscellaneousForm
                category={editCategory}
                description={editDescription}
                cost={editCost}
                onCategoryChange={setEditCategory}
                onDescriptionChange={setEditDescription}
                onCostChange={(value) => setEditCost(value || 0)}
                onSave={handleUpdateExpense}
                onCancel={handleCancelEdit}
                saveButtonText="Update"
              />
            ) : (
              <MiscellaneousCard
                expense={expense}
                onEdit={() => handleEditExpense(index)}
                onDelete={() => handleDeleteExpense(index)}
              />
            )}
          </div>
        ))}
        
        {miscellaneous.length > 0 && (
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
