import { useState, useCallback } from 'react'
import { Button, Card, Space, Divider, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { PaymentForm } from './PaymentForm'
import { PaymentCard } from './PaymentCard'
import type { Payment } from '../types'

const { Text } = Typography

interface PaymentListProps {
  payments: Payment[]
  onPaymentsChange: (payments: Payment[]) => void
}

export function PaymentList({ payments, onPaymentsChange }: PaymentListProps) {
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [newType, setNewType] = useState('')
  const [newAmount, setNewAmount] = useState<number>(0)
  const [newMethod, setNewMethod] = useState('')
  const [newDate, setNewDate] = useState<Dayjs | null>(null)
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editType, setEditType] = useState('')
  const [editAmount, setEditAmount] = useState<number>(0)
  const [editMethod, setEditMethod] = useState('')
  const [editDate, setEditDate] = useState<Dayjs | null>(null)

  const handleAddPayment = useCallback(() => {
    setShowAddPayment(true)
  }, [])

  const handleCancelAddPayment = useCallback(() => {
    setShowAddPayment(false)
    setNewType('')
    setNewAmount(0)
    setNewMethod('')
    setNewDate(null)
  }, [])

  const handleSavePayment = useCallback(() => {
    if (newType && newAmount > 0 && newMethod && newDate) {
      const newPayment: Payment = {
        type: newType,
        amount: newAmount,
        method: newMethod,
        date: newDate.format('MMMM DD, YYYY')
      }
      
      onPaymentsChange([...payments, newPayment])
      handleCancelAddPayment()
    }
  }, [newType, newAmount, newMethod, newDate, payments, onPaymentsChange, handleCancelAddPayment])

  const handleEditPayment = useCallback((index: number) => {
    const payment = payments[index]
    setEditingIndex(index)
    setEditType(payment.type)
    setEditAmount(payment.amount)
    setEditMethod(payment.method)
    setEditDate(dayjs(payment.date, 'MMMM DD, YYYY'))
  }, [payments])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditType('')
    setEditAmount(0)
    setEditMethod('')
    setEditDate(null)
  }, [])

  const handleUpdatePayment = useCallback(() => {
    if (editType && editAmount > 0 && editMethod && editDate && editingIndex !== null) {
      const updatedPayment: Payment = {
        type: editType,
        amount: editAmount,
        method: editMethod,
        date: editDate.format('MMMM DD, YYYY')
      }
      
      const updatedList = [...payments]
      updatedList[editingIndex] = updatedPayment
      onPaymentsChange(updatedList)
      handleCancelEdit()
    }
  }, [editType, editAmount, editMethod, editDate, editingIndex, payments, onPaymentsChange, handleCancelEdit])

  const handleDeletePayment = useCallback((index: number) => {
    const updatedList = payments.filter((_, i) => i !== index)
    onPaymentsChange(updatedList)
  }, [payments, onPaymentsChange])

  return (
    <Card 
      title="Payment Collection" 
      extra={
        <Button 
          type="text" 
          icon={<PlusOutlined />}
          onClick={handleAddPayment}
        >
          Add Payment
        </Button>
      }
      className="w-full"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* Add Payment Form */}
        {showAddPayment && (
          <PaymentForm
            paymentType={newType}
            amount={newAmount}
            method={newMethod}
            date={newDate}
            onTypeChange={setNewType}
            onAmountChange={(value) => setNewAmount(value || 0)}
            onMethodChange={setNewMethod}
            onDateChange={setNewDate}
            onSave={handleSavePayment}
            onCancel={handleCancelAddPayment}
            saveButtonText="Save"
          />
        )}

        {/* Payment List */}
        {payments?.map((payment, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <PaymentForm
                paymentType={editType}
                amount={editAmount}
                method={editMethod}
                date={editDate}
                onTypeChange={setEditType}
                onAmountChange={(value) => setEditAmount(value || 0)}
                onMethodChange={setEditMethod}
                onDateChange={setEditDate}
                onSave={handleUpdatePayment}
                onCancel={handleCancelEdit}
                saveButtonText="Update"
              />
            ) : (
              <>
                <PaymentCard
                  payment={payment}
                  onEdit={() => handleEditPayment(index)}
                  onDelete={() => handleDeletePayment(index)}
                  isAdvanceToken={index === 0}
                />
                {index === 0 && payments.length > 1 && (
                  <>
                    <Divider />
                    <Text strong>Payment History</Text>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </Space>
    </Card>
  )
}
