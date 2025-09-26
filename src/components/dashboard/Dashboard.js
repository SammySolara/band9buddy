// src/components/dashboard/Dashboard.js
import { useState } from 'react'
import { LogOut, BookOpen, GamepadIcon, GraduationCap, Copy, User, Settings, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { FlashcardProvider } from '../../contexts/FlashcardContext'
import FlashcardSets from '../flashcards/FlashcardSets'
import SetEditorModal from '../flashcards/SetEditorModal'
import StudyMode from '../flashcards/StudyMode'


const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [currentView, setCurrentView] = useState('home') // home, flashcards, notebooks, games, ielts
  const [selectedSet, setSelectedSet] = useState(null)
  const [studySet, setStudySet] = useState(null)

  const handleSignOut = async () => {
    await signOut()
  }

  const features = [
    {
      id: 'flashcards',
      icon: Copy,
      title: 'Flashcards',
      description: 'Tạo và ôn tập từ vựng',
      color: 'bg-blue-500',
      comingSoon: false
    },
    {
      id: 'notebooks',
      icon: BookOpen,
      title: 'Notebooks',
      description: 'Ghi chép và tổ chức từ',
      color: 'bg-green-500',
      comingSoon: true
    },
    {
      id: 'games',
      icon: GamepadIcon,
      title: 'Games & Quizzes',
      description: 'Học qua trò chơi vui nhộn',
      color: 'bg-purple-500',
      comingSoon: true
    },
    {
      id: 'ielts',
      icon: GraduationCap,
      title: 'IELTS Practice',
      description: 'Luyện thi IELTS hiệu quả',
      color: 'bg-red-500',
      comingSoon: true
    }
  ]

  const handleFeatureClick = (featureId) => {
    if (featureId === 'flashcards') {
      setCurrentView('flashcards')
    } else {
      // For future features
      alert('Tính năng sắp ra mắt!')
    }
  }

  const handleSelectSet = (set) => {
    setSelectedSet(set)
    setCurrentView('set-editor')
  }

  const handleStudySet = (set) => {
    setStudySet(set)
    setCurrentView('study-mode')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setSelectedSet(null)
    setStudySet(null)
  }

  const handleBackToFlashcards = () => {
    setCurrentView('flashcards')
    setSelectedSet(null)
    setStudySet(null)
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'flashcards':
        return 'Flashcards'
      case 'set-editor':
        return selectedSet ? `Chỉnh sửa: ${selectedSet.title}` : 'Chỉnh sửa bộ thẻ'
      case 'study-mode':
        return studySet ? `Học tập: ${studySet.title}` : 'Học tập'
      case 'notebooks':
        return 'Notebooks'
      case 'games':
        return 'Games & Quizzes'
      case 'ielts':
        return 'IELTS Practice'
      default:
        return 'Dashboard'
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'flashcards':
        return (
          <FlashcardSets 
            onSelectSet={handleSelectSet}
            onStudySet={handleStudySet}
          />
        )
      case 'set-editor':
        return (
          <SetEditorModal 
            set={selectedSet}
            onClose={handleBackToFlashcards}
          />
        )
        case 'study-mode': // <-- 2. Update this case
        return (
          <StudyMode 
            set={studySet}
          />
        )
      case 'home':
      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Xin chào, {user?.user_metadata?.name || 'bạn'}! 👋
              </h2>
              <p className="text-gray-600">
                Sẵn sàng học tiếng Anh hôm nay? Hãy chọn một hoạt động để bắt đầu.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Copy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Flashcards</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Từ vựng đã học</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GamepadIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Điểm quiz</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">IELTS Practice</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="relative group">
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 h-full">
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg text-white mb-4`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {feature.description}
                      </p>
                      
                      {feature.comingSoon ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Sắp ra mắt
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleFeatureClick(feature.id)}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Bắt đầu
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có hoạt động nào. Hãy bắt đầu học ngay!</p>
                </div>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <FlashcardProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                {/* Back Button */}
                {currentView !== 'home' && (
                  <button
                    onClick={currentView === 'set-editor' || currentView === 'study-mode' ? handleBackToFlashcards : handleBackToHome}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Quay lại</span>
                  </button>
                )}
                
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Band 9 Buddy
                </h1>
                
                {currentView !== 'home' && (
                  <span className="text-gray-400">•</span>
                )}
                
                {currentView !== 'home' && (
                  <span className="text-lg font-medium text-gray-700">
                    {getPageTitle()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">
                    {user?.user_metadata?.name || user?.email || 'User'}
                  </span>
                </div>
                
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </FlashcardProvider>
  )
}

export default Dashboard