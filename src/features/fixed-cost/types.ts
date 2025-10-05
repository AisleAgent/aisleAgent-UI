/**
 * Fixed Cost Types
 * TypeScript interfaces for fixed cost management
 * Following type-safety best practices
 */

/**
 * Employee interface for individual employee details
 */
export interface Employee {
  employeeId: string
  name: string
  phoneNumber: string
  salary: number
}

/**
 * Software interface for individual software subscriptions
 */
export interface Software {
  softwareName: string
  cost: number
}

/**
 * Utility interface for rent and utility expenses
 */
export interface Utility {
  name: string
  charges: number
}

/**
 * Advertisement Agency interface
 */
export interface AdAgency {
  agencyName: string
  charges: number
}

/**
 * Miscellaneous expense interface
 */
export interface MiscellaneousItem {
  name: string
  charges: number
}

/**
 * Employee Salary Category
 * Can be either total or individual breakdown
 */
export interface EmployeeSalaryCategory {
  mode: 'total' | 'individual'
  totalSalary?: number
  employees?: Employee[]
}

/**
 * Software Cost Category
 * Can be either total or individual breakdown
 */
export interface SoftwareCostCategory {
  mode: 'total' | 'individual'
  totalCost?: number
  software?: Software[]
}

/**
 * Complete Fixed Cost Data Structure
 */
export interface FixedCostData {
  employeeSalary: EmployeeSalaryCategory
  softwareCost: SoftwareCostCategory
  utilities: Utility[]
  advertisements: AdAgency[]
  miscellaneous: MiscellaneousItem[]
}

/**
 * Category totals for summary display
 */
export interface CategoryTotals {
  employeeSalary: number
  softwareCost: number
  utilities: number
  advertisements: number
  miscellaneous: number
  grandTotal: number
}
