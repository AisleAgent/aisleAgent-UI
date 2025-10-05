import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Card, Spin, Space, Divider, Typography, Row, Col } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { Navbar } from '../../components/Navbar'
import { LEAD_STAGES } from '../../lib/enums'
import { EventList } from './components/EventList'
import { TeamList } from './components/TeamList'
import { EquipmentList } from './components/EquipmentList'
import { MiscellaneousList } from './components/MiscellaneousList'
import { PaymentList } from './components/PaymentList'
import type { LeadDetails as LeadDetailsType, Event, TeamMember, Equipment, MiscellaneousExpense, Payment } from './types'

const { Title, Text } = Typography

// Mock lead data - in real app this would come from API
const mockLeadData = {
  '1': {
    id: '1',
    name: 'Sophia Carter',
    email: 'sophia.carter@email.cc',
    phone: '+1-555-123-4567',
    eventType: 'Wedding',
    eventDate: '2024-06-29',
    venue: 'The Plaza',
    city: 'New York',
    budget: '$15,000 - $25,000',
    status: 'Booked',
    source: 'Instagram',
    createdAt: '2023-07-15',
    notes: 'Very interested in photography package. Prefers outdoor ceremony.',
    salesPerson: 'James Smith',
    stage: LEAD_STAGES.BOOKED,
    // Project details
    events: [
      { name: 'Haldi Ceremony', date: 'June 28, 2024', time: '10:00 AM' },
      { name: 'Ring Ceremony', date: 'June 29, 2024', time: '07:00 PM' },
      { name: 'DJ Night', date: 'June 29, 2024', time: '09:00 PM' },
      { name: 'Mehendi Ceremony', date: 'June 27, 2024', time: '02:00 PM' },
      { name: 'Reception', date: 'June 30, 2024', time: '06:00 PM' },
      { name: 'Cocktail Party', date: 'June 30, 2024', time: '08:00 PM' }
    ],
    teamMembers: [
      { name: 'James Smith', avatar: 'JS', contactNumber: '+1-555-0101', email: 'james@example.com', type: 'employee' as const },
      { name: 'Maria Garcia', avatar: 'MG', contactNumber: '+1-555-0102', email: 'maria@example.com', type: 'freelancer' as const, charges: 500 },
      { name: 'David Johnson', avatar: 'DJ', contactNumber: '+1-555-0103', email: 'david@example.com', type: 'employee' as const },
      { name: 'Sarah Wilson', avatar: 'SW', contactNumber: '+1-555-0104', email: 'sarah@example.com', type: 'freelancer' as const, charges: 750 },
      { name: 'Michael Brown', avatar: 'MB', contactNumber: '+1-555-0105', email: 'michael@example.com', type: 'employee' as const },
      { name: 'Emma Davis', avatar: 'ED', contactNumber: '+1-555-0106', email: 'emma@example.com', type: 'employee' as const },
      { name: 'Alex Chen', avatar: 'AC', contactNumber: '+1-555-0107', email: 'alex@example.com', type: 'freelancer' as const, charges: 600 }
    ],
    equipment: [
      { name: '2x Canon EOS R5', cost: 500.00 },
      { name: 'DJI Ronin-S Gimbal', cost: 150.00 },
      { name: 'Lighting Kit (3-point)', cost: 200.00 },
      { name: 'MacBook Pro M2', cost: 2500.00 },
      { name: 'External Hard Drives', cost: 300.00 },
      { name: 'Memory Cards (SD)', cost: 200.00 },
      { name: 'Tripods (3x)', cost: 450.00 },
      { name: 'Audio Equipment', cost: 800.00 }
    ],
    miscellaneous: [
      { category: 'Travel', description: 'Fuel for team transport', cost: 120.00 },
      { category: 'Accommodation', description: 'Hotel for 2 nights', cost: 350.00 },
      { category: 'Food', description: 'Team meals', cost: 250.00 },
      { category: 'Permits', description: 'Venue photography permit', cost: 75.00 },
      { category: 'Props', description: 'Smoke bombs, confetti', cost: 50.00 }
    ],
    payments: [
      { type: 'Advance Token', date: 'June 15, 2024', amount: 2500.00, method: 'Stripe' },
      { type: 'Installment 1', date: 'July 01, 2024', amount: 1250.00, method: 'PayPal' },
      { type: 'Final Payment', date: 'July 10, 2024', amount: 1250.00, method: 'Stripe' }
    ],
    packageValue: 5000.00,
    totalPaid: 5000.00,
    pendingPayment: 0.00
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
    // Project details
    events: [],
    teamMembers: [],
    equipment: [],
    miscellaneous: [],
    payments: [],
    packageValue: 0,
    totalPaid: 0,
    pendingPayment: 0
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
    // Project details
    events: [],
    teamMembers: [],
    equipment: [],
    miscellaneous: [],
    payments: [],
    packageValue: 0,
    totalPaid: 0,
    pendingPayment: 0
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
    // Project details
    events: [],
    teamMembers: [],
    equipment: [],
    miscellaneous: [],
    payments: [],
    packageValue: 0,
    totalPaid: 0,
    pendingPayment: 0
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
    // Project details
    events: [],
    teamMembers: [],
    equipment: [],
    miscellaneous: [],
    payments: [],
    packageValue: 0,
    totalPaid: 0,
    pendingPayment: 0
  }
}


