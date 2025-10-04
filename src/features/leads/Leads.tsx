import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { Navbar } from '../../components/Navbar'
import { Card, Table, Tag, Select, Input, Button, Dropdown, Checkbox, Calendar, Popover } from 'antd'
import { SearchOutlined, ClearOutlined, FilterOutlined, DownOutlined, CalendarOutlined } from '@ant-design/icons'

const { Option } = Select

// Sample data based on the image reference
const leadsData = [
  {
    key: '1',
    name: 'Sophia Carter',
    eventType: 'Marriage',
    city: 'New York',
    venue: 'The Plaza',
    salesPerson: 'James Smith',
    leadCreationDate: '2023-07-15',
    source: 'Instagram',
    stage: 'First Call Scheduled',
    contactNo: '+1-555-123-4567',
    emailAddress: 'sophia.carter@email.cc'
  },
  {
    key: '2',
    name: 'Ethan Bennett',
    eventType: 'Birthday',
    city: 'Los Angeles',
    venue: 'The Beverly Hills Hotel',
    salesPerson: 'Maria Garcia',
    leadCreationDate: '2023-07-14',
    source: 'Google',
    stage: 'Awaiting Quote',
    contactNo: '+1-555-987-6543',
    emailAddress: 'ethan.bennett@email.c'
  },
  {
    key: '3',
    name: 'Olivia Hayes',
    eventType: 'Marriage',
    city: 'Miami',
    venue: 'The Biltmore',
    salesPerson: 'Robert Johnson',
    leadCreationDate: '2023-07-13',
    source: 'Referral',
    stage: 'Quote Sent',
    contactNo: '+1-555-246-8013',
    emailAddress: 'olivia.hayes@email.com'
  },
  {
    key: '4',
    name: 'Michael Chen',
    eventType: 'Corporate',
    city: 'San Francisco',
    venue: 'The Fairmont',
    salesPerson: 'Sarah Wilson',
    leadCreationDate: '2023-07-12',
    source: 'LinkedIn',
    stage: 'First Call Scheduled',
    contactNo: '+1-555-456-7890',
    emailAddress: 'michael.chen@email.com'
  },
  {
    key: '5',
    name: 'Emma Rodriguez',
    eventType: 'Wedding',
    city: 'Chicago',
    venue: 'The Drake',
    salesPerson: 'David Brown',
    leadCreationDate: '2023-07-11',
    source: 'Facebook',
    stage: 'Awaiting Quote',
    contactNo: '+1-555-789-0123',
    emailAddress: 'emma.rodriguez@email.com'
  }
]

// Stage tag colors
const getStageColor = (stage: string) => {
  switch (stage) {
    case 'First Call Scheduled':
      return 'blue'
    case 'Awaiting Quote':
      return 'orange'
    case 'Quote Sent':
      return 'purple'
    case 'Negotiation':
      return 'cyan'
    case 'Closed Won':
      return 'green'
    case 'Closed Lost':
      return 'red'
    default:
      return 'default'
  }
}

