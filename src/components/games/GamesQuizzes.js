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
      description: "Ghép các cặp từ và định nghĩa",
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

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Cách hoạt động</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Các trò chơi sẽ sử dụng từ vựng từ các bộ flashcards bạn đã tạo.
              Hãy thêm flashcards trước để có trải nghiệm tốt nhất! Điểm số và
              tiến độ của bạn sẽ được lưu lại.
            </p>
          </div>
        </div>
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

      {/* Stats Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Thống kê trò chơi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-purple-100 rounded-lg mb-2">
                <Puzzle className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Matching</p>
              <p className="text-xl font-semibold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-blue-100 rounded-lg mb-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Quiz</p>
              <p className="text-xl font-semibold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-yellow-100 rounded-lg mb-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Spelling</p>
              <p className="text-xl font-semibold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-green-100 rounded-lg mb-2">
                <Headphones className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Listening
              </p>
              <p className="text-xl font-semibold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-orange-100 rounded-lg mb-2">
                <Blocks className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Builder</p>
              <p className="text-xl font-semibold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-pink-100 rounded-lg mb-2">
                <Grid3x3 className="h-5 w-5 text-pink-600" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Search</p>
              <p className="text-xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
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
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Sử dụng Listening Dictation để cải thiện kỹ năng nghe</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GamesQuizzes;
