import { useState } from 'react'
import { Button, Card } from 'antd'
import { Navbar } from '../../components/Navbar'

interface UserProfileData {
  businessType?: string
  businessInfo?: {
    companyName?: string
    description?: string
    website?: string
    phone?: string
    address?: string
  }
}

interface CategoryFormProps {
  onNext: (data: Partial<UserProfileData>) => void
  initialData?: UserProfileData
}

const businessCategories = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'makeup-artist', label: 'Make Up Artist' },
  { value: 'host-mc', label: 'Host/MC' },
  { value: 'artist-dj', label: 'Artist/DJ' },
  { value: 'others', label: 'Others' }
]

function CategoryForm({ onNext, initialData }: CategoryFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.businessType || ''
  )

  const handleNext = () => {
    if (selectedCategory) {
      onNext({ businessType: selectedCategory })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center py-12 px-4">
        {/* Progress Indicator */}
        <div className="text-center mb-6">
          <div className="text-gray-600 text-sm mb-2">Step 1 of 2</div>
          <div className="w-32 h-1 bg-gray-200 rounded-full">
            <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Who Are You?</h2>
        </div>

        {/* Category Selection */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {businessCategories.map((category) => (
              <Card
                key={category.value}
                hoverable
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'shadow-lg transform scale-105'
                    : 'hover:shadow-md'
                }`}
                style={{
                  border: selectedCategory === category.value 
                    ? '2px solid #3b82f6' 
                    : '1px solid #e5e7eb',
                  borderColor: selectedCategory === category.value 
                    ? '#3b82f6' 
                    : '#e5e7eb',
                  minWidth: '200px',
                  flex: '1 1 200px',
                  maxWidth: '300px'
                }}
                onClick={() => setSelectedCategory(category.value)}
              >
                <div className="text-center py-4">
                  <div className={`text-lg font-medium ${
                    selectedCategory === category.value
                      ? 'text-gray-900'
                      : 'text-gray-700'
                  }`}>
                    {category.label}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end w-full max-w-4xl">
          <Button
            type="primary"
            size="large"
            onClick={handleNext}
            disabled={!selectedCategory}
            className="px-8 py-2 h-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export { CategoryForm }
