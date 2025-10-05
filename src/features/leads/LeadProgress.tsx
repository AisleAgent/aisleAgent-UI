import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Steps, Tag, Spin, Timeline } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Navbar } from '../../components/Navbar'
import { LEAD_STAGES, type LeadStage } from '../../lib/enums'

// Mock lead data - same as LeadDetails but with progress information
const mockLeadData = {
  '1': {
    id: '1',
    name: 'Sophia Carter',
    email: 'sophia.carter@email.cc',
    phone: '+1-555-123-4567',
    eventType: 'Marriage',
    eventDate: '2024-06-15',
    venue: 'The Plaza',
    city: 'New York',
    budget: '$15,000 - $25,000',
    status: 'First Call Scheduled',
    source: 'Instagram',
    createdAt: '2023-07-15',
    notes: 'Very interested in photography package. Prefers outdoor ceremony.',
    salesPerson: 'James Smith',
    stage: LEAD_STAGES.FIRST_CALL_SCHEDULED,
    progress: [
      { stage: LEAD_STAGES.INITIAL_CONTACT, completed: true, date: '2023-07-15', notes: 'Initial contact made via Instagram' },
      { stage: LEAD_STAGES.FIRST_CALL_SCHEDULED, completed: false, date: '2023-07-20', notes: 'Call scheduled for next week' }
    ]
  },
  '2': {
    id: '2',
    name: 'Ethan Bennett',
    email: 'ethan.bennett@email.cc',
    phone: '+1-555-987-6543',
    eventType: 'Birthday',
    eventDate: '2024-08-22',
    venue: 'The Beverly Hills Hotel',
    city: 'Los Angeles',
    budget: '$10,000 - $15,000',
    status: 'Qualified',
    source: 'Website',
    createdAt: '2023-07-20',
    notes: 'Looking for videography services. Budget conscious.',
    salesPerson: 'Maria Garcia',
    stage: LEAD_STAGES.QUALIFIED,
    progress: [
      { stage: LEAD_STAGES.INITIAL_CONTACT, completed: true, date: '2023-07-20', notes: 'Initial contact via website form' },
      { stage: LEAD_STAGES.FIRST_CALL_SCHEDULED, completed: true, date: '2023-07-22', notes: 'First call completed successfully' },
      { stage: LEAD_STAGES.QUALIFIED, completed: false, date: '2023-07-25', notes: 'Qualified as potential client' }
    ]
  },
  '3': {
    id: '3',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@email.cc',
    phone: '+1-555-456-7890',
    eventType: 'Wedding',
    eventDate: '2024-09-10',
    venue: 'Garden Venue',
    city: 'Chicago',
    budget: '$20,000 - $30,000',
    status: 'Hot Prospect',
    source: 'Referral',
    createdAt: '2023-07-25',
    notes: 'High-end wedding package. Very interested in premium services.',
    salesPerson: 'David Johnson',
    stage: LEAD_STAGES.HOT_PROSPECT,
    progress: [
      { stage: LEAD_STAGES.INITIAL_CONTACT, completed: true, date: '2023-07-25', notes: 'Referred by previous client' },
      { stage: LEAD_STAGES.FIRST_CALL_SCHEDULED, completed: true, date: '2023-07-26', notes: 'Initial consultation call' },
      { stage: LEAD_STAGES.QUALIFIED, completed: true, date: '2023-07-28', notes: 'Qualified as high-value prospect' },
      { stage: LEAD_STAGES.HOT_PROSPECT, completed: false, date: '2023-07-30', notes: 'Marked as hot prospect - high conversion probability' }
    ]
  },
  '4': {
    id: '4',
    name: 'Michael Thompson',
    email: 'michael.thompson@email.cc',
    phone: '+1-555-321-0987',
    eventType: 'Corporate Event',
    eventDate: '2024-10-05',
    venue: 'Convention Center',
    city: 'Miami',
    budget: '$5,000 - $10,000',
    status: 'Quote Sent',
    source: 'LinkedIn',
    createdAt: '2023-07-30',
    notes: 'Corporate event photography. Need quick turnaround.',
    salesPerson: 'Sarah Wilson',
    stage: LEAD_STAGES.QUOTE_SENT,
    progress: [
      { stage: LEAD_STAGES.INITIAL_CONTACT, completed: true, date: '2023-07-30', notes: 'Contact via LinkedIn' },
      { stage: LEAD_STAGES.FIRST_CALL_SCHEDULED, completed: true, date: '2023-08-01', notes: 'Discovery call completed' },
      { stage: LEAD_STAGES.QUALIFIED, completed: true, date: '2023-08-02', notes: 'Qualified for corporate package' },
      { stage: LEAD_STAGES.HOT_PROSPECT, completed: true, date: '2023-08-03', notes: 'Identified as hot prospect' },
      { stage: LEAD_STAGES.QUOTE_SENT, completed: false, date: '2023-08-05', notes: 'Quote sent - awaiting response' }
    ]
  },
  '5': {
    id: '5',
    name: 'Emma Davis',
    email: 'emma.davis@email.cc',
    phone: '+1-555-654-3210',
    eventType: 'Anniversary',
    eventDate: '2024-11-12',
    venue: 'Private Estate',
    city: 'San Francisco',
    budget: '$8,000 - $12,000',
    status: 'Booked',
    source: 'Google',
    createdAt: '2023-08-01',
    notes: 'Anniversary celebration. Booked for full day coverage.',
    salesPerson: 'Robert Brown',
    stage: LEAD_STAGES.BOOKED,
    progress: [
      { stage: LEAD_STAGES.INITIAL_CONTACT, completed: true, date: '2023-08-01', notes: 'Found us via Google search' },
      { stage: LEAD_STAGES.FIRST_CALL_SCHEDULED, completed: true, date: '2023-08-02', notes: 'Initial consultation call' },
      { stage: LEAD_STAGES.QUALIFIED, completed: true, date: '2023-08-03', notes: 'Qualified for anniversary package' },
      { stage: LEAD_STAGES.HOT_PROSPECT, completed: true, date: '2023-08-04', notes: 'Marked as hot prospect' },
      { stage: LEAD_STAGES.QUOTE_SENT, completed: true, date: '2023-08-05', notes: 'Quote sent and accepted' },
      { stage: LEAD_STAGES.BOOKED, completed: true, date: '2023-08-06', notes: 'Successfully booked!' }
    ]
  }
}

