import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Plus, Trash2, Save } from 'lucide-react'
import { useFlashcards } from '../../contexts/FlashcardContext'

const SetEditorModal = () => {
  const { setId } = useParams()
  const navigate = useNavigate()
  const { sets, createSet, updateSet } = useFlashcards()
  
  const isNewSet = setId === 'new'
  const existingSet = isNewSet ? null : sets.find(set => set.id === setId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState([{ front: '', back: '' }])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (existingSet) {
      setTitle(existingSet.title)
      setDescription(existingSet.description)
      setCards(existingSet.cards?.length ? existingSet.cards : [{ front: '', back: '' }])
    }
  }, [existingSet])

  const handleClose = () => {
    navigate('/dashboard/flashcards')
  }

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }])
  }

  const updateCard = (index, field, value) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }

  const deleteCard = (index) => {
    if (cards.length > 1) {
      const newCards = cards.filter((_, i) => i !== index)
      setCards(newCards)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên bộ thẻ')
      return
    }

    const validCards = cards.filter(card => card.front.trim() && card.back.trim())
    if (validCards.length === 0) {
      alert('Vui lòng thêm ít nhất một thẻ có nội dung')
      return
    }

    setIsSaving(true)
    try {
      const setData = {
        title: title.trim(),
        description: description.trim(),
        cards: validCards
      }

      if (isNewSet) {
        await createSet(setData)
      } else {
        await updateSet(setId, setData)
      }

      navigate('/dashboard/flashcards')
    } catch (error) {
      console.error('Error saving set:', error)
      alert('Có lỗi xảy ra khi lưu bộ thẻ')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isNewSet ? 'Tạo bộ thẻ mới' : 'Chỉnh sửa bộ thẻ'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isNewSet ? 'Tạo bộ flashcard mới để học từ vựng' : 'Chỉnh sửa nội dung bộ thẻ'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>{isSaving ? 'Đang lưu...' : 'Lưu'}</span>
        </button>
      </div>

      {/* Set Info Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên bộ thẻ *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên bộ thẻ..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về bộ thẻ này..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Thẻ học ({cards.length})</h3>
          <button
            onClick={addCard}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm thẻ</span>
          </button>
        </div>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Thẻ {index + 1}</span>
                {cards.length > 1 && (
                  <button
                    onClick={() => deleteCard(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mặt trước
                  </label>
                  <textarea
                    value={card.front}
                    onChange={(e) => updateCard(index, 'front', e.target.value)}
                    placeholder="Từ vựng, câu hỏi..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mặt sau
                  </label>
                  <textarea
                    value={card.back}
                    onChange={(e) => updateCard(index, 'back', e.target.value)}
                    placeholder="Nghĩa, câu trả lời..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SetEditorModal