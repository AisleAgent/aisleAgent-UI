// Lead Details Types

export interface Event {
  name: string
  date: string
  time: string
}

export interface TeamMember {
  name: string
  avatar: string
  contactNumber?: string
  email?: string
  type: 'employee' | 'freelancer'
  charges?: number
}

export interface Equipment {
  name: string
  cost: number
}

export interface MiscellaneousExpense {
  category: string
  description: string
  cost: number
}

export interface Payment {
  type: string
  date: string
  amount: number
  method: string
}

export interface LeadDetails {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  venue: string
  city: string
  budget: string
  status: string
  source: string
  createdAt: string
  notes: string
  salesPerson: string
  stage: string
  events: Event[]
  teamMembers: TeamMember[]
  equipment: Equipment[]
  miscellaneous: MiscellaneousExpense[]
  payments: Payment[]
  packageValue: number
  totalPaid: number
  pendingPayment: number
}