const getStageColor = (stage: LeadStage) => {
  switch (stage) {
    case LEAD_STAGES.HOT_PROSPECT:
      return 'red'
    case LEAD_STAGES.QUALIFIED:
      return 'green'
    case LEAD_STAGES.QUOTE_SENT:
      return 'blue'
    case LEAD_STAGES.BOOKED:
      return 'purple'
    case LEAD_STAGES.FIRST_CALL_SCHEDULED:
      return 'orange'
    case LEAD_STAGES.INITIAL_CONTACT:
      return 'default'
    default:
      return 'default'
  }
}

const getStepStatus = (completed: boolean, isCurrent: boolean): 'wait' | 'process' | 'finish' => {
  if (completed) return 'finish'
  if (isCurrent) return 'process'
  return 'wait'
}

export function LeadProgress() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // In real app, this would be an API call
  const leadData = id ? mockLeadData[id as keyof typeof mockLeadData] : null
  
  if (!leadData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Spin size="large" tip="Loading lead progress..." />
        </div>
      </div>
    )
  }

  // Create steps for the progress
  const steps = leadData.progress.map((progressItem, index) => ({
    title: progressItem.stage,
    description: progressItem.notes,
    status: getStepStatus(progressItem.completed, index === leadData.progress.length - 1),
    icon: progressItem.completed ? <CheckCircleOutlined /> : 
          index === leadData.progress.length - 1 ? <ClockCircleOutlined /> : 
          <ExclamationCircleOutlined />
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/leads')}
                className="flex items-center"
              >
                Back to Leads
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Lead Progress</h1>
            </div>
            <Tag color={getStageColor(leadData.stage)} className="text-sm px-3 py-1">
              {leadData.stage}
            </Tag>
          </div>

          {/* Lead Information Card */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{leadData.name}</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Event: {leadData.eventType}</p>
                <p className="text-sm text-gray-600">Date: {new Date(leadData.eventDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-600">{leadData.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-600">{leadData.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Venue:</span>
                <p className="text-gray-600">{leadData.venue}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sales Person:</span>
                <p className="text-gray-600">{leadData.salesPerson}</p>
              </div>
            </div>
          </Card>

          {/* Progress Steps */}
          <Card title="Lead Journey Progress">
            <Steps
              direction="vertical"
              size="small"
              current={leadData.progress.length - 1}
              items={steps}
              className="mt-4"
            />
          </Card>

          {/* Timeline View (Alternative) */}
          <Card title="Timeline View" className="mt-6">
            <Timeline
              items={leadData.progress.map((progressItem, index) => ({
                color: progressItem.completed ? 'green' : index === leadData.progress.length - 1 ? 'blue' : 'gray',
                children: (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{progressItem.stage}</h4>
                      <span className="text-sm text-gray-500">{progressItem.date}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{progressItem.notes}</p>
                  </div>
                )
              }))}
            />
          </Card>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button size="large">
              Update Progress
            </Button>
            <Button type="primary" size="large">
              Next Action
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadProgress
