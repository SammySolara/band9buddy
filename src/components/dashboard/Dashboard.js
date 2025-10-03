// src/components/dashboard/Dashboard.js - Updated with Mobile Responsiveness
import { useState } from "react";
import {
  LogOut,
  BookOpen,
  GamepadIcon,
  GraduationCap,
  Copy,
  User,
  Settings,
  ArrowLeft,
  Star,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import SettingsPage from "./SettingsPage"
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/B9Logo.png";

const Dashboard = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const getWordOfTheDay = () => {
    const words = [
      "serendipity",
      "eloquent",
      "resilience",
      "innovative",
      "paramount",
      "meticulous",
      "sophisticated",
      "profound",
      "ambiguous",
      "compelling",
      "unprecedented",
      "comprehensive",
      "substantial",
      "intricate",
      "prominent",
      "elaborate",
      "authentic",
      "pivotal",
      "remarkable",
      "exceptional",
      "magnificent",
      "extraordinary",
      "phenomenal",
      "quintessential",
      "momentous",
      "tremendous",
      "distinguished",
      "exemplary",
      "outstanding",
      "magnificent",
      "breakthrough",
      "revolutionary",
      "transformative",
      "enlightening",
      "captivating",
      "fascinating",
      "intriguing",
      "perplexing",
      "bewildering",
      "astonishing",
      "astounding",
      "stupendous",
      "incredible",
      "unbelievable",
      "miraculous",
      "spectacular",
      "breathtaking",
      "awe-inspiring",
      "overwhelming",
      "exhilarating",
      "invigorating",
      "rejuvenating",
      "revitalizing",
      "energizing",
    ];

    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const seed = dateString
      .split("-")
      .reduce((acc, num) => acc + parseInt(num), 0);
    const wordIndex = seed % words.length;

    return words[wordIndex];
  };

  const wordOfTheDay = getWordOfTheDay();

  const handleWordOfDayClick = () => {
    navigate(`/dashboard/dictionary?word=${wordOfTheDay}`);
  };

  const features = [
    {
      id: "flashcards",
      icon: Copy,
      title: "Flashcards",
      description: "Tạo và ôn tập từ vựng",
      color: "bg-blue-500",
      comingSoon: false,
      path: "/dashboard/flashcards",
    },
    {
      id: "dictionary",
      icon: BookOpen,
      title: "Dictionary",
      description: "Tra từ điển tiếng Anh",
      color: "bg-green-500",
      comingSoon: false,
      path: "/dashboard/dictionary",
    },
    {
      id: "translator",
      icon: Languages,
      title: "Live Translator",
      description: "Dịch thuật trực tiếp",
      color: "bg-orange-500",
      comingSoon: false,
      path: "/dashboard/translator",
    },
    {
      id: "games",
      icon: GamepadIcon,
      title: "Games & Quizzes",
      description: "Học qua trò chơi vui nhộn",
      color: "bg-purple-500",
      comingSoon: false,
      path: "/dashboard/games",
    },
    {
      id: "ielts",
      icon: GraduationCap,
      title: "IELTS Practice",
      description: "Luyện thi IELTS hiệu quả",
      color: "bg-red-500",
      comingSoon: false,
      path: "/dashboard/ielts",
    },
  ];

  const handleFeatureClick = (feature) => {
    if (feature.comingSoon) {
      alert("Tính năng sắp ra mắt!");
      return;
    }
    navigate(feature.path);
    setMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/dashboard/flashcards/study/")) return "Học tập";
    if (path.startsWith("/dashboard/flashcards/edit/"))
      return "Chỉnh sửa bộ thẻ";
    if (path === "/dashboard/flashcards") return "Flashcards";
    if (path === "/dashboard/dictionary") return "Dictionary";
    if (path === "/dashboard/games") return "Games & Quizzes";
    if (path === "/dashboard/translator") return "Live Translator";
    if (path === "/dashboard/ielts") return "IELTS Practice";
    if (path.startsWith("/dashboard/ielts/")) return "IELTS Practice";
    return "Dashboard";
  };

  const getBackPath = () => {
    const path = location.pathname;
    if (
      path.startsWith("/dashboard/flashcards/study/") ||
      path.startsWith("/dashboard/flashcards/edit/")
    ) {
      return "/dashboard/flashcards";
    }
    if (path.startsWith("/dashboard/ielts/")) {
      return "/dashboard/ielts";
    }
    return "/dashboard";
  };

  const isHomePage = location.pathname === "/dashboard";

  const renderHomeContent = () => (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Xin chào, {user?.user_metadata?.name || "bạn"}! 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sẵn sàng học tiếng Anh hôm nay? Hãy chọn một hoạt động để bắt đầu.
            </p>
          </div>
          <div className="ml-4 sm:ml-6 flex-shrink-0">
            <img
              src={Logo}
              alt="Band 9 Buddy Logo"
              className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div
          onClick={handleWordOfDayClick}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-4 sm:p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium opacity-90">
                  Word of the Day
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">
                {wordOfTheDay}
              </h3>
              <p className="text-xs sm:text-sm opacity-80">
                Click to explore this word's meaning, pronunciation, and
                examples
              </p>
            </div>
            <div className="text-right">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 opacity-75" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.slice(0, 3).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg text-white mb-4`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>

                  {feature.comingSoon ? (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sắp ra mắt
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFeatureClick(feature)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Bắt đầu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.slice(3, 5).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg text-white mb-4`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>

                  {feature.comingSoon ? (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sắp ra mắt
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFeatureClick(feature)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Bắt đầu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Back button - icon only on mobile */}
              {!isHomePage && (
                <button
                  onClick={() => navigate(getBackPath())}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">Quay lại</span>
                </button>
              )}

              {/* Logo/Brand - shorter on mobile */}
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                <span className="hidden sm:inline">Band 9 Buddy</span>
                <span className="sm:hidden">B9B</span>
              </h1>

              {/* Page title - hidden on small mobile */}
              {!isHomePage && (
                <>
                  <span className="hidden md:inline text-gray-400">•</span>
                  <span className="hidden md:inline text-lg font-medium text-gray-700">
                    {getPageTitle()}
                  </span>
                </>
              )}
            </div>

            {/* Right side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">
                  {user?.user_metadata?.name || user?.email || "User"}
                </span>
              </div>

              <button
                onClick={() => navigate("/dashboard/settings")}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>

            {/* Right side - Mobile (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-3">
              {/* User info */}
              <div className="flex items-center space-x-3 pb-3 border-b">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.user_metadata?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Quick navigation */}
              <div className="space-y-2">
                {features.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureClick(feature)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{feature.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-left text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || renderHomeContent()}
      </main>
    </div>
  );
};

export default Dashboard;
