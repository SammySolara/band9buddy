// src/components/flashcards/SetEditorModal.js
import { useState } from 'react'
import { X, Plus, Trash2, Edit2, Check, XCircle } from 'lucide-react'
import { useFlashcards } from '../../contexts/FlashcardContext'

const SetEditorModal = ({ set, onClose }) => {
  // 1. Get the LIVE sets array from the context
  const { sets, addCard, updateCard, deleteCard } = useFlashcards()
  
  // 2. Find the most up-to-date version of the current set
  const currentSet = sets.find(s => s.id === set.id)

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
    // Bug fix from previous suggestion
    setEditingValues({ front_text: card.front_text, back_text: card.back_text })
  }
  
  const cancelEditing = () => {
    setEditingId(null)
    setEditingValues({ front_text: '', back_text: '' })
  }

  const handleSave = async () => {
    if (!editingValues.front_text.trim() || !editingValues.back_text.trim()) return
    setLoading(true)
    setError('')
    const result = await updateCard(editingId, editingValues)
    if (result.success) {
      cancelEditing()
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleDelete = async (cardId) => {
    setLoading(true)
    setError('')
    const result = await deleteCard(cardId)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{set.title}</h2>
            <p className="text-sm text-gray-500">{set.description}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow p-6 overflow-y-auto">
          {/* Add card form */}
          <form onSubmit={handleAddCard} className="flex space-x-3 mb-6">
            <input
              type="text"
              value={newCard.front_text}
              onChange={(e) => setNewCard({ ...newCard, front_text: e.target.value })}
              placeholder="Mặt trước (câu hỏi)"
              className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              value={newCard.back_text}
              onChange={(e) => setNewCard({ ...newCard, back_text: e.target.value })}
              placeholder="Mặt sau (trả lời)"
              className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Card List */}
          <div className="space-y-3 pr-2 overflow-y-auto max-h-[calc(100vh-350px)]">
            {/* 3. Use currentSet to render the cards */}
            {currentSet && currentSet.flashcards && currentSet.flashcards.length > 0 ? (
              currentSet.flashcards.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((card) => (
                <div key={card.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  {editingId === card.id ? (
                    <>
                      <input
                        type="text"
                        value={editingValues.front_text}
                        onChange={(e) => setEditingValues({ ...editingValues, front_text: e.target.value })}
                        className="flex-1 border-gray-300 rounded-md text-sm mr-2"
                      />
                      <input
                        type="text"
                        value={editingValues.back_text}
                        onChange={(e) => setEditingValues({ ...editingValues, back_text: e.target.value })}
                        className="flex-1 border-gray-300 rounded-md text-sm"
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800 flex-1 font-medium">{card.front_text}</p>
                      <p className="text-sm text-gray-600 flex-1">{card.back_text}</p>
                    </>
                  )}
                  <div className="flex items-center space-x-2 ml-4">
                    {editingId === card.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
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