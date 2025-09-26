// src/components/flashcards/FlashcardSets.js
import { useState } from 'react'
import { Plus, BookOpen, Edit2, Trash2, Play } from 'lucide-react'
import { useFlashcards } from '../../contexts/FlashcardContext'
import CreateSetModal from './CreateSetModal'

const FlashcardSets = ({ onSelectSet, onStudySet }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { sets, loading, deleteSet } = useFlashcards()

  const handleDeleteSet = async (setId) => {
    if (window.confirm('Bạn có chắc muốn xóa bộ thẻ này?')) {
      const result = await deleteSet(setId)
      if (!result.success) {
        alert('Lỗi: ' + result.error)
      }
    }
  }

  const getCardCount = (set) => set.flashcards?.length || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flashcard Sets</h2>
          <p className="text-gray-600">Tạo và quản lý các bộ thẻ học tập</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Tạo bộ thẻ mới</span>
        </button>
      </div>

      {/* Sets Grid */}
      {sets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bộ thẻ nào
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo bộ thẻ đầu tiên để bắt đầu học tập
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Tạo ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <div
              key={set.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4"
              style={{ borderLeftColor: set.color }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {set.title}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onSelectSet(set)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSet(set.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {set.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {set.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {getCardCount(set)} thẻ
                  </span>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onSelectSet(set)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                    {getCardCount(set) > 0 && (
                      <button
                        onClick={() => onStudySet(set)}
                        className="flex items-center space-x-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded transition-colors"
                      >
                        <Play className="h-3 w-3" />
                        <span>Học</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Set Modal */}
      {showCreateModal && (
        <CreateSetModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default FlashcardSets