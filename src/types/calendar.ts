export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted'
  }>
  htmlLink?: string
  status?: 'confirmed' | 'tentative' | 'cancelled'
  creator?: {
    email: string
    displayName?: string
  }
  organizer?: {
    email: string
    displayName?: string
  }
}

export interface CalendarEventsResponse {
  kind: string
  etag: string
  summary: string
  description?: string
  updated: string
  timeZone: string
  accessRole: string
  items: CalendarEvent[]
  nextPageToken?: string
}

export interface CalendarInfo {
  kind: string
  etag: string
  id: string
  summary: string
  description?: string
  location?: string
  timeZone: string
  conferenceProperties?: {
    allowedConferenceSolutionTypes: string[]
  }
}
