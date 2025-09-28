// src/components/ielts/IELTSPractice.js
import { useNavigate } from 'react-router-dom'
import { BookOpen, Headphones, PenTool } from 'lucide-react'

const IELTSPractice = () => {
  const navigate = useNavigate()

  const practiceTypes = [
    {
      id: 'reading',
      icon: BookOpen,
      title: 'Reading Test',
      description: 'Luyện tập kỹ năng đọc hiểu IELTS',
      color: 'bg-blue-500',
      path: '/dashboard/ielts/reading'
    },
    {
      id: 'listening', 
      icon: Headphones,
      title: 'Listening Test',
      description: 'Luyện tập kỹ năng nghe IELTS',
      color: 'bg-green-500',
      path: '/dashboard/ielts/listening'
    },
    {
      id: 'writing',
      icon: PenTool,
      title: 'Writing Test',
      description: 'Luyện tập kỹ năng viết IELTS',
      color: 'bg-purple-500',
      path: '/dashboard/ielts/writing'
    }
  ]

  const handlePracticeClick = (practice) => {
    navigate(practice.path)
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          IELTS Practice 📚
        </h2>
        <p className="text-gray-600">
          Chọn phần thi bạn muốn luyện tập. Mỗi phần được thiết kế theo chuẩn IELTS thực tế.
        </p>
      </div>

      {/* Practice Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {practiceTypes.map((practice) => {
          const IconComponent = practice.icon
          return (
            <div key={practice.id} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${practice.color} rounded-lg text-white mb-6`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {practice.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {practice.description}
                </p>
                
                <button 
                  onClick={() => handlePracticeClick(practice)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Bắt đầu luyện tập
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Thống kê luyện tập</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reading Tests</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Headphones className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Listening Tests</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PenTool className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Writing Tests</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IELTSPractice