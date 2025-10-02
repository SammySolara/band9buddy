// src/components/games/WordSearch.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Award,
  Search,
  Clock,
  Eye,
} from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";

const WordSearch = () => {
  const navigate = useNavigate();
  const { sets } = useFlashcards();

  // Game states
  const [selectedSet, setSelectedSet] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState(10);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [wordPositions, setWordPositions] = useState({});

  // Filter sets that have enough cards
  const validSets = sets.filter((set) => set.cards && set.cards.length >= 3);

  // Difficulty settings
  const difficultySettings = {
    easy: { size: 10, wordCount: 3, directions: ["horizontal", "vertical"] },
    medium: {
      size: 12,
      wordCount: 5,
      directions: ["horizontal", "vertical", "diagonal"],
    },
    hard: {
      size: 15,
      wordCount: 7,
      directions: ["horizontal", "vertical", "diagonal", "reverse"],
    },
  };

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

  // Check if game is complete
  useEffect(() => {
    if (gameStarted && foundWords.length === words.length && words.length > 0) {
      setIsComplete(true);
    }
  }, [foundWords, words, gameStarted]);

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

  // Get random letter (single character only)
  const getRandomLetter = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters.charAt(Math.floor(Math.random() * letters.length));
  };

  // Create empty grid
  const createEmptyGrid = (size) => {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        letter: "",
        isPartOfWord: false,
        wordId: null,
      }))
    );
  };

  // Place word in grid
  const placeWord = (grid, word, size, allowedDirections) => {
    const directions = {
      horizontal: { dx: 0, dy: 1 },
      vertical: { dx: 1, dy: 0 },
      diagonal: { dx: 1, dy: 1 },
      reverse: { dx: 0, dy: -1 },
    };

    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const direction =
        allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
      const { dx, dy } = directions[direction];

      const maxStartX =
        direction === "vertical" || direction === "diagonal"
          ? size - word.length
          : size - 1;
      const maxStartY =
        direction === "horizontal" || direction === "diagonal"
          ? size - word.length
          : direction === "reverse"
          ? size - 1
          : size - 1;

      const startX = Math.floor(Math.random() * (maxStartX + 1));
      const startY =
        direction === "reverse"
          ? Math.floor(Math.random() * (size - word.length + 1)) +
            word.length -
            1
          : Math.floor(Math.random() * (maxStartY + 1));

      let canPlace = true;
      const positions = [];

      // Check if word can be placed
      for (let i = 0; i < word.length; i++) {
        const x = startX + dx * i;
        const y = startY + dy * i;

        if (x < 0 || x >= size || y < 0 || y >= size) {
          canPlace = false;
          break;
        }

        if (grid[x][y].letter !== "" && grid[x][y].letter !== word[i]) {
          canPlace = false;
          break;
        }

        positions.push({ x, y });
      }

      if (canPlace) {
        // Place the word
        positions.forEach((pos, i) => {
          grid[pos.x][pos.y] = {
            letter: word[i],
            isPartOfWord: true,
            wordId: word,
          };
        });
        return positions;
      }

      attempts++;
    }

    return null;
  };

  // Generate word search grid
  const generateGrid = (selectedWords, size, allowedDirections) => {
    // A temporary grid used ONLY for placing words and checking collisions.
    const gridForPlacement = createEmptyGrid(size);
    const finalPositions = {};
    // A map to store the final state of cells that are part of a word.
    // Key: "row-col", Value: { letter, isPartOfWord, wordId }
    const letterMap = new Map();

    // Step 1: Try to place words and record their letter positions in our map.
    // The `placeWord` function will modify `gridForPlacement` as it works.
    for (const wordObj of selectedWords) {
      const word = (wordObj.front || wordObj.front_text).toUpperCase();
      const positions = placeWord(
        gridForPlacement,
        word,
        size,
        allowedDirections
      );

      if (positions) {
        finalPositions[word] = positions;
        // Record each letter of the successfully placed word in our map.
        positions.forEach((pos, i) => {
          const key = `${pos.x}-${pos.y}`;
          letterMap.set(key, {
            letter: word[i],
            isPartOfWord: true,
            wordId: word,
          });
        });
      }
    }

    // Step 2: Build the final grid from scratch, using the map and filling in the rest.
    // This avoids any weird bugs from the mutation process in Step 1.
    const finalGrid = Array.from({ length: size }, (_, rowIndex) =>
      Array.from({ length: size }, (_, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        // If a letter for this cell was recorded in our map, use it.
        if (letterMap.has(key)) {
          return letterMap.get(key);
        }
        // Otherwise, this cell is empty, so fill it with a random letter.
        return {
          letter: getRandomLetter(),
          isPartOfWord: false,
          wordId: null,
        };
      })
    );

    return { grid: finalGrid, positions: finalPositions };
  };

  // Start game
  const startGame = (set, diff) => {
    setSelectedSet(set);
    setDifficulty(diff);

    const settings = difficultySettings[diff];
    const shuffledCards = shuffleArray([...set.cards]).slice(
      0,
      settings.wordCount
    );

    const { grid: newGrid, positions } = generateGrid(
      shuffledCards,
      settings.size,
      settings.directions
    );

    setGrid(newGrid);
    setGridSize(settings.size);
    setWords(
      shuffledCards.map((card) => ({
        word: (card.front || card.front_text).toUpperCase(),
        definition: card.back || card.back_text,
        found: false,
      }))
    );
    setWordPositions(positions);
    setFoundWords([]);
    setSelectedCells([]);
    setScore(0);
    setTimeElapsed(0);
    setHintsUsed(0);
    setIsComplete(false);
    setGameStarted(true);
  };

  // Cell selection handlers
  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (isSelecting) {
      // Check if cell is adjacent or in line with selection
      const lastCell = selectedCells[selectedCells.length - 1];
      if (
        lastCell &&
        Math.abs(row - lastCell.row) <= 1 &&
        Math.abs(col - lastCell.col) <= 1
      ) {
        // Don't add if it's already the last cell
        if (
          selectedCells[selectedCells.length - 1].row !== row ||
          selectedCells[selectedCells.length - 1].col !== col
        ) {
          setSelectedCells([...selectedCells, { row, col }]);
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      checkSelectedWord();
      setIsSelecting(false);
    }
  };

  // Check if selected cells form a word
  const checkSelectedWord = () => {
    if (selectedCells.length < 1) {
      setSelectedCells([]);
      return;
    }

    const selectedWord = selectedCells
      .map((cell) => grid[cell.row][cell.col].letter)
      .join("");

    const reversedWord = selectedWord.split("").reverse().join("");

    // Check if it matches any unfound word
    const matchedWord = words.find(
      (w) => !w.found && (w.word === selectedWord || w.word === reversedWord)
    );

    if (matchedWord) {
      // Mark word as found
      setFoundWords([...foundWords, matchedWord.word]);

      // Calculate score based on word length and time
      const basePoints = matchedWord.word.length * 10;
      const timeBonus = Math.max(0, 100 - timeElapsed);
      const hintPenalty = hintsUsed * 20;
      const points = basePoints + timeBonus - hintPenalty;

      setScore((prev) => prev + Math.max(points, 10));

      // Update words array
      setWords(
        words.map((w) =>
          w.word === matchedWord.word ? { ...w, found: true } : w
        )
      );
    }

    setSelectedCells([]);
  };

  // Use hint - highlight first letter of an unfound word
  const useHint = () => {
    const unfoundWords = words.filter((w) => !w.found);
    if (unfoundWords.length === 0) return;

    const randomWord =
      unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    const positions = wordPositions[randomWord.word];

    if (positions && positions.length > 0) {
      const firstPos = positions[0];
      setSelectedCells([{ row: firstPos.x, col: firstPos.y }]);
      setHintsUsed((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 20));

      // Clear hint after 2 seconds
      setTimeout(() => {
        setSelectedCells([]);
      }, 2000);
    }
  };

  // Check if cell is selected
  const isCellSelected = (row, col) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col);
  };

  // Check if cell is part of found word
  const isCellFound = (row, col) => {
    const cell = grid[row][col];
    return cell.isPartOfWord && foundWords.includes(cell.wordId);
  };

  // Reset game
  const handleReset = () => {
    if (selectedSet && difficulty) {
      startGame(selectedSet, difficulty);
    }
  };

  // Difficulty selection screen
  if (!gameStarted && selectedSet) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedSet(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chọn độ khó
            </h2>
            <p className="text-gray-600">Bộ: {selectedSet.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => startGame(selectedSet, "easy")}
              className="bg-green-50 border-2 border-green-200 hover:border-green-500 rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">😊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dễ</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Lưới 10×10</li>
                <li>3 từ</li>
                <li>Ngang & Dọc</li>
              </ul>
            </button>

            <button
              onClick={() => startGame(selectedSet, "medium")}
              className="bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-500 rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Trung bình
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Lưới 12×12</li>
                <li>5 từ</li>
                <li>Ngang, Dọc & Chéo</li>
              </ul>
            </button>

            <button
              onClick={() => startGame(selectedSet, "hard")}
              className="bg-red-50 border-2 border-red-200 hover:border-red-500 rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">😤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Khó</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Lưới 15×15</li>
                <li>7 từ</li>
                <li>Tất cả hướng</li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Word Search
            </h1>
            <p className="text-gray-600">Tìm kiếm từ vựng trong lưới</p>
          </div>

          {/* Game Rules */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Cách chơi:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">1.</span>
                <span>Tìm các từ ẩn trong lưới chữ cái</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">2.</span>
                <span>Kéo chuột từ chữ cái đầu đến cuối để chọn từ</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">3.</span>
                <span>Từ có thể nằm ngang, dọc, chéo hoặc ngược lại</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">4.</span>
                <span>Dùng gợi ý để hiện chữ cái đầu (-20 điểm)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">5.</span>
                <span>Hoàn thành nhanh để được điểm thưởng</span>
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
                  Bạn cần có ít nhất một bộ với 3 thẻ trở lên để chơi
                </p>
                <button
                  onClick={() => navigate("/dashboard/flashcards")}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
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
                    className="text-left bg-white border-2 border-gray-200 hover:border-green-500 rounded-lg p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {set.title}
                      </h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
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
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <Award className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Xuất sắc!</h2>
            <p className="text-gray-600">Bạn đã tìm hết {words.length} từ!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Điểm</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Thời gian</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">
                {hintsUsed}
              </div>
              <div className="text-sm text-gray-600">Gợi ý</div>
            </div>
          </div>

          {/* Found Words */}
          <div className="mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Các từ đã tìm:
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {words.map((wordObj, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-2 bg-green-50 border-green-200"
                >
                  <p className="font-bold text-gray-900 mb-1">{wordObj.word}</p>
                  <p className="text-sm text-gray-600">{wordObj.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors"
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

  // Game screen
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setGameStarted(false);
            setSelectedSet(null);
            setDifficulty(null);
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Thoát</span>
        </button>

        <div className="flex items-center space-x-4">
          {/* Score */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Trophy className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-gray-900">{score}</span>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-gray-900">
              {formatTime(timeElapsed)}
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <span className="font-semibold text-gray-900">
              {foundWords.length}/{words.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div
              className="inline-block"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                      onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                      onTouchMove={(e) => {
                        const touch = e.touches[0];
                        const target = document.elementFromPoint(
                          touch.clientX,
                          touch.clientY
                        );
                        if (target?.dataset?.row && target?.dataset?.col) {
                          handleMouseEnter(
                            parseInt(target.dataset.row),
                            parseInt(target.dataset.col)
                          );
                        }
                      }}
                      onTouchEnd={handleMouseUp}
                      data-row={rowIndex}
                      data-col={colIndex}
                      className={`
    w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
    font-bold text-sm md:text-base rounded transition-all
    ${
      isCellFound(rowIndex, colIndex)
        ? "bg-green-500 text-white"
        : isCellSelected(rowIndex, colIndex)
        ? "bg-blue-400 text-white"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }
  `}
                      style={{
                        userSelect: "none",
                        width: `calc((90vw - ${gridSize * 2}px) / ${gridSize})`,
                        maxWidth: "40px",
                      }}
                    >
                      {cell.letter.charAt(0)}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={useHint}
                disabled={words.filter((w) => !w.found).length === 0}
                className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white py-2 px-6 rounded-lg transition-colors mx-auto"
              >
                <Eye className="h-5 w-5" />
                <span>Gợi ý (-20đ)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Word List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Danh sách từ
            </h3>
            <div className="space-y-3">
              {words.map((wordObj, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    wordObj.found
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <p
                    className={`font-bold mb-1 ${
                      wordObj.found
                        ? "text-green-600 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {wordObj.word}
                  </p>
                  <p className="text-sm text-gray-600">{wordObj.definition}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Độ khó:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {difficulty === "easy"
                      ? "Dễ"
                      : difficulty === "medium"
                      ? "Trung bình"
                      : "Khó"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gợi ý đã dùng:</span>
                  <span className="font-semibold text-gray-900">
                    {hintsUsed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearch;
