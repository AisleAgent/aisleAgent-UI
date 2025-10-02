interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
  }>
}

interface CalendarEventsResponse {
  items: CalendarEvent[]
}

class GoogleCalendarService {
  private getAccessToken(): string | null {
    return localStorage.getItem('google_access_token')
  }

  async checkCalendarAccess(): Promise<boolean> {
    const accessToken = this.getAccessToken()
    if (!accessToken) return false

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  async getUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
    const accessToken = this.getAccessToken()
    
    if (!accessToken) {
      throw new Error('No Google access token found. Please sign in again.')
    }

    const now = new Date().toISOString()
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
    
    url.searchParams.set('timeMin', now)
    url.searchParams.set('maxResults', maxResults.toString())
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')

    console.log('Fetching calendar events from:', url.toString())
    console.log('Access token exists:', !!accessToken)

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Calendar API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Calendar API Error:', errorText)
      
      if (response.status === 401) {
        // Token expired, clear it
        localStorage.removeItem('google_access_token')
        throw new Error('Access token expired. Please sign in again.')
      }
      if (response.status === 403) {
        throw new Error('Calendar access denied. Please check your Google Calendar permissions.')
      }
      throw new Error(`Failed to fetch calendar events: ${response.status} ${response.statusText}`)
    }

    const data: CalendarEventsResponse = await response.json()
    console.log('Calendar events received:', data.items?.length || 0)
    return data.items || []
  }

  async getTodaysEvents(): Promise<CalendarEvent[]> {
    const accessToken = this.getAccessToken()
    
    if (!accessToken) {
      throw new Error('No Google access token found. Please sign in again.')
    }

    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
    
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
    
    url.searchParams.set('timeMin', startOfDay)
    url.searchParams.set('timeMax', endOfDay)
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_access_token')
        throw new Error('Access token expired. Please sign in again.')
      }
      throw new Error(`Failed to fetch today's events: ${response.statusText}`)
    }

    const data: CalendarEventsResponse = await response.json()
    return data.items || []
  }
}

const calendarService = new GoogleCalendarService()

export type { CalendarEvent }
export { GoogleCalendarService, calendarService }
