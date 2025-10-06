/**
 * Date Range Selector Utility Functions
 */

import type { FinancialYear, Month } from './types'

/**
 * Generate financial years for selection
 * Indian financial year: April (current year) to March (next year)
 * 
 * @param count - Number of financial years to generate
 * @returns Array of financial years
 */
export function generateFinancialYears(count: number = 5): FinancialYear[] {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() // 0-11
  const currentYear = currentDate.getFullYear()
  
  // Determine the current financial year
  const currentFYStartYear = currentMonth < 3 ? currentYear - 1 : currentYear
  
  const financialYears: FinancialYear[] = []
  
  for (let i = 0; i < count; i++) {
    const startYear = currentFYStartYear - i
    const endYear = startYear + 1
    financialYears.push({
      label: `FY ${startYear}-${endYear.toString().slice(-2)}`,
      startYear,
      endYear
    })
  }
  
  return financialYears
}

/**
 * Get all months in financial year order
 * Financial year starts from April (index 3) and ends in March (index 2)
 * 
 * @returns Array of months in financial year order
 */
export function getFinancialYearMonths(): Month[] {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  // Financial year order: April to March
  const financialYearOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]
  
  return financialYearOrder.map((monthIndex, financialIndex) => ({
    value: monthIndex,
    label: monthNames[monthIndex],
    financialMonthIndex: financialIndex + 1 // 1-12
  }))
}

/**
 * Get start and end dates for a financial year
 * 
 * @param fy - Financial year
 * @returns Start and end dates
 */
export function getFinancialYearDates(fy: FinancialYear): { start: Date; end: Date } {
  const start = new Date(fy.startYear, 3, 1) // April 1st
  const end = new Date(fy.endYear, 2, 31) // March 31st
  return { start, end }
}

/**
 * Get start and end dates for a month range in a financial year
 * 
 * @param fy - Financial year
 * @param startMonth - Start financial month index (1-12)
 * @param endMonth - End financial month index (1-12)
 * @returns Start and end dates
 */
export function getMonthRangeDates(
  fy: FinancialYear,
  startMonth: number,
  endMonth: number
): { start: Date; end: Date } {
  const months = getFinancialYearMonths()
  
  const startMonthData = months.find(m => m.financialMonthIndex === startMonth)
  const endMonthData = months.find(m => m.financialMonthIndex === endMonth)
  
  if (!startMonthData || !endMonthData) {
    throw new Error('Invalid month indices')
  }
  
  // Determine the year for start and end months
  const startYear = startMonthData.value >= 3 ? fy.startYear : fy.endYear
  const endYear = endMonthData.value >= 3 ? fy.startYear : fy.endYear
  
  const start = new Date(startYear, startMonthData.value, 1)
  
  // Get last day of end month
  const end = new Date(endYear, endMonthData.value + 1, 0)
  
  return { start, end }
}

/**
 * Format date range for display
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
  
  const start = startDate.toLocaleDateString('en-US', options)
  const end = endDate.toLocaleDateString('en-US', options)
  
  return `${start} - ${end}`
}
