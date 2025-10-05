export const ONBOARDING_SCREENS = {
  BUSINESS_TYPE: 'BUSINESS_TYPE',
  BUSINESS_INFO: 'BUSINESS_INFO'
} as const

export const LEAD_STAGES = {
  FIRST_CALL_SCHEDULED: 'First Call Scheduled',
  QUALIFIED: 'Qualified',
  HOT_PROSPECT: 'Hot Prospect',
  QUOTE_SENT: 'Quote Sent',
  BOOKED: 'Booked',
  INITIAL_CONTACT: 'Initial Contact'
} as const

export type LeadStage = typeof LEAD_STAGES[keyof typeof LEAD_STAGES]
