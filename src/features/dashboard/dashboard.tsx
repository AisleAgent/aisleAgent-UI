import { memo, useState, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import { Card, Select, Typography, Row, Col, Progress, Space } from 'antd'
import { 
  RiseOutlined, 
  FallOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { Navbar } from '../../components/Navbar'
import type { FinancialYear, DashboardSummary } from './types'
import { 
  generateFinancialYears, 
  getFinancialYearMonths,
  calculateNetProfit,
  isProfitable,
  formatDashboardCurrency,
  getPercentage
} from './utils'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

const Dashboard: FC = memo(() => {
  const financialYears = useMemo(() => generateFinancialYears(5), [])
  const months = useMemo(() => getFinancialYearMonths(), [])
  
  const [selectedFY, setSelectedFY] = useState<FinancialYear>(financialYears[0])
  const [startMonth, setStartMonth] = useState<number>(1)
  const [endMonth, setEndMonth] = useState<number>(12)
  
  const dashboardData = useMemo<DashboardSummary>(() => {
    const monthsInRange = endMonth - startMonth + 1
    const monthlyFactor = monthsInRange / 12
    
    const annualRevenue = {
      paymentCollected: 150000,
      pendingPayment: 18000,
      totalRevenue: 168000
    }
    
    const annualFixedCost = {
      salary: 30000,
      softwareCost: 6600,
      rentAndUtilities: 9600,
      marketing: 8052,
      totalFixedCost: 54252
    }
    
    const annualVariableCost = {
      equipmentCost: 13440,
      freelancerCharges: 9000,
      travelAndFood: 3829,
      accessoriesCost: 2400,
      otherCost: 0,
      totalVariableCost: 28669
    }
    
    const revenue = {
      paymentCollected: annualRevenue.paymentCollected * monthlyFactor,
      pendingPayment: annualRevenue.pendingPayment * monthlyFactor,
      totalRevenue: annualRevenue.totalRevenue * monthlyFactor
    }
    
    const fixedCost = {
      salary: annualFixedCost.salary * monthlyFactor,
      softwareCost: annualFixedCost.softwareCost * monthlyFactor,
      rentAndUtilities: annualFixedCost.rentAndUtilities * monthlyFactor,
      marketing: annualFixedCost.marketing * monthlyFactor,
      totalFixedCost: annualFixedCost.totalFixedCost * monthlyFactor
    }
    
    const variableCost = {
      equipmentCost: annualVariableCost.equipmentCost * monthlyFactor,
      freelancerCharges: annualVariableCost.freelancerCharges * monthlyFactor,
      travelAndFood: annualVariableCost.travelAndFood * monthlyFactor,
      accessoriesCost: annualVariableCost.accessoriesCost * monthlyFactor,
      otherCost: annualVariableCost.otherCost * monthlyFactor,
      totalVariableCost: annualVariableCost.totalVariableCost * monthlyFactor
    }
    
    const netProfit = calculateNetProfit(
      revenue.totalRevenue,
      fixedCost.totalFixedCost,
      variableCost.totalVariableCost
    )
    
    return {
      revenue,
      fixedCost,
      variableCost,
      netProfit,
      isProfitable: isProfitable(netProfit)
    }
  }, [startMonth, endMonth])
  
  const handleFYChange = useCallback((value: string) => {
    const fy = financialYears.find(f => f.label === value)
    if (fy) {
      setSelectedFY(fy)
    }
  }, [financialYears])
  
  const handleStartMonthChange = useCallback((value: number) => {
    setStartMonth(value)
    if (value > endMonth) {
      setEndMonth(value)
    }
  }, [endMonth])
  
  const handleEndMonthChange = useCallback((value: number) => {
    setEndMonth(value)
    if (value < startMonth) {
      setStartMonth(value)
    }
  }, [startMonth])
  
  const availableEndMonths = useMemo(() => {
    return months.filter(m => m.financialMonthIndex >= startMonth)
  }, [months, startMonth])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Title level={1} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                Dashboard
              </Title>
              <Paragraph className="!mb-0 !text-gray-600">
                Here&apos;s a summary of your finances and progress.
              </Paragraph>
            </div>
            
            <Space size="middle" className="flex-wrap">
              <Select
                value={selectedFY.label}
                onChange={handleFYChange}
                style={{ width: 150 }}
                size="large"
              >
                {financialYears.map(fy => (
                  <Option key={fy.label} value={fy.label}>
                    {fy.label}
                  </Option>
                ))}
              </Select>
              
              <Select
                value={startMonth}
                onChange={handleStartMonthChange}
                style={{ width: 130 }}
                size="large"
                placeholder="Start Month"
              >
                {months.map(month => (
                  <Option key={month.financialMonthIndex} value={month.financialMonthIndex}>
                    {month.label}
                  </Option>
                ))}
              </Select>
              
              <Text strong className="text-gray-500">to</Text>
              
              <Select
                value={endMonth}
                onChange={handleEndMonthChange}
                style={{ width: 130 }}
                size="large"
                placeholder="End Month"
              >
                {availableEndMonths.map(month => (
                  <Option key={month.financialMonthIndex} value={month.financialMonthIndex}>
                    {month.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text type="secondary" className="text-sm">Revenue</Text>
                    <RiseOutlined className="text-green-500 text-lg" />
                  </div>
                  <Title level={3} className="!mb-0 !text-2xl">
                    {formatDashboardCurrency(dashboardData.revenue.totalRevenue)}
                  </Title>
                  <Text type="secondary" className="text-xs">Net of Taxes</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text type="secondary" className="text-sm">Fixed Cost</Text>
                    <FallOutlined className="text-red-500 text-lg" />
                  </div>
                  <Title level={3} className="!mb-0 !text-2xl">
                    {formatDashboardCurrency(dashboardData.fixedCost.totalFixedCost)}
                  </Title>
                  <Text type="secondary" className="text-xs">Monthly recurring costs</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text type="secondary" className="text-sm">Variable Cost</Text>
                    <FallOutlined className="text-orange-500 text-lg" />
                  </div>
                  <Title level={3} className="!mb-0 !text-2xl">
                    {formatDashboardCurrency(dashboardData.variableCost.totalVariableCost)}
                  </Title>
                  <Text type="secondary" className="text-xs">Project-based costs</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                className={`h-full hover:shadow-lg transition-shadow ${
                  dashboardData.isProfitable 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text type="secondary" className="text-sm">Net Profit</Text>
                    <DollarOutlined 
                      className={`text-lg ${
                        dashboardData.isProfitable ? 'text-green-600' : 'text-red-600'
                      }`} 
                    />
                  </div>
                  <Title 
                    level={3} 
                    className={`!mb-0 !text-2xl ${
                      dashboardData.isProfitable ? '!text-green-700' : '!text-red-700'
                    }`}
                  >
                    {formatDashboardCurrency(Math.abs(dashboardData.netProfit))}
                  </Title>
                  <Text type="secondary" className="text-xs">
                    {dashboardData.isProfitable ? 'After all expenses' : 'Loss incurred'}
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card 
                title="Revenue (Net of Taxes)" 
                className="h-full"
                headStyle={{ backgroundColor: '#fafafa' }}
              >
                <Space direction="vertical" size="large" className="w-full">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Text>Payment Collected</Text>
                      <Text strong>{formatDashboardCurrency(dashboardData.revenue.paymentCollected)}</Text>
                    </div>
                    <Progress 
                      percent={getPercentage(
                        dashboardData.revenue.paymentCollected,
                        dashboardData.revenue.totalRevenue
                      )} 
                      strokeColor="#52c41a"
                      showInfo={false}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Text>Pending Payment</Text>
                      <Text strong>{formatDashboardCurrency(dashboardData.revenue.pendingPayment)}</Text>
                    </div>
                    <Progress 
                      percent={getPercentage(
                        dashboardData.revenue.pendingPayment,
                        dashboardData.revenue.totalRevenue
                      )} 
                      strokeColor="#faad14"
                      showInfo={false}
                    />
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card 
                title="Fixed Cost" 
                className="h-full"
                headStyle={{ backgroundColor: '#fafafa' }}
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <div className="flex justify-between items-center">
                    <Text>Salary</Text>
                    <Text strong>{formatDashboardCurrency(dashboardData.fixedCost.salary)}</Text>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Text>Software Cost</Text>
                    <Text strong>{formatDashboardCurrency(dashboardData.fixedCost.softwareCost)}</Text>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Text>Rent & Utilities</Text>
                    <Text strong>{formatDashboardCurrency(dashboardData.fixedCost.rentAndUtilities)}</Text>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Text>Marketing</Text>
                    <Text strong>{formatDashboardCurrency(dashboardData.fixedCost.marketing)}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
          
          <Card 
            title="Project Variable Cost" 
            headStyle={{ backgroundColor: '#fafafa' }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="flex justify-between items-center">
                  <Text>Equipment Cost</Text>
                  <Text strong>{formatDashboardCurrency(dashboardData.variableCost.equipmentCost)}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <div className="flex justify-between items-center">
                  <Text>Freelancer Charges</Text>
                  <Text strong>{formatDashboardCurrency(dashboardData.variableCost.freelancerCharges)}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <div className="flex justify-between items-center">
                  <Text>Travel & Food</Text>
                  <Text strong>{formatDashboardCurrency(dashboardData.variableCost.travelAndFood)}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <div className="flex justify-between items-center">
                  <Text>Accessories Cost</Text>
                  <Text strong>{formatDashboardCurrency(dashboardData.variableCost.accessoriesCost)}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <div className="flex justify-between items-center">
                  <Text>Other Cost</Text>
                  <Text strong>{formatDashboardCurrency(dashboardData.variableCost.otherCost)}</Text>
                </div>
              </Col>
            </Row>
          </Card>
          
          <Card 
            title="Financial Overview" 
            headStyle={{ backgroundColor: '#fafafa' }}
            className="min-h-[400px]"
          >
            <div className="flex items-center justify-center h-[350px] text-gray-400">
              <Text type="secondary" className="text-lg">Chart will be displayed here</Text>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard
