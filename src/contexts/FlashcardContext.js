// src/contexts/FlashcardContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './AuthContext'

const FlashcardContext = createContext({})

export const useFlashcards = () => {
  const context = useContext(FlashcardContext)
  if (!context) {
    throw new Error('useFlashcards must be used within FlashcardProvider')
  }
  return context
}

export const FlashcardProvider = ({ children }) => {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentSet, setCurrentSet] = useState(null)
  const { user } = useAuth()

  // Load user's flashcard sets
  const loadSets = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select(`
          *,
          flashcards (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSets(data || [])
    } catch (error) {
      console.error('Error loading sets:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create new flashcard set
  const createSet = async (setData) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .insert([{
          ...setData,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      
      // Add to local state
      setSets(prev => [{ ...data, flashcards: [] }, ...prev])
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Update flashcard set
  const updateSet = async (setId, updates) => {
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .update(updates)
        .eq('id', setId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      setSets(prev => prev.map(set => 
        set.id === setId ? { ...set, ...updates } : set
      ))
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Delete flashcard set
  const deleteSet = async (setId) => {
    try {
      const { error } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', setId)
        .eq('user_id', user.id)

      if (error) throw error
      
      // Remove from local state
      setSets(prev => prev.filter(set => set.id !== setId))
      if (currentSet?.id === setId) {
        setCurrentSet(null)
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Add flashcard to set
const addCard = async (setId, cardData) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{
        set_id: setId,
        front_text: cardData.front_text,
        back_text: cardData.back_text
      }])
      .select()
      .single()

    if (error) throw error

    setSets(prev => prev.map(set =>
      set.id === setId
        ? { ...set, flashcards: [...(set.flashcards || []), data] }
        : set
    ))

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}



  // Update flashcard
  const updateCard = async (cardId, updates) => {
    try {
        const { data, error } = await supabase
        .from('flashcards')
        .update({
            front_text: updates.front_text,
            back_text: updates.back_text
        })
        .eq('id', cardId)
        .select()
        .single()

        if (error) throw error

        setSets(prev => prev.map(set => ({
        ...set,
        flashcards: set.flashcards?.map(card =>
            card.id === cardId ? { ...card, ...data } : card
        )
        })))

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error.message }
    }
}


  // Delete flashcard
  const deleteCard = async (cardId) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', cardId)

      if (error) throw error
      
      // Remove from local state
      setSets(prev => prev.map(set => ({
        ...set,
        flashcards: set.flashcards?.filter(card => card.id !== cardId)
      })))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Load sets when user changes
  useEffect(() => {
    if (user) {
      loadSets()
    } else {
      setSets([])
      setCurrentSet(null)
    }
  }, [user])

  const value = {
    sets,
    loading,
    currentSet,
    setCurrentSet,
    createSet,
    updateSet,
    deleteSet,
    addCard,
    updateCard,
    deleteCard,
    loadSets
  }

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  )
}