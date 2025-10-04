import { useState, useEffect } from 'react'
import { Button, Card, Form, Input } from 'antd'
import { Navbar } from '../../components/Navbar'

interface UserProfileData {
  businessType?: string
  businessInfo?: {
    companyName?: string
    description?: string
    website?: string
    phone?: string
    address?: string
    instagram?: string
    youtube?: string
  }
}

interface DetailedFormProps {
  onBack: () => void
  onSave: (data: Partial<UserProfileData>) => void
  initialData?: UserProfileData
}

function DetailedForm({ onBack, onSave, initialData }: DetailedFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [mandatoryFieldsValid, setMandatoryFieldsValid] = useState(false)

  const checkMandatoryFields = (_changedValues?: any, allValues?: any) => {
    const values = allValues || form.getFieldsValue()
    const mandatoryFields = ['companyName', 'instagram', 'phone']
    
    // Check if all mandatory fields are filled
    const mandatoryFieldsFilled = mandatoryFields.every(field => {
      const value = values[field]
      return value && value.toString().trim() !== ''
    })
    
    // Check if there are any validation errors (only for fields that have been touched)
    const fieldErrors = form.getFieldsError()
    const hasValidationErrors = fieldErrors.some(({ errors }) => errors.length > 0)
    
    // Button is enabled only if mandatory fields are filled AND no validation errors
    const isValid = mandatoryFieldsFilled && !hasValidationErrors
    setMandatoryFieldsValid(isValid)
  }

  // Initial check when component mounts
  useEffect(() => {
    setTimeout(() => {
      checkMandatoryFields()
    }, 100)
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      const businessInfo = {
        companyName: values.companyName,
        description: values.description,
        website: values.website,
        phone: values.phone,
        address: values.address,
        instagram: values.instagram,
        youtube: values.youtube
      }

      onSave({ businessInfo })
    } catch (error) {
      console.error('Form validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center py-12 px-4">
        {/* Progress Indicator */}
        <div className="text-center mb-6">
          <div className="text-gray-600 text-sm mb-2">Step 2 of 2</div>
          <div className="w-32 h-1 bg-gray-200 rounded-full">
            <div className="w-32 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Business Information</h2>
          <p className="text-gray-600 mt-2">Please provide your business details</p>
        </div>

        {/* Form */}
        <Card className="w-full max-w-2xl">
        <Form
          form={form}
          layout="vertical"
          validateTrigger="onBlur"
          initialValues={{
            companyName: initialData?.businessInfo?.companyName || '',
            description: initialData?.businessInfo?.description || '',
            website: initialData?.businessInfo?.website || '',
            phone: initialData?.businessInfo?.phone || '',
            address: initialData?.businessInfo?.address || '',
            instagram: initialData?.businessInfo?.instagram || '',
            youtube: initialData?.businessInfo?.youtube || ''
          }}
          onValuesChange={(changedValues, allValues) => {
            checkMandatoryFields(changedValues, allValues)
          }}
        >
          {/* 1. Name - Mandatory */}
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: 'Please enter your company name' }]}
          >
            <Input placeholder="Enter your company name" size="large" />
          </Form.Item>

          {/* 2. Description - Optional */}
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              placeholder="Describe your business"
              rows={4}
              size="large"
            />
          </Form.Item>

          {/* 3. Website - Optional */}
          <Form.Item
            label="Website"
            name="website"
            rules={[
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="https://your-website.com" size="large" />
          </Form.Item>

          {/* 4. Instagram - Mandatory */}
          <Form.Item
            label="Instagram"
            name="instagram"
            rules={[
              { required: true, message: 'Please enter your Instagram link' },
              { type: 'url', message: 'Please enter a valid Instagram URL' }
            ]}
          >
            <Input
              placeholder="https://instagram.com/yourusername"
              size="large"
              addonBefore="@"
            />
          </Form.Item>

          {/* 5. YouTube - Optional */}
          <Form.Item
            label="YouTube"
            name="youtube"
            rules={[
              { type: 'url', message: 'Please enter a valid YouTube URL' }
            ]}
          >
            <Input
              placeholder="https://youtube.com/@yourchannel"
              size="large"
              addonBefore="📺"
            />
          </Form.Item>

          {/* 6. Phone Number - Mandatory */}
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' }
            ]}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input 
                placeholder="+1 (555) 123-4567" 
                size="large" 
                style={{ flex: 1 }}
              />
              <Button 
                type="default" 
                size="large"
                onClick={() => {
                  const phoneValue = form.getFieldValue('phone')
                  if (phoneValue && phoneValue.trim() !== '') {
                    console.log('Sending OTP to:', phoneValue)
                    // TODO: Implement OTP sending logic
                  } else {
                    console.log('Please enter a phone number first')
                  }
                }}
                style={{ flexShrink: 0 }}
              >
                Send OTP
              </Button>
            </div>
          </Form.Item>

          {/* 7. Address - Optional */}
          <Form.Item
            label="Address"
            name="address"
          >
            <Input.TextArea
              placeholder="Enter your business address"
              rows={3}
              size="large"
            />
          </Form.Item>

          <div className="flex justify-between mt-8">
            <Button
              size="large"
              onClick={onBack}
              className="px-8"
            >
              Back
            </Button>
            
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
              loading={loading}
              disabled={!mandatoryFieldsValid}
              className="px-8"
            >
              Save
            </Button>
          </div>
        </Form>
        </Card>
      </div>
    </div>
  )
}

export { DetailedForm }
