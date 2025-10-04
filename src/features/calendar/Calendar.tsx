import { Navbar } from '../../components/Navbar'

export function Calendar() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calendar
          </h1>
          <p className="text-xl text-gray-600">
            Page is in progress
          </p>
        </div>
      </div>
    </div>
  )
}

export default Calendar
