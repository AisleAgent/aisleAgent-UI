import { memo, useState, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import { Typography, Space, Collapse } from 'antd'
import { Navbar } from '../../components/Navbar'
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
          <div>
            <Title level={1} className="!text-3xl !font-bold !text-gray-900">
              Fixed Cost Management
            </Title>
            <Paragraph className="!mt-2 !text-gray-600">
              Manage your monthly recurring expenses across all categories
            </Paragraph>
          </div>

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
