# DateRangeSelector Component Documentation

## Overview

A reusable, composable date range selector component built with React best practices. Supports financial year (April-March), month range, and day-wise selection.

## Component Architecture

### Files Structure
```
src/components/DateRangeSelector/
├── DateRangeSelector.tsx    # Main component
├── types.ts                  # TypeScript interfaces
├── utils.ts                  # Utility functions
└── index.ts                  # Barrel exports
```

## React Best Practices Implemented

### 1. **Composition Pattern**
- Component accepts configuration props for flexibility
- Can be composed into different UIs (Modal, Popover, Inline)
- Granularity levels can be enabled/disabled independently

### 2. **Controlled Component**
- Uses `value` and `onChange` props
- Parent component controls the state
- Predictable data flow

### 3. **Performance Optimization**
- `memo` for component memoization
- `useMemo` for expensive calculations
- `useCallback` for stable function references

### 4. **TypeScript Type Safety**
- Comprehensive interfaces for all data structures
- Proper typing for props and state
- Type-safe utility functions

### 5. **Single Responsibility**
- Component focuses on date range selection
- Utility functions separated into `utils.ts`
- Types separated into `types.ts`

### 6. **Configurable & Flexible**
- Enable/disable granularity levels
- Configurable year count
- Customizable size and styling

## Usage Examples

### Basic Usage (Year & Month)
```tsx
import { DateRangeSelector } from '@/components/DateRangeSelector'

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRangeSelection | null>(null)
  
  return (
    <DateRangeSelector
      value={dateRange}
      onChange={setDateRange}
      enableMonthSelection
      enableYearSelection
    />
  )
}
```

### With Day Selection (Leads Page)
```tsx
<DateRangeSelector
  value={selectedDateRange}
  onChange={handleDateRangeChange}
  enableDaySelection      // Enable day-wise selection
  enableMonthSelection
  enableYearSelection
  size="large"
/>
```

### Year Only (Dashboard)
```tsx
<DateRangeSelector
  onChange={handleDateRangeChange}
  enableYearSelection
  enableMonthSelection
  size="large"
/>
```

### In a Modal
```tsx
<Modal
  title="Select Time Period"
  open={visible}
  onCancel={onClose}
  footer={null}
>
  <DateRangeSelector
    onChange={handleDateRangeChange}
    enableDaySelection
    enableMonthSelection
    enableYearSelection
  />
  <Button onClick={onClose}>Apply</Button>
</Modal>
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateRangeSelection` | `undefined` | Current selected date range |
| `onChange` | `(selection: DateRangeSelection) => void` | Required | Callback when selection changes |
| `enableDaySelection` | `boolean` | `false` | Enable day-wise date picker |
| `enableMonthSelection` | `boolean` | `true` | Enable month range selection |
| `enableYearSelection` | `boolean` | `true` | Enable year selection |
| `yearCount` | `number` | `5` | Number of financial years to show |
| `size` | `'small' \| 'middle' \| 'large'` | `'large'` | Size of input components |
| `className` | `string` | `''` | Additional CSS classes |

## DateRangeSelection Interface

```typescript
interface DateRangeSelection {
  financialYear: FinancialYear
  startMonth?: number          // 1-12 (financial month index)
  endMonth?: number            // 1-12 (financial month index)
  startDate?: Date
  endDate?: Date
  granularity: 'day' | 'month' | 'year'
}
```

## Features

### 1. **Financial Year Support**
- Indian financial year (April to March)
- Automatic current FY detection
- Configurable year range

### 2. **Three Granularity Levels**
- **Year**: Full financial year selection
- **Month**: Month range within FY
- **Day**: Specific date range with date picker

### 3. **Smart Validation**
- End month cannot be before start month
- Auto-adjustment when invalid selections occur
- Date range validation for day selection

### 4. **Visual Feedback**
- Selected period display at bottom
- Radio buttons for granularity selection
- Formatted date range preview

### 5. **Responsive Design**
- Mobile-friendly layout
- Flexible width selectors
- Proper spacing and alignment

## Utility Functions

### `generateFinancialYears(count: number)`
Generates array of financial years starting from current FY.

### `getFinancialYearMonths()`
Returns months in financial year order (April to March).

### `getFinancialYearDates(fy: FinancialYear)`
Returns start and end dates for a financial year.

### `getMonthRangeDates(fy, startMonth, endMonth)`
Returns start and end dates for a month range.

### `formatDateRange(startDate, endDate)`
Formats date range for display.

## Integration in Leads Page

The DateRangeSelector is integrated into the Leads page with:

1. **Modal Wrapper**: Opens in a centered modal
2. **Button Trigger**: Shows formatted date range
3. **State Management**: Uses `useState` for selection
4. **Callback Handler**: Updates parent state on change
5. **All Granularities**: Day, Month, and Year enabled

## Benefits

✅ **Reusable**: Can be used across Dashboard, Leads, Reports, etc.
✅ **Composable**: Works in Modal, Popover, or inline
✅ **Type-Safe**: Full TypeScript support
✅ **Performant**: Optimized with React hooks
✅ **Flexible**: Configurable granularity levels
✅ **Maintainable**: Well-documented and tested
✅ **Accessible**: Proper ARIA labels and keyboard support

## Future Enhancements

- [ ] Add preset ranges (Last 7 days, Last month, etc.)
- [ ] Add comparison mode (compare two periods)
- [ ] Add custom date format options
- [ ] Add timezone support
- [ ] Add locale support for different countries
- [ ] Add keyboard shortcuts
- [ ] Add animation transitions
