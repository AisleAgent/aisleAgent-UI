/**
 * Dashboard Types
 * Defines interfaces for financial dashboard data structures
 */

/**
 * Financial Year structure
 * Indian financial year runs from April to March
 */
export interface FinancialYear {
  label: string // e.g., "FY 2024-25"
  startYear: number // e.g., 2024
  endYear: number // e.g., 2025
}

/**
 * Month structure for selection
 */
export interface Month {
  value: number // 0-11 (JavaScript month index)
  label: string // e.g., "April"
  financialMonthIndex: number // 1-12 (1 = April, 12 = March)
}

/**
 * Date range for filtering
 */
export interface DateRange {
  startMonth: number // Financial month index (1-12)
  endMonth: number // Financial month index (1-12)
  financialYear: FinancialYear
}

/**
 * Revenue breakdown from projects
 */
export interface RevenueData {
  paymentCollected: number
  pendingPayment: number
  totalRevenue: number
}

/**
 * Fixed cost breakdown
 */
export interface FixedCostData {
  salary: number
  softwareCost: number
  rentAndUtilities: number
  marketing: number
  totalFixedCost: number
}

/**
 * Variable cost breakdown (project-based)
 */
export interface VariableCostData {
  equipmentCost: number
  freelancerCharges: number
  travelAndFood: number
  accessoriesCost: number
  otherCost: number
  totalVariableCost: number
}

/**
 * Complete dashboard summary
 */
export interface DashboardSummary {
  revenue: RevenueData
  fixedCost: FixedCostData
  variableCost: VariableCostData
  netProfit: number
  isProfitable: boolean
}
