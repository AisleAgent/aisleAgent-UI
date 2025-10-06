import { memo, useState, useMemo, useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { Select, DatePicker, Space, Typography, Radio } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { DateRangeSelectorProps, DateRangeSelection, DateGranularity } from './types'
import { generateFinancialYears, getFinancialYearMonths, getFinancialYearDates, getMonthRangeDates } from './utils'

const { Option } = Select
const { RangePicker } = DatePicker
const { Text } = Typography

/**
 * DateRangeSelector Component
 * 
 * A reusable, composable date range selector that supports:
 * - Financial year selection (April to March)
 * - Month range selection within financial year
 * - Day-wise date range selection
 * 
 * Following React best practices:
 * - Composition pattern for flexibility
 * - Controlled component with value/onChange
 * - Memoized calculations for performance
 * - TypeScript for type safety
 * - Configurable granularity levels
 * 
 * @example
 * ```tsx
 * <DateRangeSelector
 *   enableDaySelection
 *   onChange={(selection) => console.log(selection)}
 * />
 * ```
 */
export const DateRangeSelector: FC<DateRangeSelectorProps> = memo(({
  value,
  onChange,
  enableDaySelection = false,
  enableMonthSelection = true,
  enableYearSelection = true,
  yearCount = 5,
  size = 'large',
  className = ''
}) => {
  // Generate financial years and months
  const financialYears = useMemo(() => generateFinancialYears(yearCount), [yearCount])
  const months = useMemo(() => getFinancialYearMonths(), [])
  
  // Determine default granularity based on enabled options
  const defaultGranularity: DateGranularity = useMemo(() => {
    if (enableDaySelection) return 'day'
    if (enableMonthSelection) return 'month'
    return 'year'
  }, [enableDaySelection, enableMonthSelection])
  
  // Local state
  const [granularity, setGranularity] = useState<DateGranularity>(
    value?.granularity || defaultGranularity
  )
  const [selectedFY, setSelectedFY] = useState(value?.financialYear || financialYears[0])
  const [startMonth, setStartMonth] = useState(value?.startMonth || 1)
  const [endMonth, setEndMonth] = useState(value?.endMonth || 12)
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    value?.startDate && value?.endDate 
      ? [dayjs(value.startDate), dayjs(value.endDate)]
      : null
  )
  
  /**
   * Get available end months based on start month
   */
  const availableEndMonths = useMemo(() => {
    return months.filter(m => m.financialMonthIndex >= startMonth)
  }, [months, startMonth])
  
  /**
   * Calculate date range based on current selection
   */
  const calculatedDateRange = useMemo(() => {
    if (granularity === 'day' && dateRange && dateRange[0] && dateRange[1]) {
      return {
        start: dateRange[0].toDate(),
        end: dateRange[1].toDate()
      }
    } else if (granularity === 'month') {
      return getMonthRangeDates(selectedFY, startMonth, endMonth)
    } else {
      return getFinancialYearDates(selectedFY)
    }
  }, [granularity, selectedFY, startMonth, endMonth, dateRange])
  
  /**
   * Notify parent of selection change
   */
  const notifyChange = useCallback(() => {
    const selection: DateRangeSelection = {
      financialYear: selectedFY,
      granularity,
      startDate: calculatedDateRange.start,
      endDate: calculatedDateRange.end
    }
    
    if (granularity === 'month') {
      selection.startMonth = startMonth
      selection.endMonth = endMonth
    }
    
    onChange(selection)
  }, [selectedFY, granularity, startMonth, endMonth, calculatedDateRange, onChange])
  
  /**
   * Handle financial year change
   */
  const handleFYChange = useCallback((value: string) => {
    const fy = financialYears.find(f => f.label === value)
    if (fy) {
      setSelectedFY(fy)
    }
  }, [financialYears])
  
  /**
   * Handle start month change
   */
  const handleStartMonthChange = useCallback((value: number) => {
    setStartMonth(value)
    if (value > endMonth) {
      setEndMonth(value)
    }
  }, [endMonth])
  
  /**
   * Handle end month change
   */
  const handleEndMonthChange = useCallback((value: number) => {
    setEndMonth(value)
    if (value < startMonth) {
      setStartMonth(value)
    }
  }, [startMonth])
  
  /**
   * Handle date range change
   */
  const handleDateRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates)
  }, [])
  
  /**
   * Handle granularity change
   */
  const handleGranularityChange = useCallback((newGranularity: DateGranularity) => {
    setGranularity(newGranularity)
  }, [])
  
  // Auto-apply when granularity changes or selections change
  useEffect(() => {
    notifyChange()
  }, [notifyChange])
  
  /**
   * Determine which granularity options to show
   */
  const granularityOptions = useMemo(() => {
    const options = []
    if (enableYearSelection) {
      options.push({ label: 'Year', value: 'year' as DateGranularity })
    }
    if (enableMonthSelection) {
      options.push({ label: 'Month', value: 'month' as DateGranularity })
    }
    if (enableDaySelection) {
      options.push({ label: 'Day', value: 'day' as DateGranularity })
    }
    return options
  }, [enableYearSelection, enableMonthSelection, enableDaySelection])
  
  return (
    <div className={`date-range-selector ${className}`}>
      <Space direction="vertical" size="middle" className="w-full">
        {/* Granularity Selector - Only show if multiple options available */}
        {granularityOptions.length > 1 && (
          <div>
            <Text strong className="block mb-2">Select Time Period</Text>
            <Radio.Group
              value={granularity}
              onChange={(e) => handleGranularityChange(e.target.value)}
              buttonStyle="solid"
              size={size}
            >
              {granularityOptions.map(option => (
                <Radio.Button key={option.value} value={option.value}>
                  {option.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        )}
        
        {/* Financial Year Selector - Always visible */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            <Text strong className="block mb-2">Financial Year</Text>
            <Select
              value={selectedFY.label}
              onChange={handleFYChange}
              className="w-full sm:w-auto"
              style={{ minWidth: 150 }}
              size={size}
            >
              {financialYears.map(fy => (
                <Option key={fy.label} value={fy.label}>
                  {fy.label}
                </Option>
              ))}
            </Select>
          </div>
          
          {/* Month Range Selectors - Show only for month granularity */}
          {granularity === 'month' && (
            <>
              <div className="flex-shrink-0">
                <Text strong className="block mb-2">Start Month</Text>
                <Select
                  value={startMonth}
                  onChange={handleStartMonthChange}
                  className="w-full sm:w-auto"
                  style={{ minWidth: 130 }}
                  size={size}
                >
                  {months.map(month => (
                    <Option key={month.financialMonthIndex} value={month.financialMonthIndex}>
                      {month.label}
                    </Option>
                  ))}
                </Select>
              </div>
              
              <Text strong className="text-gray-500 hidden sm:inline self-end pb-2">to</Text>
              
              <div className="flex-shrink-0">
                <Text strong className="block mb-2">End Month</Text>
                <Select
                  value={endMonth}
                  onChange={handleEndMonthChange}
                  className="w-full sm:w-auto"
                  style={{ minWidth: 130 }}
                  size={size}
                >
                  {availableEndMonths.map(month => (
                    <Option key={month.financialMonthIndex} value={month.financialMonthIndex}>
                      {month.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </>
          )}
          
          {/* Date Range Picker - Show only for day granularity */}
          {granularity === 'day' && (
            <div className="flex-shrink-0">
              <Text strong className="block mb-2">Date Range</Text>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                size={size}
                format="MMM DD, YYYY"
                className="w-full"
                suffixIcon={<CalendarOutlined />}
              />
            </div>
          )}
        </div>
        
        {/* Selected Range Display */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Text type="secondary" className="text-xs block mb-1">Selected Period:</Text>
          <Text strong className="text-sm">
            {calculatedDateRange.start.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
            {' → '}
            {calculatedDateRange.end.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </div>
      </Space>
    </div>
  )
})

DateRangeSelector.displayName = 'DateRangeSelector'
