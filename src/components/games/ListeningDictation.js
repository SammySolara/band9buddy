// src/components/games/ListeningDictation.js
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Heart,
  Volume2,
  Award,
  Headphones,
} from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";

const ListeningDictation = () => {
  const navigate = useNavigate();
  const { sets } = useFlashcards();
  const inputRef = useRef(null);

  // Game states
  const [selectedSet, setSelectedSet] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [replaysUsed, setReplaysUsed] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [currentReplays, setCurrentReplays] = useState(0);

  // Filter sets that have enough cards (minimum 5 cards)
  const validSets = sets.filter((set) => set.cards && set.cards.length >= 5);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !isComplete && !showResult) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete, showResult]);

  // Focus input when ready for new word
  useEffect(() => {
    if (gameStarted && !showResult && !isComplete) {
      inputRef.current?.focus();
    }
  }, [gameStarted, showResult, isComplete, currentWordIndex]);

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

  // Text-to-speech function
  const speakWord = (word) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.8; // Slower for dictation
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start game with selected set
  const startGame = (set) => {
    setSelectedSet(set);
    const shuffledWords = shuffleArray([...set.cards]).slice(0, 15); // Max 15 words
    setWords(shuffledWords);
    setGameStarted(true);
    setCurrentWordIndex(0);
    setUserInput("");
    setLives(3);
    setScore(0);
    setTimeElapsed(0);
    setReplaysUsed(0);
    setShowResult(false);
    setIsComplete(false);
    setStreak(0);
    setBestStreak(0);
    setAnswerHistory([]);
    setCurrentReplays(0);

    // Speak first word after a short delay
    setTimeout(() => {
      speakWord(shuffledWords[0].front || shuffledWords[0].front_text);
    }, 500);
  };

  const currentWord = words[currentWordIndex];
  const correctSpelling = currentWord?.front || currentWord?.front_text || "";
  const definition = currentWord?.back || currentWord?.back_text || "";

  // Replay word pronunciation (max 2 replays per word)
  const replayWord = () => {
    if (currentReplays >= 2 || showResult) return;

    setCurrentReplays((prev) => prev + 1);
    setReplaysUsed((prev) => prev + 1);
    speakWord(correctSpelling);
  };

  // Check answer
  const checkAnswer = () => {
    if (!userInput.trim() || showResult) return;

    const userAnswer = userInput.trim().toLowerCase();
    const correct = correctSpelling.toLowerCase();
    const isAnswerCorrect = userAnswer === correct;

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      // Calculate points: base 25 + streak bonus - replay penalty
      const basePoints = 25;
      const streakBonus = streak * 5;
      const replayPenalty = currentReplays * 5; // -5 per replay
      const points = basePoints + streakBonus - replayPenalty;

      setScore((prev) => prev + Math.max(points, 10)); // Minimum 10 points
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((current) => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setLives((prev) => prev - 1);
      setStreak(0);

      // Check if game over
      if (lives - 1 <= 0) {
        setIsComplete(true);
      }
    }

    // Record answer
    setAnswerHistory((prev) => [
      ...prev,
      {
        word: correctSpelling,
        definition,
        userAnswer: userInput.trim(),
        correct: isAnswerCorrect,
        replaysUsed: currentReplays,
      },
    ]);
  };

  // Move to next word
  const nextWord = () => {
    if (currentWordIndex < words.length - 1 && lives > 0) {
      setCurrentWordIndex((prev) => prev + 1);
      setUserInput("");
      setShowResult(false);
      setCurrentReplays(0);

      // Speak next word
      setTimeout(() => {
        speakWord(
          words[currentWordIndex + 1].front ||
            words[currentWordIndex + 1].front_text
        );
      }, 300);
    } else {
      setIsComplete(true);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (showResult) {
        nextWord();
      } else {
        checkAnswer();
      }
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
    const correctAnswers = answerHistory.filter((a) => a.correct).length;
    const accuracy =
      words.length > 0 ? Math.round((correctAnswers / words.length) * 100) : 0;
    return { correctAnswers, accuracy };
  };

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
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Listening Dictation
            </h1>
            <p className="text-gray-600">Nghe và đánh vần từ vựng</p>
          </div>

          {/* Game Rules */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Cách chơi:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span>Nghe từ được phát âm và đánh vần chính xác</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span>Bạn có 3 mạng - mỗi lần sai mất 1 mạng</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span>
                  Có thể nghe lại tối đa 2 lần mỗi từ (mỗi lần -5 điểm)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                <span>Chuỗi trả lời đúng liên tiếp tăng điểm thưởng</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">5.</span>
                <span>Định nghĩa được hiển thị sau khi trả lời</span>
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
                  Bạn cần có ít nhất một bộ với 5 thẻ trở lên để chơi
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
    const { correctAnswers, accuracy } = calculateFinalScore();

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <Award className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {lives > 0 ? "Xuất sắc!" : "Game Over!"}
            </h2>
            <p className="text-gray-600">
              {lives > 0
                ? `Bạn đã hoàn thành "${selectedSet.title}"`
                : "Hết mạng rồi!"}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Điểm</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Đúng</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">
                {bestStreak}
              </div>
              <div className="text-sm text-gray-600">Streak tốt nhất</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-600">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Chính xác</div>
            </div>
          </div>

          {/* Review Answers */}
          <div className="mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xem lại đáp án:
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {answerHistory.map((answer, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    answer.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">
                        {answer.word}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {answer.definition}
                      </p>
                      {!answer.correct && (
                        <p className="text-sm text-red-700">
                          Bạn viết:{" "}
                          <span className="font-medium">
                            {answer.userAnswer}
                          </span>
                        </p>
                      )}
                      {answer.replaysUsed > 0 && (
                        <p className="text-xs text-blue-700 mt-1">
                          Nghe lại {answer.replaysUsed} lần
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => speakWord(answer.word)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Phát âm lại"
                    >
                      <Volume2 className="h-4 w-4 text-gray-600" />
                    </button>
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

  // Game screen
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
          <span>Thoát</span>
        </button>

        <div className="flex items-center space-x-4">
          {/* Lives */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Heart
              className={`h-5 w-5 ${
                lives > 0 ? "text-red-500 fill-red-500" : "text-gray-300"
              }`}
            />
            <span className="font-semibold text-gray-900">×{lives}</span>
          </div>

          {/* Score */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Trophy className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-gray-900">{score}</span>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center space-x-2 bg-orange-50 border-2 border-orange-300 px-4 py-2 rounded-lg animate-pulse">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-orange-600">{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Từ {currentWordIndex + 1} / {words.length}
          </span>
          <span className="text-sm text-gray-600">
            {formatTime(timeElapsed)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentWordIndex + 1) / words.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Game Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {/* Audio Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={replayWord}
            disabled={currentReplays >= 2 || showResult}
            className="flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            <Volume2 className="h-6 w-6" />
            <span className="font-semibold text-lg">
              Nghe lại ({2 - currentReplays})
            </span>
          </button>
        </div>

        {/* Replay Info */}
        {currentReplays > 0 && !showResult && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Đã nghe lại {currentReplays} lần • Mỗi lần -5 điểm
            </p>
          </div>
        )}

        {/* Input Field */}
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="Nhập từ vào đây..."
            className="w-full text-center text-2xl font-bold p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div
            className={`text-center mb-6 p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {isCorrect ? (
              <div>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  Chính xác!
                </p>
                <p className="text-green-700">
                  +{Math.max(25 + (streak - 1) * 5 - currentReplays * 5, 10)}{" "}
                  điểm
                </p>
                <p className="text-sm text-gray-600 mt-2">{definition}</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-red-600 mb-2">Sai rồi!</p>
                <p className="text-red-700 mb-2">
                  Đáp án đúng:{" "}
                  <span className="font-bold">{correctSpelling}</span>
                </p>
                <p className="text-sm text-gray-600">{definition}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={!userInput.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors font-semibold"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={nextWord}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
            >
              {currentWordIndex < words.length - 1 && lives > 0
                ? "Từ tiếp theo"
                : "Hoàn thành"}
            </button>
          )}
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Bộ:{" "}
            <span className="font-semibold text-gray-900">
              {selectedSet.title}
            </span>
          </span>
          <span className="text-gray-600">
            Tổng lần nghe lại:{" "}
            <span className="font-semibold text-gray-900">{replaysUsed}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListeningDictation;
