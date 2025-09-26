// src/components/dashboard/Dashboard.js - Updated as Layout
import { LogOut, BookOpen, GamepadIcon, GraduationCap, Copy, User, Settings, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useFlashcards } from '../../contexts/FlashcardContext' // Import the flashcards context
import { useNavigate, useLocation } from 'react-router-dom'

const Dashboard = ({ children }) => {
  const { user, signOut } = useAuth()
  const { sets } = useFlashcards() // Get sets from flashcard context
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  // Calculate dynamic stats
  const flashcardSetsCount = sets?.length || 0
  const totalWordsLearned = sets?.reduce((total, set) => total + (set.cards?.length || 0), 0) || 0

  const features = [
    {
      id: 'flashcards',
      icon: Copy,
      title: 'Flashcards',
      description: 'Tạo và ôn tập từ vựng',
      color: 'bg-blue-500',
      comingSoon: false,
      path: '/dashboard/flashcards'
    },
    {
      id: 'notebooks',
      icon: BookOpen,
      title: 'Notebooks',
      description: 'Ghi chép và tổ chức từ',
      color: 'bg-green-500',
      comingSoon: true,
      path: '/dashboard/notebooks'
    },
    {
      id: 'games',
      icon: GamepadIcon,
      title: 'Games & Quizzes',
      description: 'Học qua trò chơi vui nhộn',
      color: 'bg-purple-500',
      comingSoon: true,
      path: '/dashboard/games'
    },
    {
      id: 'ielts',
      icon: GraduationCap,
      title: 'IELTS Practice',
      description: 'Luyện thi IELTS hiệu quả',
      color: 'bg-red-500',
      comingSoon: true,
      path: '/dashboard/ielts'
    }
  ]

  const handleFeatureClick = (feature) => {
    if (feature.comingSoon) {
      alert('Tính năng sắp ra mắt!')
      return
    }
    navigate(feature.path)
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path.startsWith('/dashboard/flashcards/study/')) return 'Học tập'
    if (path.startsWith('/dashboard/flashcards/edit/')) return 'Chỉnh sửa bộ thẻ'
    if (path === '/dashboard/flashcards') return 'Flashcards'
    if (path === '/dashboard/notebooks') return 'Notebooks'
    if (path === '/dashboard/games') return 'Games & Quizzes'
    if (path === '/dashboard/ielts') return 'IELTS Practice'
    return 'Dashboard'
  }

  const getBackPath = () => {
    const path = location.pathname
    if (path.startsWith('/dashboard/flashcards/study/') || 
        path.startsWith('/dashboard/flashcards/edit/')) {
      return '/dashboard/flashcards'
    }
    return '/dashboard'
  }

  const isHomePage = location.pathname === '/dashboard'

  const renderHomeContent = () => (
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

      {/* Stats Cards - UPDATED: Dynamic counts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Copy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bộ Flashcards</p>
              <p className="text-2xl font-semibold text-gray-900">{flashcardSetsCount}</p>
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
                    onClick={() => handleFeatureClick(feature)}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              {!isHomePage && (
                <button
                  onClick={() => navigate(getBackPath())}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Quay lại</span>
                </button>
              )}
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Band 9 Buddy
              </h1>
              
              {!isHomePage && (
                <span className="text-gray-400">•</span>
              )}
              
              {!isHomePage && (
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
        {children || renderHomeContent()}
      </main>
    </div>
  )
}

export default Dashboard