// src/components/games/GamesQuizzes.js
import { useNavigate } from "react-router-dom";
import { Zap, Target, Brain, Trophy, Gamepad2 } from "lucide-react";

const GamesQuizzes = () => {
  const navigate = useNavigate();

  const gameTypes = [
    {
      id: "memory-match",
      icon: Brain,
      title: "Memory Match",
      description: "Ghép các cặp từ và định nghĩa",
      color: "bg-purple-500",
      path: "/dashboard/games/memory-match",
      comingSoon: true,
    },
    {
      id: "speed-quiz",
      icon: Zap,
      title: "Speed Quiz",
      description: "Trả lời nhanh các câu hỏi từ vựng",
      color: "bg-yellow-500",
      path: "/dashboard/games/speed-quiz",
      comingSoon: true,
    },
    {
      id: "word-builder",
      icon: Target,
      title: "Word Builder",
      description: "Xếp chữ cái để tạo thành từ",
      color: "bg-green-500",
      path: "/dashboard/games/word-builder",
      comingSoon: true,
    },
    {
      id: "spelling-bee",
      icon: Trophy,
      title: "Spelling Bee",
      description: "Thử thách đánh vần từ vựng",
      color: "bg-blue-500",
      path: "/dashboard/games/spelling-bee",
      comingSoon: true,
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
            <Gamepad2 className="h-8 w-8" />
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

      {/* Games Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameTypes.map((game) => {
          const IconComponent = game.icon;
          return (
            <div key={game.id} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full relative overflow-hidden">
                {/* Coming Soon Badge */}
                {game.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sắp ra mắt
                    </span>
                  </div>
                )}

                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${game.color} rounded-lg text-white mb-6`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {game.title}
                </h3>

                <p className="text-gray-600 mb-6">{game.description}</p>

                <button
                  onClick={() => handleGameClick(game)}
                  disabled={game.comingSoon}
                  className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Memory Match
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Speed Quiz</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Word Builder
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Spelling Bee
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
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
        </ul>
      </div>
    </div>
  );
};

export default GamesQuizzes;
