// src/components/dashboard/DashboardRoutes.js
import { Routes, Route } from "react-router-dom";
import { FlashcardProvider } from "../../contexts/FlashcardContext";
import Dashboard from "./Dashboard";
import FlashcardSets from "../flashcards/FlashcardSets";
import SetEditorModal from "../flashcards/SetEditorModal";
import StudyMode from "../flashcards/StudyMode";
import IELTSPractice from "../ielts/IELTSPractice";
import ReadingTests from "../ielts/ReadingTests";
import ListeningTests from "../ielts/ListeningTests";
import WritingTests from "../ielts/WritingTests";
import SpeakingTests from "../ielts/SpeakingTests";
import DictionarySearch from "../dictionary/DictionarySearch";
import LiveTranslator from "../translator/LiveTranslator";
import GamesQuizzes from "../games/GamesQuizzes"

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
  );
};

const DashboardRoutes = () => {
  return (
    <FlashcardProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/flashcards"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <FlashcardSets />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/flashcards/edit/:setId"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <SetEditorModal />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/flashcards/study/:setId"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <StudyMode />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/dictionary"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <DictionarySearch />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/translator"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <LiveTranslator />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/ielts"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <IELTSPractice />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/ielts/reading"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <ReadingTests />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/ielts/listening"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <ListeningTests />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/ielts/writing"
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <WritingTests />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/ielts/speaking" // ✅ FIXED - Changed from /ielts/listening
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <SpeakingTests />
              </Dashboard>
            </div>
          }
        />

        <Route
          path="/games" // ✅ FIXED - Changed from /ielts/listening
          element={
            <div className="min-h-screen bg-gray-50">
              <Dashboard>
                <GamesQuizzes />
              </Dashboard>
            </div>
          }
        />
      </Routes>
    </FlashcardProvider>
  );
};

export default DashboardRoutes;
