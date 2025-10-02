import { apiClient } from '../lib/axios'

// User-related API calls
export const userApi = {
  // Get current user profile
  getProfile: () => apiClient.get('/user/profile'),
  
  // Update user profile
  updateProfile: (data: { name?: string; email?: string }) => 
    apiClient.put('/user/profile', data),
  
  // Get user preferences
  getPreferences: () => apiClient.get('/user/preferences'),
  
  // Update user preferences
  updatePreferences: (preferences: Record<string, any>) => 
    apiClient.put('/user/preferences', preferences),
}

// Authentication API calls
export const authApi = {
  // Verify Google ID token and get user details
  verifyGoogleToken: (idToken: string) => 
    apiClient.post('/api/v1/auth/google/verify', { idToken }),
  
  // Exchange Firebase token for app session (legacy)
  exchangeToken: (firebaseToken: string) => 
    apiClient.post('/auth/exchange', { token: firebaseToken }),
  
  // Refresh session
  refreshSession: () => apiClient.post('/auth/refresh'),
  
  // Logout
  logout: () => apiClient.post('/auth/logout'),
}

// Calendar-related API calls (for backend integration)
export const calendarApi = {
  // Get user's calendar events
  getEvents: (params?: { start?: string; end?: string; limit?: number }) => 
    apiClient.get('/calendar/events', { params }),
  
  // Create new calendar event
  createEvent: (eventData: {
    title: string
    description?: string
    startTime: string
    endTime: string
    attendees?: string[]
  }) => apiClient.post('/calendar/events', eventData),
  
  // Update calendar event
  updateEvent: (eventId: string, eventData: Partial<{
    title: string
    description: string
    startTime: string
    endTime: string
  }>) => apiClient.put(`/calendar/events/${eventId}`, eventData),
  
  // Delete calendar event
  deleteEvent: (eventId: string) => apiClient.delete(`/calendar/events/${eventId}`),
}

// Example: Generic API service class
export class ApiService<T> {
  constructor(private endpoint: string) {}

  getAll = (params?: Record<string, any>) => 
    apiClient.get<T[]>(this.endpoint, { params })

  getById = (id: string | number) => 
    apiClient.get<T>(`${this.endpoint}/${id}`)

  create = (data: Partial<T>) => 
    apiClient.post<T>(this.endpoint, data)

  update = (id: string | number, data: Partial<T>) => 
    apiClient.put<T>(`${this.endpoint}/${id}`, data)

  delete = (id: string | number) => 
    apiClient.delete(`${this.endpoint}/${id}`)
}

// Example usage of generic service
// export const postsService = new ApiService<Post>('/posts')
// export const usersService = new ApiService<User>('/users')

