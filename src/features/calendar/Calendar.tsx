import { useEffect, useState } from 'react'
import type { CalendarEvent } from '../../types/calendar'
import { calendarService } from '../../lib/googleCalendar'

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
      
      // Check calendar access first
      const hasAccess = await calendarService.checkCalendarAccess()
      if (!hasAccess) {
        throw new Error('Calendar access denied. Please sign in again and grant calendar permissions.')
      }
      
      // Load upcoming events
      const upcomingEvents = await calendarService.getUpcomingEvents(10)
      setEvents(upcomingEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar events')
      console.error('Calendar loading error:', err)
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
      return date.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    // Timed event
    const timeString = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    const dateString = date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
    
    return `${timeString} • ${dateString}`
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
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          <span className="text-gray-600">Loading your calendar...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Calendar</h2>
        <div className="text-red-600 mb-4">
          <div className="font-medium">Unable to load calendar</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
        <button
          onClick={loadEvents}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Try Again
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
          className="text-sm text-indigo-600 hover:text-indigo-700 focus:outline-none"
        >
          Refresh
        </button>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">📅</div>
          <div className="text-gray-600">No upcoming events found</div>
          <div className="text-sm text-gray-500 mt-1">
            Your calendar events will appear here
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border transition-colors ${
                isToday(event) 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : event.status === 'cancelled'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${
                    event.status === 'cancelled' 
                      ? 'text-red-700 line-through' 
                      : isToday(event) 
                      ? 'text-indigo-900' 
                      : 'text-gray-900'
                  }`}>
                    {event.summary || 'Untitled Event'}
                  </h3>
                  
                  <p className={`text-sm mt-1 ${
                    isToday(event) ? 'text-indigo-700' : 'text-gray-600'
                  }`}>
                    {formatEventTime(event)}
                  </p>
                  
                  {event.location && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <span className="mr-1">📍</span>
                      <span className="truncate">{event.location}</span>
                    </p>
                  )}
                  
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  {event.attendees && event.attendees.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  {isToday(event) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Today
                    </span>
                  )}
                  {event.status === 'cancelled' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
              
              {event.htmlLink && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <a
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View in Google Calendar →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
