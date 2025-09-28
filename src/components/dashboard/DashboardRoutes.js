// src/components/dashboard/DashboardRoutes.js - Updated with IELTS routes
import { Routes, Route } from 'react-router-dom'
import { FlashcardProvider } from '../../contexts/FlashcardContext'
import Dashboard from './Dashboard'
import FlashcardSets from '../flashcards/FlashcardSets'
import SetEditorModal from '../flashcards/SetEditorModal'
import StudyMode from '../flashcards/StudyMode'
import IELTSPractice from '../ielts/IELTSPractice'
import ReadingTests from '../ielts/ReadingTests'
import ListeningTests from '../ielts/ListeningTests'
import WritingTests from '../ielts/WritingTests'
import DictionarySearch from '../dictionary/DictionarySearch'

// Simple Coming Soon component
const ComingSoon = ({ feature }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{feature}</h2>
          <p className="text-gray-600">Tính năng sắp ra mắt!</p>
        </div>
      </Dashboard>
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
        
        {/* Dictionary route */}
        <Route path="/dictionary" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <DictionarySearch />
            </Dashboard>
          </div>
        } />
        
        {/* IELTS Practice routes */}
        <Route path="/ielts" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <IELTSPractice />
            </Dashboard>
          </div>
        } />
        
        {/* IELTS Practice sections - now using actual components */}
        <Route path="/ielts/reading" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <ReadingTests />
            </Dashboard>
          </div>
        } />
        
        <Route path="/ielts/listening" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <ListeningTests />
            </Dashboard>
          </div>
        } />
        
        <Route path="/ielts/writing" element={
          <div className="min-h-screen bg-gray-50">
            <Dashboard>
              <WritingTests />
            </Dashboard>
          </div>
        } />
        
        {/* Coming soon routes */}
        <Route path="/games" element={<ComingSoon feature="Games & Quizzes" />} />
      </Routes>
    </FlashcardProvider>
  )
}

export default DashboardRoutes