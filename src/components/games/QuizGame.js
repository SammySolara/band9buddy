// src/components/games/QuizGame.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";

const QuizGame = () => {
  const navigate = useNavigate();
  const { sets } = useFlashcards();

  // Game states
  const [selectedSet, setSelectedSet] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Filter sets that have enough cards (minimum 4 cards for quiz)
  const validSets = sets.filter((set) => set.cards && set.cards.length >= 4);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !isComplete) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Shuffle array helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate quiz questions from flashcard set
  const generateQuestions = (set) => {
    const cards = [...set.cards];
    const numQuestions = Math.min(10, cards.length); // Max 10 questions
    const selectedCards = shuffleArray(cards).slice(0, numQuestions);

    const quizQuestions = selectedCards.map((card, index) => {
      // Randomly decide if we ask front->back or back->front
      const askFrontToBack = Math.random() > 0.5;

      const question = askFrontToBack
        ? card.front || card.front_text
        : card.back || card.back_text;

      const correctAnswer = askFrontToBack
        ? card.back || card.back_text
        : card.front || card.front_text;

      // Generate wrong answers from other cards
      const otherCards = cards.filter((c) => c.id !== card.id);
      const wrongAnswers = shuffleArray(otherCards)
        .slice(0, 3)
        .map((c) =>
          askFrontToBack ? c.back || c.back_text : c.front || c.front_text
        );

      // Combine and shuffle all options
      const options = shuffleArray([correctAnswer, ...wrongAnswers]);

      return {
        id: card.id,
        question,
        correctAnswer,
        options,
        type: askFrontToBack ? "front-to-back" : "back-to-front",
      };
    });

    return quizQuestions;
  };

  // Start game with selected set
  const startGame = (set) => {
    setSelectedSet(set);
    const quizQuestions = generateQuestions(set);
    setQuestions(quizQuestions);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setAnswers([]);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  // Submit answer
  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);

    setShowResult(true);
  };

  // Move to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  // Reset game
  const handleReset = () => {
    if (selectedSet) {
      startGame(selectedSet);
    }
  };

  // Calculate final score
  const calculateFinalScore = () => {
    const correctPercentage = (score / questions.length) * 100;
    const timeBonus = Math.max(0, 100 - Math.floor(timeElapsed / 3));
    return Math.round((correctPercentage + timeBonus) / 2);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Set selection screen
  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard/games")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Game</h1>
            <p className="text-gray-600">Trả lời các câu hỏi từ vựng</p>
          </div>

          {/* Game Rules */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Cách chơi:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span>Đọc câu hỏi và chọn đáp án đúng từ 4 lựa chọn</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span>Câu hỏi có thể hỏi từ hoặc định nghĩa</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span>Trả lời nhanh và chính xác để đạt điểm cao</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                <span>Cần tối thiểu 4 thẻ để chơi</span>
              </li>
            </ul>
          </div>

          {/* Set Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn bộ flashcards:
            </h3>

            {validSets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Bạn cần có ít nhất một bộ với 4 thẻ trở lên để chơi
                </p>
                <button
                  onClick={() => navigate("/dashboard/flashcards")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Tạo flashcards
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validSets.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => startGame(set)}
                    className="text-left bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {set.title}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {set.cards.length} thẻ
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {set.description || "Không có mô tả"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game completion screen
  if (isComplete) {
    const finalScore = calculateFinalScore();
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hoàn thành!
            </h2>
            <p className="text-gray-600">
              Bạn đã hoàn thành quiz "{selectedSet.title}"
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">
                {finalScore}
              </div>
              <div className="text-sm text-gray-600">Điểm tổng</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {score}/{questions.length}
              </div>
              <div className="text-sm text-gray-600">Đúng</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>
          </div>

          {/* Review Answers */}
          <div className="mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xem lại đáp án:
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    answer.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        {answer.question}
                      </p>
                      {!answer.isCorrect && (
                        <div className="text-sm">
                          <p className="text-red-700">
                            Bạn chọn: {answer.selectedAnswer}
                          </p>
                          <p className="text-green-700">
                            Đáp án đúng: {answer.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Chơi lại</span>
            </button>
            <button
              onClick={() => {
                setGameStarted(false);
                setSelectedSet(null);
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Chọn bộ khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz game screen
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setGameStarted(false);
            setSelectedSet(null);
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Chọn lại</span>
        </button>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">
              {formatTime(timeElapsed)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Trophy className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">
              {score}/{questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Câu hỏi {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {currentQuestion?.question}
          </h3>
          <p className="text-sm text-gray-500">Chọn đáp án đúng</p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  showCorrect
                    ? "bg-green-50 border-green-500"
                    : showWrong
                    ? "bg-red-50 border-red-500"
                    : isSelected
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-200 hover:border-blue-300"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option}</span>
                  {showCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {showWrong && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit/Next Button */}
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Xác nhận
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            {currentQuestionIndex < questions.length - 1
              ? "Câu tiếp theo"
              : "Hoàn thành"}
          </button>
        )}
      </div>

      {/* Set Info */}
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-sm text-gray-600">
          Bộ:{" "}
          <span className="font-semibold text-gray-900">
            {selectedSet.title}
          </span>
        </p>
      </div>
    </div>
  );
};

export default QuizGame;
