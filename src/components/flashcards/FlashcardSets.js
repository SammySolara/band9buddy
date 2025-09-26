import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Play, Edit3, Trash2, BookOpen } from 'lucide-react'
import { useFlashcards } from '../../contexts/FlashcardContext'

const FlashcardSets = () => {
  const navigate = useNavigate()
  const { sets, deleteSet } = useFlashcards()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [setToDelete, setSetToDelete] = useState(null)

  const handleCreateNew = () => {
    navigate('/dashboard/flashcards/edit/new')
  }

  const handleEditSet = (set) => {
    navigate(`/dashboard/flashcards/edit/${set.id}`)
  }

  const handleStudySet = (set) => {
    navigate(`/dashboard/flashcards/study/${set.id}`)
  }

  const handleDeleteClick = (set) => {
    setSetToDelete(set)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (setToDelete) {
      deleteSet(setToDelete.id)
      setShowDeleteModal(false)
      setSetToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bộ thẻ của bạn</h2>
          <p className="text-gray-600 mt-1">Quản lý và học tập với các bộ flashcard</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Tạo bộ mới</span>
        </button>
      </div>

      {/* Sets Grid */}
      {sets.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bộ thẻ nào</h3>
          <p className="text-gray-600 mb-6">Tạo bộ flashcard đầu tiên để bắt đầu học</p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Tạo bộ đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <div key={set.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{set.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{set.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{set.cards?.length || 0} thẻ</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStudySet(set)}
                    disabled={!set.cards?.length}
                    className="flex-1 flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Học</span>
                  </button>
                  
                  <button
                    onClick={() => handleEditSet(set)}
                    className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteClick(set)}
                    className="flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xóa bộ thẻ</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa bộ thẻ "{setToDelete?.title}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashcardSets