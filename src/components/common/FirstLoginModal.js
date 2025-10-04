// src/components/common/FirstLoginModal.js
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";

const FirstLoginModal = () => {
  const { completeFirstLogin, isFirstLogin, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Show modal when user is loaded and it's their first login
  useEffect(() => {
    if (user && isFirstLogin) {
      setIsVisible(true);
    }
  }, [user, isFirstLogin]);

  const handleClose = async () => {
    // First hide the modal
    setIsVisible(false);
    // Then update the backend to mark first login as complete
    await completeFirstLogin();
  };

  // Don't render anything if not first login or not visible
  if (!isFirstLogin || !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Chào mừng đến với Band 9 Buddy!
          </h2>
          <p className="text-gray-600">
            Bắt đầu hành trình học tiếng Anh của bạn
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Học với Flashcards
              </h3>
              <p className="text-gray-600 text-sm">
                Tạo và học từ vựng hiệu quả với hệ thống flashcards thông minh
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Chơi trò chơi học từ vựng
              </h3>
              <p className="text-gray-600 text-sm">
                Củng cố và ghi nhớ từ mới qua các trò chơi vui nhộn và thử thách
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Luyện thi IELTS</h3>
              <p className="text-gray-600 text-sm">
                Truy cập tài liệu và bài tập luyện thi IELTS chất lượng cao
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Từ điển & Dịch thuật
              </h3>
              <p className="text-gray-600 text-sm">
                Tra từ điển đầy đủ và dịch trực tiếp khi cần
              </p>
            </div>
          </div>

          {/* Quick Define Feature */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                ✨
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Mẹo sử dụng: Quick Define
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Bôi đen bất kỳ từ tiếng Anh nào trên trang web và:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Trên máy tính:</strong> Nhấp chuột phải để tra
                      nghĩa nhanh
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Trên điện thoại:</strong> Chỉ cần bôi đen để xem
                      nghĩa
                    </span>
                  </li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">
                  Thêm từ vào flashcard set ngay lập tức! Hãy thử bôi đen từ "
                  <span className="font-semibold text-indigo-600">
                    serendipity
                  </span>
                  " trong câu này.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
        >
          Bắt đầu học ngay!
        </button>
      </div>
    </div>
  );
};

export default FirstLoginModal;
