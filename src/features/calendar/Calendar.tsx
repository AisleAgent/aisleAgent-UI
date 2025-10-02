import { useEffect, useState } from 'react'
import type { CalendarEvent } from '../../services/googleCalendar'
import { calendarService } from '../../services/googleCalendar'

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if we have calendar access first
      const hasAccess = await calendarService.checkCalendarAccess()
      if (!hasAccess) {
        throw new Error('No calendar access. Please sign in again and grant calendar permissions.')
      }
      
      const upcomingEvents = await calendarService.getUpcomingEvents(20)
      setEvents(upcomingEvents)
    } catch (err) {
      console.error('Calendar loading error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  const formatEventTime = (event: CalendarEvent): string => {
    const start = event.start.dateTime || event.start.date
    if (!start) return ''

    const date = new Date(start)
    
    // All-day event
    if (event.start.date && !event.start.dateTime) {
      return date.toLocaleDateString()
    }
    
    // Timed event
    return date.toLocaleString()
  }

  const isToday = (event: CalendarEvent): boolean => {
    const start = event.start.dateTime || event.start.date
    if (!start) return false
    
    const eventDate = new Date(start)
    const today = new Date()
    
    return eventDate.toDateString() === today.toDateString()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Calendar</h2>
        <div className="text-gray-600">Loading your meetings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Calendar</h2>
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadEvents}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Calendar</h2>
        <button
          onClick={loadEvents}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Refresh
        </button>
      </div>
      
      {events.length === 0 ? (
        <div className="text-gray-600">No upcoming meetings found.</div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border ${
                isToday(event) 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {event.summary || 'Untitled Event'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatEventTime(event)}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                {isToday(event) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Today
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
