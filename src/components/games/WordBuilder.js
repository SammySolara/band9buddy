// src/components/games/WordBuilder.js
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Heart,
  Shuffle,
  Award,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";

const WordBuilder = () => {
  const navigate = useNavigate();
  const { sets } = useFlashcards();

  // Game states
  const [selectedSet, setSelectedSet] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [shufflesUsed, setShufflesUsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [revealedLetters, setRevealedLetters] = useState([]);

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

  // Scramble word into letters
  const scrambleWord = (word) => {
    const letters = word.split("").map((letter, index) => ({
      id: `${letter}-${index}`,
      letter: letter,
      originalIndex: index,
    }));
    return shuffleArray(letters);
  };

  // Start game with selected set
  const startGame = (set) => {
    setSelectedSet(set);
    const shuffledWords = shuffleArray([...set.cards]).slice(0, 15); // Max 15 words
    setWords(shuffledWords);
    setGameStarted(true);
    setCurrentWordIndex(0);
    setLives(3);
    setScore(0);
    setTimeElapsed(0);
    setShufflesUsed(0);
    setHintsUsed(0);
    setShowResult(false);
    setIsComplete(false);
    setStreak(0);
    setBestStreak(0);
    setAnswerHistory([]);
    setRevealedLetters([]);

    // Scramble first word
    const firstWord = shuffledWords[0].front || shuffledWords[0].front_text;
    setScrambledLetters(scrambleWord(firstWord));
    setSelectedLetters([]);
  };

  const currentWord = words[currentWordIndex];
  const correctWord = currentWord?.front || currentWord?.front_text || "";
  const definition = currentWord?.back || currentWord?.back_text || "";

  // Reshuffle scrambled letters
  const reshuffleLetters = () => {
    if (showResult) return;
    setScrambledLetters(shuffleArray([...scrambledLetters]));
    setShufflesUsed((prev) => prev + 1);
  };

  // Use hint - reveal next correct letter
  const useHint = () => {
    if (showResult || selectedLetters.length >= correctWord.length) return;

    const nextPosition = selectedLetters.length;
    const correctLetter = correctWord[nextPosition];

    // Find the letter in scrambled letters
    const letterToReveal = scrambledLetters.find(
      (item) => item.originalIndex === nextPosition
    );

    if (letterToReveal) {
      // Add to selected letters
      setSelectedLetters([...selectedLetters, letterToReveal]);
      // Remove from scrambled letters
      setScrambledLetters(
        scrambledLetters.filter((item) => item.id !== letterToReveal.id)
      );
      // Track revealed letters
      setRevealedLetters([...revealedLetters, letterToReveal.id]);
      setHintsUsed((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 15)); // Deduct 15 points
    }
  };

  // Select letter from scrambled pool
  const selectLetter = (letterObj) => {
    if (showResult) return;
    setSelectedLetters([...selectedLetters, letterObj]);
    setScrambledLetters(scrambledLetters.filter((l) => l.id !== letterObj.id));
  };

  // Deselect letter (return to scrambled pool)
  const deselectLetter = (index) => {
    if (showResult) return;
    const letterObj = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setScrambledLetters([...scrambledLetters, letterObj]);
  };

  // Clear all selected letters
  const clearSelection = () => {
    if (showResult) return;
    setScrambledLetters([...scrambledLetters, ...selectedLetters]);
    setSelectedLetters([]);
  };

  // Check answer
  const checkAnswer = () => {
    if (selectedLetters.length === 0 || showResult) return;

    const userAnswer = selectedLetters.map((l) => l.letter).join("");
    const isAnswerCorrect =
      userAnswer.toLowerCase() === correctWord.toLowerCase();

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      // Calculate points: base 30 + streak bonus - hint penalty
      const basePoints = 30;
      const streakBonus = streak * 5;
      const hintPenalty = revealedLetters.length * 15;
      const points = basePoints + streakBonus - hintPenalty;

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
        word: correctWord,
        definition,
        userAnswer,
        correct: isAnswerCorrect,
        hintsUsed: revealedLetters.length,
        shufflesUsed: shufflesUsed,
      },
    ]);
  };

  // Move to next word
  const nextWord = () => {
    if (currentWordIndex < words.length - 1 && lives > 0) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setShowResult(false);
      setRevealedLetters([]);

      // Scramble next word
      const nextWord = words[nextIndex].front || words[nextIndex].front_text;
      setScrambledLetters(scrambleWord(nextWord));
      setSelectedLetters([]);
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Word Builder
            </h1>
            <p className="text-gray-600">Sắp xếp chữ cái tạo thành từ</p>
          </div>

          {/* Game Rules */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Cách chơi:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">1.</span>
                <span>Nhấn vào các chữ cái để sắp xếp thành từ đúng</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">2.</span>
                <span>Bạn có 3 mạng - mỗi lần sai mất 1 mạng</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">3.</span>
                <span>Dùng gợi ý để hiện chữ cái tiếp theo (-15 điểm)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">4.</span>
                <span>Xáo trộn lại các chữ cái nếu cần (không mất điểm)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">5.</span>
                <span>Chuỗi trả lời đúng liên tiếp tăng điểm thưởng</span>
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
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
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
                    className="text-left bg-white border-2 border-gray-200 hover:border-purple-500 rounded-lg p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {set.title}
                      </h4>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
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
            <Award className="h-16 w-16 text-purple-500 mx-auto mb-4" />
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
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">Điểm</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Đúng</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-600">
                {bestStreak}
              </div>
              <div className="text-sm text-gray-600">Streak tốt nhất</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">
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
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">
                      {answer.word}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {answer.definition}
                    </p>
                    {!answer.correct && (
                      <p className="text-sm text-red-700">
                        Bạn sắp xếp:{" "}
                        <span className="font-medium">{answer.userAnswer}</span>
                      </p>
                    )}
                    {answer.hintsUsed > 0 && (
                      <p className="text-xs text-purple-700 mt-1">
                        Dùng {answer.hintsUsed} gợi ý
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg transition-colors"
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
            <Trophy className="h-5 w-5 text-purple-500" />
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
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentWordIndex + 1) / words.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Game Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {/* Definition */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">Định nghĩa:</p>
          <p className="text-lg text-gray-900 font-medium">{definition}</p>
        </div>

        {/* Selected Letters Area */}
        <div className="mb-6">
          <div className="min-h-20 bg-purple-50 border-2 border-purple-300 border-dashed rounded-lg p-4 flex flex-wrap items-center justify-center gap-2">
            {selectedLetters.length === 0 ? (
              <p className="text-gray-400">Chọn các chữ cái...</p>
            ) : (
              selectedLetters.map((letterObj, index) => (
                <button
                  key={letterObj.id}
                  onClick={() => deselectLetter(index)}
                  disabled={
                    showResult || revealedLetters.includes(letterObj.id)
                  }
                  className={`w-12 h-12 text-2xl font-bold rounded-lg transition-all transform hover:scale-110 ${
                    revealedLetters.includes(letterObj.id)
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  } ${showResult ? "cursor-not-allowed" : ""}`}
                >
                  {letterObj.letter}
                </button>
              ))
            )}
          </div>
          {selectedLetters.length > 0 && !showResult && (
            <div className="text-center mt-2">
              <button
                onClick={clearSelection}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Xóa hết
              </button>
            </div>
          )}
        </div>

        {/* Scrambled Letters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {scrambledLetters.map((letterObj) => (
              <button
                key={letterObj.id}
                onClick={() => selectLetter(letterObj)}
                disabled={showResult}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-2xl font-bold rounded-lg transition-all transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {letterObj.letter}
              </button>
            ))}
          </div>
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
                  +
                  {Math.max(
                    30 + (streak - 1) * 5 - revealedLetters.length * 15,
                    10
                  )}{" "}
                  điểm
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-red-600 mb-2">Sai rồi!</p>
                <p className="text-red-700">
                  Đáp án đúng: <span className="font-bold">{correctWord}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!showResult ? (
            <>
              <button
                onClick={reshuffleLetters}
                className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                <Shuffle className="h-5 w-5" />
                <span>Xáo</span>
              </button>
              <button
                onClick={useHint}
                disabled={selectedLetters.length >= correctWord.length}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg transition-colors"
              >
                <Lightbulb className="h-5 w-5" />
                <span>Gợi ý (-15đ)</span>
              </button>
              <button
                onClick={checkAnswer}
                disabled={selectedLetters.length !== correctWord.length}
                className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors font-semibold"
              >
                Kiểm tra
              </button>
            </>
          ) : (
            <button
              onClick={nextWord}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
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
            Gợi ý: {hintsUsed} • Xáo: {shufflesUsed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WordBuilder;
