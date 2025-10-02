import type { CalendarEvent, CalendarEventsResponse, CalendarInfo } from '../types/calendar'

class GoogleCalendarService {
  private getAccessToken(): string | null {
    return localStorage.getItem('google_access_token')
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const accessToken = this.getAccessToken()
    
    if (!accessToken) {
      throw new Error('No Google access token found. Please sign in again.')
    }

    const response = await fetch(`https://www.googleapis.com/calendar/v3${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_access_token')
        throw new Error('Access token expired. Please sign in again.')
      }
      
      if (response.status === 403) {
        const errorData = await response.json().catch(() => null)
        if (errorData?.error?.message?.includes('Calendar API has not been used') || 
            errorData?.error?.message?.includes('SERVICE_DISABLED')) {
          throw new Error('🚨 Google Calendar API is not enabled in your Google Cloud project. Please enable it by visiting: https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=728540386941')
        }
        throw new Error('Calendar access denied. Please check your Google Calendar permissions.')
      }
      
      throw new Error(`Calendar API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async checkCalendarAccess(): Promise<boolean> {
    try {
      await this.makeRequest<CalendarInfo>('/calendars/primary')
      return true
    } catch (error) {
      console.error('Calendar access check failed:', error)
      return false
    }
  }

  async getUpcomingEvents(maxResults: number = 20): Promise<CalendarEvent[]> {
    try {
      const now = new Date().toISOString()
      const params = new URLSearchParams({
        timeMin: now,
        maxResults: maxResults.toString(),
        singleEvents: 'true',
        orderBy: 'startTime'
      })

      const data = await this.makeRequest<CalendarEventsResponse>(`/calendars/primary/events?${params}`)
      return data.items || []
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error)
      throw error
    }
  }

  async getTodaysEvents(): Promise<CalendarEvent[]> {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
      
      const params = new URLSearchParams({
        timeMin: startOfDay,
        timeMax: endOfDay,
        singleEvents: 'true',
        orderBy: 'startTime'
      })

      const data = await this.makeRequest<CalendarEventsResponse>(`/calendars/primary/events?${params}`)
      return data.items || []
    } catch (error) {
      console.error('Failed to fetch today\'s events:', error)
      throw error
    }
  }

  async getEventsForDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime'
      })

      const data = await this.makeRequest<CalendarEventsResponse>(`/calendars/primary/events?${params}`)
      return data.items || []
    } catch (error) {
      console.error('Failed to fetch events for date range:', error)
      throw error
    }
  }
}

export const calendarService = new GoogleCalendarService()
export { GoogleCalendarService }
