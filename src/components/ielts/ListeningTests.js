// src/components/ielts/ListeningTests.js
import { Headphones, Clock, Award, Play, Volume2 } from 'lucide-react'

const ListeningTests = () => {
  // Mock test data - you'll replace this with your actual tests
  const listeningTests = [
    {
      id: 'listening-1',
      title: 'IELTS Listening Test 1',
      description: 'University Campus Tour & Academic Discussion',
      difficulty: 'Intermediate',
      duration: 30, // minutes
      sections: 4,
      questions: 40,
      audioLength: '25 min',
      topics: ['Education', 'Campus Life', 'Academic'],
      bestScore: null,
      attempts: 0
    },
    {
      id: 'listening-2',
      title: 'IELTS Listening Test 2', 
      description: 'Job Interview & Business Meeting',
      difficulty: 'Advanced',
      duration: 30,
      sections: 4,
      questions: 40,
      audioLength: '28 min',
      topics: ['Business', 'Employment', 'Professional'],
      bestScore: 8.0,
      attempts: 1
    },
    {
      id: 'listening-3',
      title: 'IELTS Listening Test 3',
      description: 'Travel Information & Hotel Booking',
      difficulty: 'Beginner',
      duration: 30,
      sections: 4,
      questions: 40,
      audioLength: '24 min',
      topics: ['Travel', 'Tourism', 'Services'],
      bestScore: 6.5,
      attempts: 3
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStartTest = (testId) => {
    // Navigate to test interface - you'll implement this later
    console.log(`Starting listening test: ${testId}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          IELTS Listening Tests 🎧
        </h2>
        <p className="text-gray-600">
          Luyện tập kỹ năng nghe với các bài test theo chuẩn IELTS. Mỗi bài test gồm 4 phần và 40 câu hỏi trong 30 phút.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Headphones className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Tests</p>
              <p className="text-2xl font-semibold text-gray-900">{listeningTests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Best Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.max(...listeningTests.filter(t => t.bestScore).map(t => t.bestScore)) || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tests Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {listeningTests.filter(t => t.attempts > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-6">
        {listeningTests.map((test) => (
          <div key={test.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                    {test.difficulty}
                  </span>
                  {test.bestScore && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Best: {test.bestScore}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{test.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{test.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4" />
                    <span>{test.audioLength} audio</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones className="h-4 w-4" />
                    <span>{test.sections} phần</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{test.questions} câu hỏi</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {test.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
                
                {test.attempts > 0 && (
                  <div className="mt-3 text-sm text-gray-500">
                    Đã làm {test.attempts} lần
                  </div>
                )}
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-6">
                <button
                  onClick={() => handleStartTest(test.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {test.attempts > 0 ? 'Làm lại' : 'Bắt đầu'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListeningTests