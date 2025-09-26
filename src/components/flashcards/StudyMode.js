import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { useFlashcards } from '../../contexts/FlashcardContext'

const StudyMode = () => {
  const { setId } = useParams()
  const navigate = useNavigate()
  const { sets } = useFlashcards()
  
  const set = sets.find(s => s.id === setId)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyResults, setStudyResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [sessionKey, setSessionKey] = useState(Date.now()) // Force re-renders

  useEffect(() => {
    if (!set) {
      navigate('/dashboard/flashcards')
    }
  }, [set, navigate])

  // Reset all state when set changes
  useEffect(() => {
    if (set && set.cards?.length) {
      setIsComplete(false)
      setCurrentCardIndex(0)
      setIsFlipped(false)
      setStudyResults([])
      setSessionKey(Date.now()) // Reset session key
    }
  }, [set])

  if (!set || !set.cards?.length) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bộ thẻ</h2>
          <p className="text-gray-600">Bộ thẻ không tồn tại hoặc chưa có thẻ nào.</p>
        </div>
      </div>
    )
  }

  const currentCard = set.cards[currentCardIndex]
  const totalCards = set.cards.length
  
  // Calculate progress - FIXED: More reliable calculation
  const calculateProgress = () => {
    if (isComplete) return 100
    if (totalCards === 0) return 0
    const progress = ((currentCardIndex + 1) / totalCards) * 100
    return Math.min(100, Math.max(0, progress))
  }
  
  const progress = calculateProgress()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = (difficulty = null) => {
    if (difficulty) {
      const newResult = {
        cardIndex: currentCardIndex,
        difficulty,
        timestamp: Date.now()
      }
      setStudyResults(prev => [...prev, newResult])
    }

    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setIsFlipped(false)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
      setIsFlipped(false)
      // Remove the last result if going back
      if (studyResults.length > 0) {
        setStudyResults(prev => prev.slice(0, -1))
      }
    }
  }

  const handleRestart = () => {
    setIsComplete(false)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setStudyResults([])
    setSessionKey(Date.now()) // Force complete re-render
  }

  const handleFinish = () => {
    navigate('/dashboard/flashcards')
  }

  if (isComplete) {
    const correctCount = studyResults.filter(r => r.difficulty === 'easy').length
    const hardCount = studyResults.filter(r => r.difficulty === 'hard').length

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
            <p className="text-gray-600">Bạn đã học xong bộ thẻ "{set.title}"</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{totalCards}</div>
              <div className="text-sm text-gray-600">Tổng thẻ</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Dễ</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{hardCount}</div>
              <div className="text-sm text-gray-600">Khó</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Học lại</span>
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto" key={sessionKey}>
      {/* Progress Bar - FIXED: Added key to force re-render */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Thẻ {currentCardIndex + 1} / {totalCards}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            key={`progress-${currentCardIndex}-${sessionKey}`}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div 
          className="relative bg-white rounded-xl shadow-lg p-8 min-h-80 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={handleFlip}
        >
          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {isFlipped ? 'Mặt sau' : 'Mặt trước'}
            </span>
          </div>

          <div className="flex items-center justify-center h-full min-h-64">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900 mb-4">
                {isFlipped ? (currentCard.back || currentCard.back_text) : (currentCard.front || currentCard.front_text)}
              </div>
              
              {!isFlipped && (
                <p className="text-gray-500 text-sm">
                  Nhấn để xem đáp án
                </p>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleFlip()
              }}
              className="text-blue-500 hover:text-blue-700 p-2"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Trước</span>
        </button>

        {isFlipped && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleNext('hard')}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5" />
              <span>Khó</span>
            </button>
            <button
              onClick={() => handleNext('easy')}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Dễ</span>
            </button>
          </div>
        )}

        {!isFlipped && (
          <button
            onClick={() => handleNext()}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span>Tiếp</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Nhấn vào thẻ để lật. Đánh giá độ khó sau khi xem đáp án.</p>
      </div>
    </div>
  )
}

export default StudyMode