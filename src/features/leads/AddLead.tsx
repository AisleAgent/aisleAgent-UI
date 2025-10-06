import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  DatePicker, 
  Typography,
  Row,
  Col,
  message,
  Alert,
  Space,
  Modal
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  DeleteOutlined 
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { Navbar } from '../../components/Navbar'
import { LEAD_STAGES } from '../../lib/enums'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

/**
 * AddLead Component
 * Form for creating a new lead with all required information
 * 
 * Features:
 * - Comprehensive lead information capture
 * - Form validation
 * - Stage selection
 * - Source tracking
 * - Auto-save draft functionality
 * - Draft restoration
 * - Navigation back to leads list
 */
export function AddLead() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showDraftAlert, setShowDraftAlert] = useState(false)
  
  // Temporarily disabled auto-save to fix infinite loop
  const hasDraft = false
  const clearDraft = () => {}
  const lastSavedText = null
  const markAsDirty = () => {}

  /**
   * Check for existing draft on mount
   */
  useEffect(() => {
    if (hasDraft) {
      setShowDraftAlert(true)
    }
  }, [hasDraft])

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: any) => {
    setLoading(true)
    
    try {
      // Format the data
      const leadData = {
        ...values,
        eventDate: values.eventDate?.format('YYYY-MM-DD'),
        leadCreationDate: new Date().toISOString().split('T')[0],
      }
      
      console.log('New Lead Data:', leadData)
      
      // TODO: Replace with actual API call
      // await createLead(leadData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('Lead created successfully!')
      
      // Clear draft after successful submission
      clearDraft()
      
      // Navigate back to leads list
      navigate('/leads')
    } catch (error) {
      message.error('Failed to create lead. Please try again.')
      console.error('Error creating lead:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle draft restoration
   * Converts date strings back to dayjs objects for DatePicker
   */
  const handleRestoreDraft = () => {
    // Get draft data without setting it to form yet
    const draftData = localStorage.getItem('add-lead-draft')
    
    if (draftData) {
      const parsed = JSON.parse(draftData)
      
      // Convert date strings to dayjs objects if they exist
      const convertedData = {
        ...parsed,
        eventDate: parsed.eventDate ? dayjs(parsed.eventDate) : undefined
      }
      
      // Set form values with converted data
      form.setFieldsValue(convertedData)
    }
    
    setShowDraftAlert(false)
    message.success('Draft restored successfully!')
  }

  /**
   * Handle draft dismissal
   */
  const handleDismissDraft = () => {
    Modal.confirm({
      title: 'Discard Draft?',
      content: 'Are you sure you want to discard the saved draft? This action cannot be undone.',
      okText: 'Discard',
      okType: 'danger',
      cancelText: 'Keep Draft',
      onOk: () => {
        clearDraft()
        setShowDraftAlert(false)
        message.info('Draft discarded')
      }
    })
  }

  /**
   * Handle cancel and navigate back
   */
  const handleCancel = () => {
    navigate('/leads')
  }

  // Source options
  const sourceOptions = [
    'Instagram',
    'Facebook',
    'Google',
    'LinkedIn',
    'Referral',
    'Website',
    'Direct',
    'Other'
  ]

  // Event type options
  const eventTypeOptions = [
    'Wedding',
    'Marriage',
    'Birthday',
    'Corporate',
    'Anniversary',
    'Engagement',
    'Party',
    'Conference',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
            >
              Back to Leads
            </Button>
            
            {/* Auto-save indicator */}
            {lastSavedText && (
              <Space size="small" className="text-gray-500">
                <CheckCircleOutlined className="text-green-500" />
                <Text type="secondary" className="text-sm">
                  Draft saved {lastSavedText}
                </Text>
              </Space>
            )}
          </div>
          
          <Title level={2} className="!mb-2">
            Add New Lead
          </Title>
          <Text type="secondary">
            Fill in the details below to create a new lead in your pipeline
          </Text>
        </div>

        {/* Draft restoration alert */}
        {showDraftAlert && (
          <Alert
            message="Draft Found"
            description="We found a previously saved draft. Would you like to continue where you left off?"
            type="info"
            showIcon
            icon={<ClockCircleOutlined />}
            action={
              <Space>
                <Button 
                  size="small" 
                  type="primary"
                  onClick={handleRestoreDraft}
                >
                  Restore Draft
                </Button>
                <Button 
                  size="small" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDismissDraft}
                >
                  Discard
                </Button>
              </Space>
            }
            closable
            onClose={() => setShowDraftAlert(false)}
            className="mb-6"
          />
        )}

        {/* Lead Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark="optional"
            onValuesChange={markAsDirty}
          >
            {/* Basic Information */}
            <div className="mb-6">
              <Title level={4} className="!mb-4">Basic Information</Title>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Please enter the lead name' },
                      { min: 2, message: 'Name must be at least 2 characters' }
                    ]}
                  >
                    <Input 
                      placeholder="e.g., John Doe" 
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email Address"
                    name="emailAddress"
                    rules={[
                      { required: true, message: 'Please enter email address' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      placeholder="e.g., john.doe@email.com" 
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Contact Number"
                    name="contactNo"
                    rules={[
                      { required: true, message: 'Please enter contact number' },
                      { pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, message: 'Please enter a valid phone number' }
                    ]}
                  >
                    <Input 
                      placeholder="e.g., +1-555-123-4567" 
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Lead Source"
                    name="source"
                    rules={[{ required: true, message: 'Please select lead source' }]}
                  >
                    <Select 
                      placeholder="Select source" 
                      size="large"
                    >
                      {sourceOptions.map(source => (
                        <Option key={source} value={source}>
                          {source}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Event Details */}
            <div className="mb-6">
              <Title level={4} className="!mb-4">Event Details</Title>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Event Type"
                    name="eventType"
                    rules={[{ required: true, message: 'Please select event type' }]}
                  >
                    <Select 
                      placeholder="Select event type" 
                      size="large"
                    >
                      {eventTypeOptions.map(type => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Event Date"
                    name="eventDate"
                    rules={[{ required: true, message: 'Please select event date' }]}
                  >
                    <DatePicker 
                      placeholder="Select date" 
                      size="large"
                      className="w-full"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Venue"
                    name="venue"
                    rules={[{ required: true, message: 'Please enter venue' }]}
                  >
                    <Input 
                      placeholder="e.g., The Plaza Hotel" 
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: 'Please enter city' }]}
                  >
                    <Input 
                      placeholder="e.g., New York" 
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Budget Range"
                    name="budget"
                  >
                    <Input 
                      placeholder="e.g., $10,000 - $15,000" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Sales Information */}
            <div className="mb-6">
              <Title level={4} className="!mb-4">Sales Information</Title>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Sales Person"
                    name="salesPerson"
                    rules={[{ required: true, message: 'Please enter sales person name' }]}
                  >
                    <Input 
                      placeholder="e.g., James Smith" 
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Lead Stage"
                    name="stage"
                    initialValue={LEAD_STAGES.INITIAL_CONTACT}
                    rules={[{ required: true, message: 'Please select lead stage' }]}
                  >
                    <Select 
                      placeholder="Select stage" 
                      size="large"
                    >
                      {Object.values(LEAD_STAGES).map(stage => (
                        <Option key={stage} value={stage}>
                          {stage}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Notes"
                    name="notes"
                  >
                    <TextArea 
                      placeholder="Add any additional notes or requirements..."
                      rows={4}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                size="large" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                size="large"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Create Lead
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddLead
