import { Button, Card, Input, InputNumber, DatePicker, Space, Typography } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'

const { Text } = Typography

interface PaymentFormProps {
  paymentType: string
  amount: number
  method: string
  date: Dayjs | null
  onTypeChange: (value: string) => void
  onAmountChange: (value: number | null) => void
  onMethodChange: (value: string) => void
  onDateChange: (value: Dayjs | null) => void
  onSave: () => void
  onCancel: () => void
  saveButtonText?: string
}

export function PaymentForm({
  paymentType,
  amount,
  method,
  date,
  onTypeChange,
  onAmountChange,
  onMethodChange,
  onDateChange,
  onSave,
  onCancel,
  saveButtonText = 'Save'
}: PaymentFormProps) {
  const isValid = paymentType && amount > 0 && method && date

  return (
    <Card 
      className="w-full bg-blue-50 border border-blue-200"
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong className="block mb-2">Payment Type</Text>
          <Input
            placeholder="e.g., Advance Token, First Installment"
            value={paymentType}
            onChange={(e) => onTypeChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Amount</Text>
          <InputNumber
            placeholder="Enter amount"
            value={amount}
            onChange={onAmountChange}
            size="large"
            className="w-full"
            prefix="$"
            min={0}
            precision={2}
          />
        </div>
        <div>
          <Text strong className="block mb-2">Payment Method</Text>
          <Input
            placeholder="e.g., Stripe, PayPal, Bank Transfer"
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            size="large"
          />
        </div>
        <div>
          <Text strong className="block mb-2">Date</Text>
          <DatePicker
            value={date}
            onChange={onDateChange}
            format="MMMM DD, YYYY"
            size="large"
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            onClick={onCancel}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
          <Button 
            type="primary"
            onClick={onSave}
            icon={<SaveOutlined />}
            disabled={!isValid}
          >
            {saveButtonText}
          </Button>
        </div>
      </Space>
    </Card>
  )
}
