import type { VerifyResponse } from '../lib/auth'

// Mock user data for development
const mockUser = {
  id: 1,
  email: "john.doe@example.com",
  fullName: "John Doe",
  userType: "PHOTOGRAPHER",
  profilePictureUrl: "https://lh3.googleusercontent.com/a/ACg8ocK...",
  isActive: true
}

// Mock verify function that simulates backend response
export async function mockVerifyGoogleToken(_idToken: string): Promise<VerifyResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate successful response
  return {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.for.development",
    tokenType: "bearer",
    expiresIn: 2592000, // 30 days
    user: mockUser
  }
}

// Helper to check if we should use mock
export function shouldUseMock(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_AUTH === 'true'
}