export function Leads() {
  const [filters, setFilters] = useState({
    salesPerson: '',
    stage: '',
    city: '',
    search: ''
  })

  const [otherFilters, setOtherFilters] = useState({
    eventType: '',
    venue: '',
    source: '',
    leadCreationDate: ''
  })

  const [visibleOtherFilters, setVisibleOtherFilters] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState(dayjs())

  // Get unique values for filter options
  const salesPersons = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.salesPerson))]
  }, [])

  const stages = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.stage))]
  }, [])

  const cities = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.city))]
  }, [])

  // Get unique values for other filter options
  const eventTypes = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.eventType))]
  }, [])

  const venues = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.venue))]
  }, [])

  const sources = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.source))]
  }, [])

  const leadCreationDates = useMemo(() => {
    return [...new Set(leadsData.map(lead => lead.leadCreationDate))]
  }, [])

  // Filter the data based on current filters
  const filteredData = useMemo(() => {
    return leadsData.filter(lead => {
      const matchesSalesPerson = !filters.salesPerson || lead.salesPerson === filters.salesPerson
      const matchesStage = !filters.stage || lead.stage === filters.stage
      const matchesCity = !filters.city || lead.city === filters.city
      const matchesSearch = !filters.search || 
        lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.emailAddress.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.contactNo.includes(filters.search)

      // Other filters (only apply if they are visible and have values)
      const matchesEventType = !visibleOtherFilters.includes('eventType') || !otherFilters.eventType || lead.eventType === otherFilters.eventType
      const matchesVenue = !visibleOtherFilters.includes('venue') || !otherFilters.venue || lead.venue === otherFilters.venue
      const matchesSource = !visibleOtherFilters.includes('source') || !otherFilters.source || lead.source === otherFilters.source
      const matchesLeadCreationDate = !visibleOtherFilters.includes('leadCreationDate') || !otherFilters.leadCreationDate || lead.leadCreationDate === otherFilters.leadCreationDate

      return matchesSalesPerson && matchesStage && matchesCity && matchesSearch && 
             matchesEventType && matchesVenue && matchesSource && matchesLeadCreationDate
    })
  }, [filters, otherFilters, visibleOtherFilters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleOtherFilterChange = (key: string, value: string) => {
    setOtherFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleOtherFilterToggle = (filterKey: string) => {
    setVisibleOtherFilters(prev => {
      if (prev.includes(filterKey)) {
        // Remove from visible filters and clear its value
        setOtherFilters(prevFilters => ({ ...prevFilters, [filterKey]: '' }))
        return prev.filter(key => key !== filterKey)
      } else {
        return [...prev, filterKey]
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      salesPerson: '',
      stage: '',
      city: '',
      search: ''
    })
    setOtherFilters({
      eventType: '',
      venue: '',
      source: '',
      leadCreationDate: ''
    })
    setVisibleOtherFilters([])
  }

  // Other filters dropdown menu
  const otherFiltersMenu = {
    items: [
      {
        key: 'eventType',
        label: (
          <Checkbox
            checked={visibleOtherFilters.includes('eventType')}
            onChange={() => handleOtherFilterToggle('eventType')}
          >
            Event Type
          </Checkbox>
        ),
      },
      {
        key: 'venue',
        label: (
          <Checkbox
            checked={visibleOtherFilters.includes('venue')}
            onChange={() => handleOtherFilterToggle('venue')}
          >
            Venue
          </Checkbox>
        ),
      },
      {
        key: 'source',
        label: (
          <Checkbox
            checked={visibleOtherFilters.includes('source')}
            onChange={() => handleOtherFilterToggle('source')}
          >
            Source
          </Checkbox>
        ),
      },
      {
        key: 'leadCreationDate',
        label: (
          <Checkbox
            checked={visibleOtherFilters.includes('leadCreationDate')}
            onChange={() => handleOtherFilterToggle('leadCreationDate')}
          >
            Lead Creation Date
          </Checkbox>
        ),
      },
    ],
  }

  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left' as const,
    },
    {
      title: 'EVENT TYPE',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 120,
    },
    {
      title: 'CITY',
      dataIndex: 'city',
      key: 'city',
      width: 120,
    },
    {
      title: 'VENUE',
      dataIndex: 'venue',
      key: 'venue',
      width: 180,
    },
    {
      title: 'SALES PERSON',
      dataIndex: 'salesPerson',
      key: 'salesPerson',
      width: 150,
    },
    {
      title: 'LEAD CREATION DATE',
      dataIndex: 'leadCreationDate',
      key: 'leadCreationDate',
      width: 160,
    },
    {
      title: 'SOURCE',
      dataIndex: 'source',
      key: 'source',
      width: 120,
    },
    {
      title: 'STAGE',
      dataIndex: 'stage',
      key: 'stage',
      width: 150,
      render: (stage: string) => (
        <Tag color={getStageColor(stage)}>
          {stage}
        </Tag>
      ),
    },
    {
      title: 'CONTACT NO',
      dataIndex: 'contactNo',
      key: 'contactNo',
      width: 150,
    },
    {
      title: 'EMAIL ADDRESS',
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      width: 200,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Here's a summary of your leads and their progress.
          </p>
        </div>

        {/* Lead Metrics */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Lead Metrics</h2>
            <Popover
              content={
                <div style={{ width: 320 }}>
                  <Card size="small" style={{ padding: 0 }}>
                    <Calendar
                      fullscreen={false}
                      value={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date)
                        console.log('Selected date:', date.format('YYYY-MM-DD'))
                      }}
                      headerRender={({ value, type, onChange, onTypeChange }) => (
                        <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Select
                                size="small"
                                value={value.format('YYYY')}
                                onChange={(year) => onChange(value.year(Number(year)))}
                                style={{ width: 60 }}
                              >
                                {Array.from({ length: 10 }, (_, i) => {
                                  const year = new Date().getFullYear() - 5 + i;
                                  return (
                                    <Option key={year} value={year.toString()}>
                                      {year}
                                    </Option>
                                  );
                                })}
                              </Select>
                              <Select
                                size="small"
                                value={value.format('MMM')}
                                onChange={(month) => {
                                  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
                                  onChange(value.month(monthIndex));
                                }}
                                style={{ width: 60 }}
                              >
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                  <Option key={month} value={month}>
                                    {month}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <Button
                                type={type === 'month' ? 'primary' : 'default'}
                                size="small"
                                onClick={() => onTypeChange(type === 'month' ? 'date' as any : 'month' as any)}
                              >
                                Month
                              </Button>
                              <Button
                                type={type === 'year' ? 'primary': 'default'}
                                size="small"
                                onClick={() => onTypeChange(type === 'year' ? 'date' as any : 'year' as any)}
                              >
                                Year
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </Card>
                </div>
              }
              title="Select Date"
              trigger="click"
              placement="bottomRight"
            >
              <Button icon={<CalendarOutlined />}>
                {selectedDate.format('MMM YYYY')}
              </Button>
            </Popover>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Inbound Leads</h3>
              <p className="text-2xl font-bold text-gray-900">731</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Qualified</h3>
              <p className="text-2xl font-bold text-gray-900">432</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Quote Sent</h3>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Hot Prospect</h3>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Booked</h3>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </Card>
          </div>
        </div>

        {/* Lead Tracker Table */}
        <Card title="Lead Tracker" className="shadow-sm">
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <Input
                  placeholder="Search by name, email, or phone..."
                  prefix={<SearchOutlined />}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  allowClear
                />
              </div>

              {/* Sales Person Filter */}
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Person
                </label>
                <Select
                  placeholder="All Sales Persons"
                  value={filters.salesPerson || undefined}
                  onChange={(value) => handleFilterChange('salesPerson', value || '')}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {salesPersons.map(person => (
                    <Option key={person} value={person}>{person}</Option>
                  ))}
                </Select>
              </div>

              {/* Stage Filter */}
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <Select
                  placeholder="All Stages"
                  value={filters.stage || undefined}
                  onChange={(value) => handleFilterChange('stage', value || '')}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {stages.map(stage => (
                    <Option key={stage} value={stage}>{stage}</Option>
                  ))}
                </Select>
              </div>

              {/* City Filter */}
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Select
                  placeholder="All Cities"
                  value={filters.city || undefined}
                  onChange={(value) => handleFilterChange('city', value || '')}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {cities.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </div>

              {/* Other Filters Button */}
              <div>
                <Dropdown menu={otherFiltersMenu} trigger={['click']}>
                  <Button icon={<FilterOutlined />}>
                    Other Filters <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              {/* Clear Filters Button */}
              <div>
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearFilters}
                  disabled={!filters.salesPerson && !filters.stage && !filters.city && !filters.search && visibleOtherFilters.length === 0}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Dynamic Other Filters */}
            {visibleOtherFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 items-end">
                  {visibleOtherFilters.includes('eventType') && (
                    <div className="min-w-[150px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type
                      </label>
                      <Select
                        placeholder="All Event Types"
                        value={otherFilters.eventType || undefined}
                        onChange={(value) => handleOtherFilterChange('eventType', value || '')}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {eventTypes.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </div>
                  )}

                  {visibleOtherFilters.includes('venue') && (
                    <div className="min-w-[150px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue
                      </label>
                      <Select
                        placeholder="All Venues"
                        value={otherFilters.venue || undefined}
                        onChange={(value) => handleOtherFilterChange('venue', value || '')}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {venues.map(venue => (
                          <Option key={venue} value={venue}>{venue}</Option>
                        ))}
                      </Select>
                    </div>
                  )}

                  {visibleOtherFilters.includes('source') && (
                    <div className="min-w-[150px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Source
                      </label>
                      <Select
                        placeholder="All Sources"
                        value={otherFilters.source || undefined}
                        onChange={(value) => handleOtherFilterChange('source', value || '')}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {sources.map(source => (
                          <Option key={source} value={source}>{source}</Option>
                        ))}
                      </Select>
                    </div>
                  )}

                  {visibleOtherFilters.includes('leadCreationDate') && (
                    <div className="min-w-[150px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Creation Date
                      </label>
                      <Select
                        placeholder="All Dates"
                        value={otherFilters.leadCreationDate || undefined}
                        onChange={(value) => handleOtherFilterChange('leadCreationDate', value || '')}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {leadCreationDates.map(date => (
                          <Option key={date} value={date}>{date}</Option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            {(filters.salesPerson || filters.stage || filters.city || filters.search || 
              otherFilters.eventType || otherFilters.venue || otherFilters.source || otherFilters.leadCreationDate) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.search && (
                  <Tag closable onClose={() => handleFilterChange('search', '')}>
                    Search: "{filters.search}"
                  </Tag>
                )}
                {filters.salesPerson && (
                  <Tag closable onClose={() => handleFilterChange('salesPerson', '')}>
                    Sales Person: {filters.salesPerson}
                  </Tag>
                )}
                {filters.stage && (
                  <Tag closable onClose={() => handleFilterChange('stage', '')}>
                    Stage: {filters.stage}
                  </Tag>
                )}
                {filters.city && (
                  <Tag closable onClose={() => handleFilterChange('city', '')}>
                    City: {filters.city}
                  </Tag>
                )}
                {otherFilters.eventType && (
                  <Tag closable onClose={() => handleOtherFilterChange('eventType', '')}>
                    Event Type: {otherFilters.eventType}
                  </Tag>
                )}
                {otherFilters.venue && (
                  <Tag closable onClose={() => handleOtherFilterChange('venue', '')}>
                    Venue: {otherFilters.venue}
                  </Tag>
                )}
                {otherFilters.source && (
                  <Tag closable onClose={() => handleOtherFilterChange('source', '')}>
                    Source: {otherFilters.source}
                  </Tag>
                )}
                {otherFilters.leadCreationDate && (
                  <Tag closable onClose={() => handleOtherFilterChange('leadCreationDate', '')}>
                    Date: {otherFilters.leadCreationDate}
                  </Tag>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={false}
              scroll={{ x: 1500 }}
              size="middle"
              className="min-w-full"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Leads
