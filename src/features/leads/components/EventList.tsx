import { useState, useCallback } from 'react'
import { Button, Card, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import { EventForm } from './EventForm'
import { EventCard } from './EventCard'
import type { Event } from '../types'

interface EventListProps {
  events: Event[]
  onEventsChange: (events: Event[]) => void
}

export function EventList({ events, onEventsChange }: EventListProps) {
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEventName, setNewEventName] = useState('')
  const [newEventDate, setNewEventDate] = useState<Dayjs | null>(null)
  const [newEventTime, setNewEventTime] = useState<Dayjs | null>(null)
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editEventName, setEditEventName] = useState('')
  const [editEventDate, setEditEventDate] = useState<Dayjs | null>(null)
  const [editEventTime, setEditEventTime] = useState<Dayjs | null>(null)

  const handleAddEvent = useCallback(() => {
    setShowAddEvent(true)
  }, [])

  const handleCancelAddEvent = useCallback(() => {
    setShowAddEvent(false)
    setNewEventName('')
    setNewEventDate(null)
    setNewEventTime(null)
  }, [])

  const handleSaveEvent = useCallback(() => {
    if (newEventName && newEventDate && newEventTime) {
      const formattedDate = newEventDate.format('MMMM DD, YYYY')
      const formattedTime = newEventTime.format('hh:mm A')
      
      const newEvent: Event = {
        name: newEventName,
        date: formattedDate,
        time: formattedTime
      }
      
      onEventsChange([...events, newEvent])
      handleCancelAddEvent()
    }
  }, [newEventName, newEventDate, newEventTime, events, onEventsChange, handleCancelAddEvent])

  const handleEditEvent = useCallback((index: number) => {
    const event = events[index]
    setEditingIndex(index)
    setEditEventName(event.name)
    
    const dateParts = event.date.split(', ')
    const monthDay = dateParts[0]
    const year = dateParts[1]
    const dateString = `${monthDay}, ${year}`
    setEditEventDate(dayjs(dateString, 'MMMM DD, YYYY'))
    setEditEventTime(dayjs(event.time, 'hh:mm A'))
  }, [events])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditEventName('')
    setEditEventDate(null)
    setEditEventTime(null)
  }, [])

  const handleUpdateEvent = useCallback(() => {
    if (editEventName && editEventDate && editEventTime && editingIndex !== null) {
      const formattedDate = editEventDate.format('MMMM DD, YYYY')
      const formattedTime = editEventTime.format('hh:mm A')
      
      const updatedEvent: Event = {
        name: editEventName,
        date: formattedDate,
        time: formattedTime
      }
      
      const updatedEvents = [...events]
      updatedEvents[editingIndex] = updatedEvent
      onEventsChange(updatedEvents)
      handleCancelEdit()
    }
  }, [editEventName, editEventDate, editEventTime, editingIndex, events, onEventsChange, handleCancelEdit])

  const handleDeleteEvent = useCallback((index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index)
    onEventsChange(updatedEvents)
  }, [events, onEventsChange])

  return (
    <Card 
      title="Event Details" 
      extra={
        <Button 
          type="text" 
          icon={<PlusOutlined />}
          onClick={handleAddEvent}
        >
          Add Event
        </Button>
      }
      className="w-full"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* Add Event Form */}
        {showAddEvent && (
          <EventForm
            eventName={newEventName}
            eventDate={newEventDate}
            eventTime={newEventTime}
            onNameChange={setNewEventName}
            onDateChange={setNewEventDate}
            onTimeChange={setNewEventTime}
            onSave={handleSaveEvent}
            onCancel={handleCancelAddEvent}
            saveButtonText="Save"
          />
        )}

        {/* Event List */}
        {events?.map((event, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <EventForm
                eventName={editEventName}
                eventDate={editEventDate}
                eventTime={editEventTime}
                onNameChange={setEditEventName}
                onDateChange={setEditEventDate}
                onTimeChange={setEditEventTime}
                onSave={handleUpdateEvent}
                onCancel={handleCancelEdit}
                saveButtonText="Update"
              />
            ) : (
              <EventCard
                event={event}
                onEdit={() => handleEditEvent(index)}
                onDelete={() => handleDeleteEvent(index)}
              />
            )}
          </div>
        ))}
      </Space>
    </Card>
  )
}
