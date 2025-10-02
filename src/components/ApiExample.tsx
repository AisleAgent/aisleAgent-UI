import { useState } from 'react'
import { useApi, useApiLazy } from '../hooks/useApi'
import { userApi } from '../services/api'

export default function ApiExample() {
  const [userId, setUserId] = useState('')

  // Example 1: Automatic API call on component mount
  const { data: profile, loading: profileLoading, error: profileError, refetch } = useApi(
    () => userApi.getProfile(),
    { immediate: false } // Set to true to call immediately on mount
  )

  // Example 2: Manual API call
  const { 
    data: preferences, 
    loading: preferencesLoading, 
    error: preferencesError, 
    execute: loadPreferences 
  } = useApiLazy(() => userApi.getPreferences())

  // Example 3: API call with form data
  const handleUpdateProfile = async () => {
    try {
      const response = await userApi.updateProfile({
        name: 'Updated Name',
        email: 'updated@example.com'
      })
      console.log('Profile updated:', response.data)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Axios API Examples</h2>
      
      {/* Example 1: Profile Data */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">User Profile</h3>
        <button 
          onClick={refetch}
          disabled={profileLoading}
          className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {profileLoading ? 'Loading...' : 'Load Profile'}
        </button>
        
        {profileError && (
          <div className="text-red-600 mb-2">Error: {profileError}</div>
        )}
        
        {profile && (
          <div className="bg-gray-100 p-3 rounded">
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Example 2: Preferences */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">User Preferences</h3>
        <button 
          onClick={loadPreferences}
          disabled={preferencesLoading}
          className="mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {preferencesLoading ? 'Loading...' : 'Load Preferences'}
        </button>
        
        {preferencesError && (
          <div className="text-red-600 mb-2">Error: {preferencesError}</div>
        )}
        
        {preferences && (
          <div className="bg-gray-100 p-3 rounded">
            <pre>{JSON.stringify(preferences, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Example 3: Update Profile */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Update Profile</h3>
        <button 
          onClick={handleUpdateProfile}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Update Profile
        </button>
      </div>

      {/* API Configuration Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Configuration</h3>
        <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}</p>
        <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
      </div>
    </div>
  )
}

