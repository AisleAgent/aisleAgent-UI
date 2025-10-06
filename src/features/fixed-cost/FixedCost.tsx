import { memo, useState, useMemo, useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { Typography, Space, Collapse, Alert, Button, Modal } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { Navbar } from '../../components/Navbar'
import { useLocalStorage, useDebounce } from '../../hooks'
import { EmployeeSalaryCard } from './components/EmployeeSalaryCard'
import { EmployeeSalaryForm } from './components/EmployeeSalaryForm'
import { SoftwareCostCard } from './components/SoftwareCostCard'
import { SoftwareCostForm } from './components/SoftwareCostForm'
import { UtilitiesCard } from './components/UtilitiesCard'
import { UtilitiesForm } from './components/UtilitiesForm'
import { AdvertisementCard } from './components/AdvertisementCard'
import { AdvertisementForm } from './components/AdvertisementForm'
import { MiscellaneousCard } from './components/MiscellaneousCard'
import { MiscellaneousForm } from './components/MiscellaneousForm'
import type { FixedCostData, Employee, Software, Utility, AdAgency, MiscellaneousItem } from './types'
import { formatCurrency } from '../../utils'

const { Title, Paragraph, Text } = Typography

/**
 * FixedCost Component
 * Manages monthly recurring expenses across multiple categories
 * 
 * Following React best practices:
 * - Component segregation (separate components for each category)
 * - State management with useState
 * - Memoized calculations with useMemo
 * - Optimized callbacks with useCallback
 * - TypeScript for type safety
 * - Proper component structure
 * 
 * @returns FixedCost page component
 */
const FixedCost: FC = memo(() => {
  // Auto-save state management
  const [showDraftAlert, setShowDraftAlert] = useState(false)
  const [draftData, setDraftData, clearDraftData] = useLocalStorage<FixedCostData | null>(
    'fixed-cost-all-data',
    null
  )
  const [lastSaved, setLastSaved] = useLocalStorage<number | null>(
    'fixed-cost-all-data_timestamp',
    null
  )

  // State management for all categories
  const [fixedCostData, setFixedCostData] = useState<FixedCostData>({
    employeeSalary: { mode: 'total', totalSalary: 0 },
    softwareCost: { mode: 'total', totalCost: 0 },
    utilities: [],
    advertisements: [],
    miscellaneous: []
  })

  // Edit mode states
  const [editingEmployeeSalary, setEditingEmployeeSalary] = useState(false)
  const [editingSoftwareCost, setEditingSoftwareCost] = useState(false)
  const [editingUtilities, setEditingUtilities] = useState(false)
  const [editingAdvertisements, setEditingAdvertisements] = useState(false)
  const [editingMiscellaneous, setEditingMiscellaneous] = useState(false)

  // Debounced data for auto-save
  const debouncedData = useDebounce(fixedCostData, 1000)

  /**
   * Check for existing draft on mount
   */
  useEffect(() => {
    if (draftData) {
      setShowDraftAlert(true)
    }
  }, [draftData])

  /**
   * Auto-save data when it changes (debounced)
   */
  useEffect(() => {
    // Check if data has meaningful content
    const hasData = 
      (debouncedData.employeeSalary.totalSalary && debouncedData.employeeSalary.totalSalary > 0) ||
      (debouncedData.employeeSalary.employees && debouncedData.employeeSalary.employees.length > 0) ||
      (debouncedData.softwareCost.totalCost && debouncedData.softwareCost.totalCost > 0) ||
      (debouncedData.softwareCost.software && debouncedData.softwareCost.software.length > 0) ||
      debouncedData.utilities.length > 0 ||
      debouncedData.advertisements.length > 0 ||
      debouncedData.miscellaneous.length > 0

    if (hasData) {
      setDraftData(debouncedData)
      setLastSaved(Date.now())
    }
  }, [debouncedData, setDraftData, setLastSaved])

  /**
   * Get formatted last saved time
   */
  const getLastSavedText = useCallback(() => {
    if (!lastSaved) return null
    
    const now = Date.now()
    const diff = now - lastSaved
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    const days = Math.floor(diff / 86400000)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }, [lastSaved])

  const lastSavedText = getLastSavedText()

  /**
   * Handle draft restoration
   */
  const handleRestoreDraft = useCallback(() => {
    if (draftData) {
      setFixedCostData(draftData)
      setShowDraftAlert(false)
    }
  }, [draftData])

  /**
   * Handle draft dismissal
   */
  const handleDismissDraft = useCallback(() => {
    Modal.confirm({
      title: 'Discard Draft?',
      content: 'Are you sure you want to discard the saved draft? This action cannot be undone.',
      okText: 'Discard',
      okType: 'danger',
      cancelText: 'Keep Draft',
      onOk: () => {
        clearDraftData()
        setShowDraftAlert(false)
      }
    })
  }, [clearDraftData])

  /**
   * Calculate employee salary total
   * Memoized to prevent unnecessary recalculations
   */
  const employeeSalaryTotal = useMemo(() => {
    if (fixedCostData.employeeSalary.mode === 'total') {
      return fixedCostData.employeeSalary.totalSalary || 0
    }
    return fixedCostData.employeeSalary.employees?.reduce((sum, emp) => sum + emp.salary, 0) || 0
  }, [fixedCostData.employeeSalary])

  /**
   * Calculate software cost total
   * Memoized to prevent unnecessary recalculations
   */
  const softwareCostTotal = useMemo(() => {
    if (fixedCostData.softwareCost.mode === 'total') {
      return fixedCostData.softwareCost.totalCost || 0
    }
    return fixedCostData.softwareCost.software?.reduce((sum, sw) => sum + sw.cost, 0) || 0
  }, [fixedCostData.softwareCost])

  /**
   * Calculate utilities total
   */
  const utilitiesTotal = useMemo(() => 
    fixedCostData.utilities.reduce((sum, item) => sum + item.charges, 0),
    [fixedCostData.utilities]
  )

  /**
   * Calculate advertisements total
   */
  const advertisementsTotal = useMemo(() => 
    fixedCostData.advertisements.reduce((sum, item) => sum + item.charges, 0),
    [fixedCostData.advertisements]
  )

  /**
   * Calculate miscellaneous total
   */
  const miscellaneousTotal = useMemo(() => 
    fixedCostData.miscellaneous.reduce((sum, item) => sum + item.charges, 0),
    [fixedCostData.miscellaneous]
  )

  /**
   * Calculate grand total
   * Sum of all categories
   */
  const grandTotal = useMemo(() => 
    employeeSalaryTotal + softwareCostTotal + utilitiesTotal + advertisementsTotal + miscellaneousTotal,
    [employeeSalaryTotal, softwareCostTotal, utilitiesTotal, advertisementsTotal, miscellaneousTotal]
  )

  /**
   * Handle employee salary save
   * useCallback to maintain stable reference
   */
  const handleEmployeeSalarySave = useCallback((
    mode: 'total' | 'individual',
    totalSalary?: number,
    employees?: Employee[]
  ) => {
    setFixedCostData(prev => ({
      ...prev,
      employeeSalary: { mode, totalSalary, employees }
    }))
    setEditingEmployeeSalary(false)
  }, [])

  /**
   * Handle software cost save
   */
  const handleSoftwareCostSave = useCallback((
    mode: 'total' | 'individual',
    totalCost?: number,
    software?: Software[]
  ) => {
    setFixedCostData(prev => ({
      ...prev,
      softwareCost: { mode, totalCost, software }
    }))
    setEditingSoftwareCost(false)
  }, [])

  /**
   * Handle utilities save
   */
  const handleUtilitiesSave = useCallback((utilities: Utility[]) => {
    setFixedCostData(prev => ({
      ...prev,
      utilities
    }))
    setEditingUtilities(false)
  }, [])

  /**
   * Handle advertisements save
   */
  const handleAdvertisementsSave = useCallback((advertisements: AdAgency[]) => {
    setFixedCostData(prev => ({
      ...prev,
      advertisements
    }))
    setEditingAdvertisements(false)
  }, [])

  /**
   * Handle miscellaneous save
   */
  const handleMiscellaneousSave = useCallback((miscellaneous: MiscellaneousItem[]) => {
    setFixedCostData(prev => ({
      ...prev,
      miscellaneous
    }))
    setEditingMiscellaneous(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <Title level={1} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                Fixed Cost Management
              </Title>
              <Paragraph className="!mt-0 !text-gray-600">
                Manage your monthly recurring expenses across all categories
              </Paragraph>
            </div>
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

          {/* Draft restoration alert */}
          {showDraftAlert && (
            <Alert
              message="Draft Found"
              description="We found previously saved data. Would you like to restore it?"
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
            />
          )}

          {/* Financial Summary Accordion */}
          <Collapse
            items={[
              {
                key: '1',
                label: (
                  <div className="flex justify-between items-center pr-4">
                    <Text strong className="text-lg">Total Monthly Fixed Cost</Text>
                    <Text strong className="text-2xl text-blue-600">{formatCurrency(grandTotal)}</Text>
                  </div>
                ),
                children: (
                  <Space direction="vertical" size="middle" className="w-full">
                    {/* Employee Salary */}
                    <div className="flex justify-between items-center">
                      <Text>Employee Salary</Text>
                      <Text strong>{formatCurrency(employeeSalaryTotal)}</Text>
                    </div>
                    
                    {/* Software Cost */}
                    <div className="flex justify-between items-center">
                      <Text>Software Cost</Text>
                      <Text strong>{formatCurrency(softwareCostTotal)}</Text>
                    </div>
                    
                    {/* Rent & Utilities */}
                    <div className="flex justify-between items-center">
                      <Text>Rent & Utilities</Text>
                      <Text strong>{formatCurrency(utilitiesTotal)}</Text>
                    </div>
                    
                    {/* Advertisement Charges */}
                    <div className="flex justify-between items-center">
                      <Text>Advertisement Charges</Text>
                      <Text strong>{formatCurrency(advertisementsTotal)}</Text>
                    </div>
                    
                    {/* Other & Miscellaneous */}
                    <div className="flex justify-between items-center">
                      <Text>Other & Miscellaneous Charges</Text>
                      <Text strong>{formatCurrency(miscellaneousTotal)}</Text>
                    </div>
                  </Space>
                )
              }
            ]}
            defaultActiveKey={['1']}
            className="bg-white shadow-md"
            style={{ marginBottom: '32px' }}
          />

          {/* Category Forms */}
          <Space direction="vertical" size="large" className="w-full">
            {/* Employee Salary */}
            {editingEmployeeSalary ? (
              <EmployeeSalaryForm
                mode={fixedCostData.employeeSalary.mode}
                totalSalary={fixedCostData.employeeSalary.totalSalary}
                employees={fixedCostData.employeeSalary.employees}
                onSave={handleEmployeeSalarySave}
                onCancel={() => setEditingEmployeeSalary(false)}
              />
            ) : (
              <EmployeeSalaryCard
                data={fixedCostData.employeeSalary}
                total={employeeSalaryTotal}
                onEdit={() => setEditingEmployeeSalary(true)}
              />
            )}

            {/* Software Cost */}
            {editingSoftwareCost ? (
              <SoftwareCostForm
                mode={fixedCostData.softwareCost.mode}
                totalCost={fixedCostData.softwareCost.totalCost}
                software={fixedCostData.softwareCost.software}
                onSave={handleSoftwareCostSave}
                onCancel={() => setEditingSoftwareCost(false)}
              />
            ) : (
              <SoftwareCostCard
                data={fixedCostData.softwareCost}
                total={softwareCostTotal}
                onEdit={() => setEditingSoftwareCost(true)}
              />
            )}

            {/* Rent & Utilities */}
            {editingUtilities ? (
              <UtilitiesForm
                utilities={fixedCostData.utilities}
                onSave={handleUtilitiesSave}
                onCancel={() => setEditingUtilities(false)}
              />
            ) : (
              <UtilitiesCard
                utilities={fixedCostData.utilities}
                total={utilitiesTotal}
                onEdit={() => setEditingUtilities(true)}
              />
            )}

            {/* Advertisement Charges */}
            {editingAdvertisements ? (
              <AdvertisementForm
                advertisements={fixedCostData.advertisements}
                onSave={handleAdvertisementsSave}
                onCancel={() => setEditingAdvertisements(false)}
              />
            ) : (
              <AdvertisementCard
                advertisements={fixedCostData.advertisements}
                total={advertisementsTotal}
                onEdit={() => setEditingAdvertisements(true)}
              />
            )}

            {/* Other & Miscellaneous */}
            {editingMiscellaneous ? (
              <MiscellaneousForm
                miscellaneous={fixedCostData.miscellaneous}
                onSave={handleMiscellaneousSave}
                onCancel={() => setEditingMiscellaneous(false)}
              />
            ) : (
              <MiscellaneousCard
                miscellaneous={fixedCostData.miscellaneous}
                total={miscellaneousTotal}
                onEdit={() => setEditingMiscellaneous(true)}
              />
            )}
          </Space>
        </div>
      </main>
    </div>
  )
})

// Display name for React DevTools
FixedCost.displayName = 'FixedCost'

export default FixedCost