export function LeadDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<LeadDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [miscellaneous, setMiscellaneous] = useState<MiscellaneousExpense[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const foundLead = id ? mockLeadData[id as keyof typeof mockLeadData] : null
      setLead(foundLead as LeadDetailsType)
      if (foundLead?.events) {
        setEvents(foundLead.events)
      }
      if (foundLead?.teamMembers) {
        setTeamMembers(foundLead.teamMembers)
      }
      if (foundLead?.equipment) {
        setEquipment(foundLead.equipment)
      }
      if (foundLead?.miscellaneous) {
        setMiscellaneous(foundLead.miscellaneous)
      }
      if (foundLead?.payments) {
        setPayments(foundLead.payments)
      }
      setLoading(false)
    }, 500)
  }, [id])

  // Memoized event handler
  const handleEventsChange = useCallback((updatedEvents: Event[]) => {
    setEvents(updatedEvents)
  }, [])

  // Memoized team members handler
  const handleTeamMembersChange = useCallback((updatedMembers: TeamMember[]) => {
    setTeamMembers(updatedMembers)
  }, [])

  // Memoized equipment handler
  const handleEquipmentChange = useCallback((updatedEquipment: Equipment[]) => {
    setEquipment(updatedEquipment)
  }, [])

  // Memoized miscellaneous handler
  const handleMiscellaneousChange = useCallback((updatedMiscellaneous: MiscellaneousExpense[]) => {
    setMiscellaneous(updatedMiscellaneous)
  }, [])

  // Memoized payments handler
  const handlePaymentsChange = useCallback((updatedPayments: Payment[]) => {
    setPayments(updatedPayments)
  }, [])

  // Memoized calculations - MUST be before any conditional returns
  const equipmentTotal = useMemo(() => 
    equipment.reduce((sum, item) => sum + item.cost, 0),
    [equipment]
  )

  const miscellaneousTotal = useMemo(() => 
    miscellaneous.reduce((sum, item) => sum + item.cost, 0),
    [miscellaneous]
  )

  const totalExpenses = useMemo(() => 
    equipmentTotal + miscellaneousTotal,
    [equipmentTotal, miscellaneousTotal]
  )

  const netProfit = useMemo(() => 
    (lead?.packageValue || 0) - totalExpenses,
    [lead?.packageValue, totalExpenses]
  )

  // Conditional returns AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Spin size="large" tip="Loading lead details..." />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="flex flex-col items-center py-12 px-4">
          <Card className="w-full max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h2>
            <p className="text-gray-600 mb-8">The lead with ID "{id}" could not be found.</p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/leads')}
              icon={<ArrowLeftOutlined />}
            >
              Back to Leads
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Button
                  type="text"
                  onClick={() => navigate('/leads')}
                  icon={<ArrowLeftOutlined />}
                  className="mr-2"
                />
                <Title level={2} className="mb-0">{lead.name}'s {lead.eventType}</Title>
              </div>
              <Text type="secondary">Project Expense Details</Text>
            </div>
            <Button type="primary" icon={<EditOutlined />} className="bg-purple-600 border-purple-600 hover:bg-purple-700">
              Edit
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {/* Left Column - Project Details (Scrollable) */}
            <Col xs={24} xl={16}>
              <div 
                style={{ 
                  maxHeight: 'calc(100vh - 180px)',
                  overflowY: 'auto',
                  paddingRight: '12px'
                }}
              >
                <Space direction="vertical" size="large" className="w-full" style={{ paddingBottom: '20px' }}>
                  {/* Event Details */}
                  <EventList events={events} onEventsChange={handleEventsChange} />

                  {/* Team Allocation */}
                  <TeamList teamMembers={teamMembers} onTeamMembersChange={handleTeamMembersChange} />

                  {/* Equipment Allocation */}
                  <EquipmentList equipment={equipment} onEquipmentChange={handleEquipmentChange} />

                  {/* Other & Miscellaneous */}
                  <MiscellaneousList miscellaneous={miscellaneous} onMiscellaneousChange={handleMiscellaneousChange} />

                  {/* Payment Collection */}
                  <PaymentList payments={payments} onPaymentsChange={handlePaymentsChange} />
                </Space>
              </div>
            </Col>

            {/* Right Column - Financial Summary (Sticky) */}
            <Col xs={24} xl={8}>
              <div style={{ position: 'sticky', top: '24px' }}>
                <Card title="Financial Summary">
                  <Space direction="vertical" size="large" className="w-full">
                  <div className="flex justify-between">
                    <Text>Package Value</Text>
                    <Text strong>${lead.packageValue?.toFixed(2)}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Total Paid</Text>
                    <Text strong>${lead.totalPaid?.toFixed(2)}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Pending Payment</Text>
                    <Text strong>${lead.pendingPayment?.toFixed(2)}</Text>
                  </div>
                  <Divider />
                  <div className="flex justify-between">
                    <Text>Total Expenses</Text>
                    <Text strong className="text-red-500">(${totalExpenses.toFixed(2)})</Text>
                  </div>
                  <div className="ml-4 bg-gray-100 p-3 rounded">
                    <div className="flex justify-between mb-2">
                      <Text type="secondary">Equipment:</Text>
                      <Text type="secondary">${equipmentTotal.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">Miscellaneous:</Text>
                      <Text type="secondary">${miscellaneousTotal.toFixed(2)}</Text>
                    </div>
                  </div>
                  <Divider />
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <Text strong className="text-lg text-green-800">Net Project Profit</Text>
                      <Text strong className="text-2xl text-green-600">${netProfit.toFixed(2)}</Text>
                    </div>
                  </div>
                  </Space>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default LeadDetails
