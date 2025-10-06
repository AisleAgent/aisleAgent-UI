/**
 * Date Range Selector Types
 * Defines interfaces for the reusable date range selector component
 */

export type DateGranularity = 'day' | 'month' | 'year'

/**
 * Financial Year structure
 */
export interface FinancialYear {
  label: string
  startYear: number
  endYear: number
}

/**
 * Month structure
 */
export interface Month {
  value: number // 0-11 (JavaScript month index)
  label: string
  financialMonthIndex: number // 1-12 (1 = April, 12 = March)
}

/**
 * Date range selection result
 */
export interface DateRangeSelection {
  financialYear: FinancialYear
  startMonth?: number // Financial month index (1-12)
  endMonth?: number // Financial month index (1-12)
  startDate?: Date
  endDate?: Date
  granularity: DateGranularity
}

/**
 * Props for DateRangeSelector component
 */
export interface DateRangeSelectorProps {
  /**
   * Current selected date range
   */
  value?: DateRangeSelection
  
  /**
   * Callback when date range changes
   */
  onChange: (selection: DateRangeSelection) => void
  
  /**
   * Enable day-wise selection
   * @default false
   */
  enableDaySelection?: boolean
  
  /**
   * Enable month-wise selection
   * @default true
   */
  enableMonthSelection?: boolean
  
  /**
   * Enable year-wise selection
   * @default true
   */
  enableYearSelection?: boolean
  
  /**
   * Number of financial years to show in dropdown
   * @default 5
   */
  yearCount?: number
  
  /**
   * Size of the selector components
   * @default 'large'
   */
  size?: 'small' | 'middle' | 'large'
  
  /**
   * Additional CSS class
   */
  className?: string
}
