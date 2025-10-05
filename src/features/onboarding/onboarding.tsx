import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ONBOARDING_SCREENS } from '../../lib/enums'
import { ROUTES } from '../../routes/routeStatics'
import { CategoryForm } from './CategoryForm'
import { DetailedForm } from './DetailedForm'

interface UserProfileData {
  businessType?: string
  businessInfo?: {
    companyName?: string
    description?: string
    website?: string
    phone?: string
    address?: string
    instagram?: string
    youtube?: string
  }
}

export function Onboarding() {
  const [userProfileData, setUserProfileData] = useState<UserProfileData>({})
  const [currentView, setCurrentView] = useState<keyof typeof ONBOARDING_SCREENS>(ONBOARDING_SCREENS.BUSINESS_TYPE)
  const navigate = useNavigate()


  const handleNext = (data: Partial<UserProfileData>) => {
    setUserProfileData(prev => ({ ...prev, ...data }))
    setCurrentView(ONBOARDING_SCREENS.BUSINESS_INFO)
  }

  const handleBack = () => {
    setCurrentView(ONBOARDING_SCREENS.BUSINESS_TYPE)
  }

  const handleSave = (data: Partial<UserProfileData>) => {
    console.log('handleSave called with data:', data)
    setUserProfileData(prev => ({ ...prev, ...data }))
    // Here you would typically save to backend
    console.log('Final user profile data:', { ...userProfileData, ...data })
    console.log('Navigating to leads route:', ROUTES.LEADS)
    
    // Use setTimeout to ensure state update completes before navigation
    setTimeout(() => {
      navigate(ROUTES.LEADS)
    }, 100)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case ONBOARDING_SCREENS.BUSINESS_TYPE:
        return (
          <CategoryForm
            onNext={handleNext}
            initialData={userProfileData}
          />
        )
      case ONBOARDING_SCREENS.BUSINESS_INFO:
        return (
          <DetailedForm
            onBack={handleBack}
            onSave={handleSave}
            initialData={userProfileData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {renderCurrentView()}
    </div>
  )
}

export default Onboarding
