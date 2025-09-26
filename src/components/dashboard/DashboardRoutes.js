// src/components/dashboard/DashboardRoutes.js
import { Routes, Route } from 'react-router-dom'
import { FlashcardProvider } from '../../contexts/FlashcardContext'
import Dashboard from './Dashboard'
import FlashcardSets from '../flashcards/FlashcardSets'
import SetEditorModal from '../flashcards/SetEditorModal'
import StudyMode from '../flashcards/StudyMode'

// Simple Coming Soon component
const ComingSoon = ({ feature }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* We'll reuse the same header from Dashboard */}
      <Dashboard />
    </div>
  )
}

const DashboardRoutes = () => {
  return (
    <FlashcardProvider>
      <Routes>
        {/* Dashboard home */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Flashcard routes */}
        <Route path="/flashcards" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <FlashcardSets />
            </Dashboard>
          </div>
        } />
        
        <Route path="/flashcards/edit/:setId" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <SetEditorModal />
            </Dashboard>
          </div>
        } />
        
        <Route path="/flashcards/study/:setId" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <StudyMode />
            </Dashboard>
          </div>
        } />
        
        {/* Coming soon routes */}
        <Route path="/notebooks" element={<ComingSoon feature="Notebooks" />} />
        <Route path="/games" element={<ComingSoon feature="Games & Quizzes" />} />
        <Route path="/ielts" element={<ComingSoon feature="IELTS Practice" />} />
      </Routes>
    </FlashcardProvider>
  )
}

export default DashboardRoutes