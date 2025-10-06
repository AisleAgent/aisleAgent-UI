/**
 * Dashboard Utility Functions
 * Helper functions for financial calculations and date handling
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
  // If current month is Jan-Mar (0-2), we're in previous year's FY
  // If current month is Apr-Dec (3-11), we're in current year's FY
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
 * Get month name from financial month index
 * 
 * @param financialMonthIndex - 1-12 (1 = April, 12 = March)
 * @returns Month name
 */
export function getMonthNameFromFinancialIndex(financialMonthIndex: number): string {
  const months = getFinancialYearMonths()
  const month = months.find(m => m.financialMonthIndex === financialMonthIndex)
  return month?.label || ''
}

/**
 * Calculate net profit/loss
 * Formula: Revenue - Fixed Cost - Variable Cost
 * 
 * @param revenue - Total revenue
 * @param fixedCost - Total fixed cost
 * @param variableCost - Total variable cost
 * @returns Net profit (positive) or loss (negative)
 */
export function calculateNetProfit(
  revenue: number,
  fixedCost: number,
  variableCost: number
): number {
  return revenue - fixedCost - variableCost
}

/**
 * Check if the result is profitable
 * 
 * @param netProfit - Net profit/loss amount
 * @returns True if profitable, false if loss
 */
export function isProfitable(netProfit: number): boolean {
  return netProfit >= 0
}

/**
 * Format currency with proper formatting
 * 
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatDashboardCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Get percentage of total
 * 
 * @param value - Part value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}
