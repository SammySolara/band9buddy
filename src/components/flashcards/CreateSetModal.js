// src/components/flashcards/SetEditorModal.js
import { useState } from 'react'
import { X, Plus, Trash2, Edit2, Check, XCircle } from 'lucide-react'
import { useFlashcards } from '../../contexts/FlashcardContext'

const SetEditorModal = ({ set, onClose }) => {
  const { addCard, updateCard, deleteCard } = useFlashcards()
  const [newCard, setNewCard] = useState({ front_text: '', back_text: '' })
  const [editingId, setEditingId] = useState(null)
  const [editingValues, setEditingValues] = useState({ front_text: '', back_text: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddCard = async (e) => {
    e.preventDefault()
    if (!newCard.front_text.trim() || !newCard.back_text.trim()) return
    setLoading(true)
    setError('')
    const result = await addCard(set.id, newCard)
    if (result.success) {
      setNewCard({ front_text: '', back_text: '' })
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const startEditing = (card) => {
    setEditingId(card.id)
    setEditingValues({ front_text: card.front_text, back_text: card.back_text })
  }

  const handleUpdate = async (cardId) => {
    setLoading(true)
    const result = await updateCard(cardId, editingValues)
    if (result.success) {
      setEditingId(null)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleDelete = async (cardId) => {
    if (window.confirm('Bạn có chắc muốn xóa thẻ này?')) {
      await deleteCard(cardId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Chỉnh sửa bộ thẻ: {set.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Add New Card */}
          <form onSubmit={handleAddCard} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Mặt trước"
                value={newCard.front_text}
                onChange={(e) => setNewCard((prev) => ({ ...prev, front_text: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Mặt sau"
                value={newCard.back_text}
                onChange={(e) => setNewCard((prev) => ({ ...prev, back_text: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{loading ? 'Đang thêm...' : 'Thêm thẻ mới'}</span>
            </button>
          </form>

          {/* Existing Cards */}
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {set.flashcards?.length > 0 ? (
              set.flashcards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
                >
                  {editingId === card.id ? (
                    <div className="flex-1 grid grid-cols-2 gap-2 mr-3">
                      <input
                        type="text"
                        value={editingValues.front_text}
                        onChange={(e) => setEditingValues((prev) => ({ ...prev, front_text: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={editingValues.back_text}
                        onChange={(e) => setEditingValues((prev) => ({ ...prev, back_text: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 grid grid-cols-2 gap-2 mr-3">
                      <span className="truncate">{card.front_text}</span>
                      <span className="truncate text-gray-600">{card.back_text}</span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {editingId === card.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(card.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(card)}
                          className="p-1 text-gray-400 hover:text-indigo-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">Chưa có thẻ nào trong bộ này.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetEditorModal
