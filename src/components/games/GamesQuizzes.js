// src/components/games/GamesQuizzes.js
import { useNavigate } from "react-router-dom";
import {
  Puzzle,
  HelpCircle,
  Trophy,
  Headphones,
  Blocks,
  Grid3x3,
} from "lucide-react";

const GamesQuizzes = () => {
  const navigate = useNavigate();

  const gameTypes = [
    {
      id: "matching-game",
      icon: Puzzle,
      title: "Matching Game",
      description: "Ghép các cặp từ",
      color: "bg-purple-500",
      path: "/dashboard/games/matching",
      comingSoon: false,
    },
    {
      id: "quiz-game",
      icon: HelpCircle,
      title: "Quiz Game",
      description: "Trả lời các câu hỏi từ vựng",
      color: "bg-blue-500",
      path: "/dashboard/games/quiz",
      comingSoon: false,
    },
    {
      id: "spelling-bee",
      icon: Trophy,
      title: "Spelling Bee",
      description: "Thử thách đánh vần từ vựng",
      color: "bg-yellow-500",
      path: "/dashboard/games/spelling-bee",
      comingSoon: false,
    },
    {
      id: "listening-dictation",
      icon: Headphones,
      title: "Listening Dictation",
      description: "Nghe và viết từ chính xác",
      color: "bg-green-500",
      path: "/dashboard/games/listening-dictation",
      comingSoon: false,
    },
    {
      id: "word-builder",
      icon: Blocks,
      title: "Word Builder",
      description: "Xếp chữ cái để tạo thành từ",
      color: "bg-orange-500",
      path: "/dashboard/games/word-builder",
      comingSoon: false,
    },
    {
      id: "word-search",
      icon: Grid3x3,
      title: "Word Search",
      description: "Tìm từ ẩn trong bảng chữ",
      color: "bg-pink-500",
      path: "/dashboard/games/word-search",
      comingSoon: false,
    },
  ];

  const handleGameClick = (game) => {
    if (game.comingSoon) {
      alert("Trò chơi sắp ra mắt!");
      return;
    }
    navigate(game.path);
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Games & Quizzes 🎮
        </h2>
        <p className="text-gray-600">
          Học từ vựng qua các trò chơi vui nhộn và thử thách. Tất cả các trò
          chơi sử dụng từ vựng từ bộ flashcards của bạn.
        </p>
      </div>

      {/* Games Grid - 3x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameTypes.map((game) => {
          const IconComponent = game.icon;
          return (
            <div key={game.id} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 h-full relative overflow-hidden">
                {/* Coming Soon Badge */}
                {game.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sắp ra mắt
                    </span>
                  </div>
                )}

                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${game.color} rounded-lg text-white mb-4`}
                >
                  <IconComponent className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {game.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4">{game.description}</p>

                <button
                  onClick={() => handleGameClick(game)}
                  disabled={game.comingSoon}
                  className={`w-full font-medium py-2 px-4 rounded-lg transition-colors text-sm ${
                    game.comingSoon
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {game.comingSoon ? "Sắp có" : "Chơi ngay"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Tips Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          💡 Mẹo học tập
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Chơi mỗi ngày 10-15 phút để ghi nhớ từ vựng tốt hơn</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Thử thách bản thân bằng cách tăng tốc độ dần dần</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Kết hợp nhiều trò chơi khác nhau để học đa dạng hơn</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>
              Tạo flashcards mới để mở khóa nhiều từ vựng cho trò chơi
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GamesQuizzes;
