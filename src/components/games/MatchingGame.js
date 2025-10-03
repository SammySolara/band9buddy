// src/components/games/MatchingGame.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, RotateCcw, Clock, Star } from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";

const MatchingGame = () => {
  const navigate = useNavigate();
  const { sets } = useFlashcards();

  // Game states
  const [selectedSet, setSelectedSet] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter sets that have enough cards (minimum 4 cards = 2 pairs)
  const validSets = sets.filter((set) => set.cards && set.cards.length >= 4);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !isComplete && !showPreview) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete, showPreview]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize game with selected set
  const startGame = (set, pairCount) => {
    setSelectedSet(set);
    setDifficulty(pairCount);

    // Take the specified number of cards
    const selectedCards = set.cards.slice(0, pairCount);

    // Create pairs - one card with front text, one with back text
    const gamePairs = [];
    selectedCards.forEach((card, index) => {
      gamePairs.push({
        id: `front-${card.id}`,
        content: card.front || card.front_text,
        pairId: card.id,
        type: "front",
        matched: false,
      });
      gamePairs.push({
        id: `back-${card.id}`,
        content: card.back || card.back_text,
        pairId: card.id,
        type: "back",
        matched: false,
      });
    });

    // Shuffle cards
    const shuffled = gamePairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setGameStarted(true);
    setShowPreview(true);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setIsComplete(false);

    // Hide preview after 3 seconds
    setTimeout(() => {
      setShowPreview(false);
    }, 3000);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (showPreview) return;
    if (isChecking) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedPairs.some((pair) => pair.includes(cardId))) return;
    if (flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    // Check for match when two cards are flipped
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const card1 = cards.find((c) => c.id === newFlipped[0]);
      const card2 = cards.find((c) => c.id === newFlipped[1]);

      if (card1.pairId === card2.pairId) {
        // Match found!
        setTimeout(() => {
          setMatchedPairs((prev) => [...prev, newFlipped]);
          setFlippedCards([]);
          setIsChecking(false);

          // Check if game is complete
          if (matchedPairs.length + 1 === cards.length / 2) {
            setIsComplete(true);
          }
        }, 600);
      } else {
        // No match, flip back
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // Reset game
  const handleReset = () => {
    if (selectedSet && difficulty) {
      startGame(selectedSet, difficulty);
    }
  };

  // Get grid columns based on number of cards
  const getGridColumns = () => {
    const totalCards = cards.length;
    if (totalCards <= 8) return "grid-cols-4"; // 4 columns for 4 pairs
    if (totalCards <= 12) return "grid-cols-4 md:grid-cols-6"; // 6 columns for 6 pairs
    if (totalCards <= 16) return "grid-cols-4 md:grid-cols-4 lg:grid-cols-6"; // 4-6 columns for 8 pairs
    return "grid-cols-4 md:grid-cols-6"; // 4-6 columns for larger sets
  };

  // Calculate score
  const calculateScore = () => {
    const pairCount = cards.length / 2;
    const perfectMoves = pairCount;
    const efficiency = Math.max(0, Math.round((perfectMoves / moves) * 100));
    const timeBonus = Math.max(0, 100 - Math.floor(timeElapsed / 2));
    return Math.round((efficiency + timeBonus) / 2);
  };

  // Set selection screen
  if (!gameStarted) {
    // Difficulty selection for a chosen set
    if (selectedSet && !difficulty) {
      const maxPairs = Math.min(Math.floor(selectedSet.cards.length), 12);
      const difficulties = [
        { pairs: 4, label: "Dễ", desc: "4 cặp (8 thẻ)", color: "green" },
        {
          pairs: 6,
          label: "Trung bình",
          desc: "6 cặp (12 thẻ)",
          color: "yellow",
        },
        { pairs: 8, label: "Khó", desc: "8 cặp (16 thẻ)", color: "orange" },
        { pairs: 12, label: "Cực khó", desc: "12 cặp (24 thẻ)", color: "red" },
      ].filter((d) => d.pairs <= maxPairs);

      return (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedSet(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Trophy className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedSet.title}
              </h2>
              <p className="text-gray-600">Chọn độ khó</p>
            </div>

            <div className="space-y-4">
              {difficulties.map((diff) => (
                <button
                  key={diff.pairs}
                  onClick={() => startGame(selectedSet, diff.pairs)}
                  className="w-full text-left border-2 border-gray-200 hover:border-purple-500 bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-purple-100 rounded-lg p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {diff.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{diff.desc}</p>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {diff.pairs}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                💡 <strong>Mẹo:</strong> Bắt đầu với độ khó Dễ nếu đây là lần
                đầu chơi với bộ thẻ này!
              </p>
            </div>
          </div>
        </div>
      );
    }

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
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Matching Game
            </h1>
            <p className="text-gray-600">
              Tìm các cặp từ và định nghĩa phù hợp
            </p>
          </div>

          {/* Game Rules */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">📋 Cách chơi:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">1.</span>
                <span>Lật hai thẻ bất kỳ để xem nội dung</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">2.</span>
                <span>Tìm cặp từ và định nghĩa khớp với nhau</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">3.</span>
                <span>
                  Hoàn thành nhanh với ít lượt chơi nhất để đạt điểm cao
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">4.</span>
                <span>Cần tối thiểu 4 thẻ (2 cặp) để chơi</span>
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
                    onClick={() => setSelectedSet(set)}
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
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Xuất sắc!</h2>
            <p className="text-gray-600">
              Bạn đã hoàn thành "{selectedSet.title}"
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">Điểm</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{moves}</div>
              <div className="text-sm text-gray-600">Lượt chơi</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Thời gian</div>
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
                setDifficulty(null);
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

  // Game board
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={() => {
            setGameStarted(false);
            setSelectedSet(null);
            setDifficulty(null);
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Chọn lại</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-900 text-sm">
              {formatTime(timeElapsed)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow">
            <Trophy className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-900 text-sm">
              {moves} lượt
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Làm lại</span>
          </button>
        </div>
      </div>

      {/* Preview Banner */}
      {showPreview && (
        <div className="bg-purple-500 text-white rounded-lg shadow-lg p-4 mb-6 text-center animate-pulse">
          <p className="font-semibold">👀 Ghi nhớ vị trí các thẻ!</p>
          <p className="text-sm mt-1">Trò chơi bắt đầu sau vài giây...</p>
        </div>
      )}

      {/* Game Title */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          {selectedSet.title}
        </h2>
        <p className="text-center text-sm text-gray-600 mt-1">
          Tìm {cards.length / 2} cặp phù hợp
        </p>
      </div>

      {/* Cards Grid */}
      <div className={`grid ${getGridColumns()} gap-3 md:gap-4`}>
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.id);
          const isMatched = matchedPairs.some((pair) => pair.includes(card.id));
          const showCard = showPreview || isFlipped || isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={isMatched || showPreview}
              className={`aspect-square rounded-lg transition-all duration-300 transform ${
                isMatched
                  ? "bg-green-500 text-white cursor-default scale-95 opacity-75"
                  : showCard
                  ? "bg-purple-500 text-white shadow-lg scale-105"
                  : "bg-white hover:bg-gray-50 shadow hover:shadow-md"
              }`}
            >
              <div className="h-full flex items-center justify-center p-2 md:p-4">
                {showCard ? (
                  <span className="text-xs md:text-sm font-medium text-center line-clamp-3 md:line-clamp-4">
                    {card.content}
                  </span>
                ) : (
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl md:text-2xl">?</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Tiến độ</span>
          <span className="text-sm text-gray-600">
            {matchedPairs.length} / {cards.length / 2} cặp
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(matchedPairs.length / (cards.length / 2)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;
