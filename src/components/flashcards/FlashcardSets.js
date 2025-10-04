import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Play, Edit3, Trash2, BookOpen, Share2 } from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";
import ShareSetModal from "./ShareSetModal";

const FlashcardSets = () => {
  const navigate = useNavigate();
  const { sets, deleteSet, shareSet } = useFlashcards();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [setToShare, setSetToShare] = useState(null);

  const handleCreateNew = () => {
    navigate("/dashboard/flashcards/edit/new");
  };

  const handleEditSet = (set) => {
    navigate(`/dashboard/flashcards/edit/${set.id}`);
  };

  const handleStudySet = (set) => {
    navigate(`/dashboard/flashcards/study/${set.id}`);
  };

  const handleDeleteClick = (set) => {
    setSetToDelete(set);
    setShowDeleteModal(true);
  };

  const handleShareClick = (set) => {
    setSetToShare(set);
    setShowShareModal(true);
  };

  const confirmDelete = () => {
    if (setToDelete) {
      deleteSet(setToDelete.id);
      setShowDeleteModal(false);
      setSetToDelete(null);
    }
  };

  const handleShare = async (setId, email) => {
    const result = await shareSet(setId, email);
    return result;
  };

  // Helper function to get lighter version of a color for backgrounds
  const lightenColor = (color, amount = 0.9) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.round(r + (255 - r) * amount);
    const newG = Math.round(g + (255 - g) * amount);
    const newB = Math.round(b + (255 - b) * amount);

    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  // Helper function to determine if color is light or dark for text contrast
  const isLightColor = (color) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bộ thẻ của bạn</h2>
          <p className="text-gray-600 mt-1">
            Quản lý và học tập với các bộ flashcard
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Tạo bộ mới</span>
        </button>
      </div>

      {/* Sets Grid */}
      {sets.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bộ thẻ nào
          </h3>
          <p className="text-gray-600 mb-6">
            Tạo bộ flashcard đầu tiên để bắt đầu học
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Tạo bộ đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => {
            const setColor = set.color || "#3B82F6";
            const lightBg = lightenColor(setColor, 0.95);
            const mediumBg = lightenColor(setColor, 0.85);
            const textColor = isLightColor(setColor) ? "#000000" : "#FFFFFF";

            return (
              <div
                key={set.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 overflow-hidden"
                style={{ borderColor: setColor }}
              >
                {/* Color header bar */}
                <div className="h-2" style={{ backgroundColor: setColor }} />

                {/* Card content */}
                <div className="p-6">
                  {/* Title section with color accent */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                          style={{
                            backgroundColor: setColor,
                            borderColor: setColor,
                          }}
                        />
                        <h3
                          className="text-lg font-bold line-clamp-1"
                          style={{ color: setColor }}
                        >
                          {set.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                        {set.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>

                  {/* Stats section with color accent */}
                  <div
                    className="rounded-lg p-3 mb-4"
                    style={{ backgroundColor: lightBg }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {set.cards?.length || 0} thẻ
                      </span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: setColor }}
                        />
                        <span className="text-xs text-gray-500">
                          {new Date(set.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => handleStudySet(set)}
                      disabled={!set.cards?.length}
                      className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: set.cards?.length
                          ? setColor
                          : "#D1D5DB",
                        color: set.cards?.length ? textColor : "#6B7280",
                      }}
                    >
                      <Play className="h-4 w-4" />
                      <span>Học</span>
                    </button>

                    <button
                      onClick={() => handleEditSet(set)}
                      className="flex items-center justify-center p-2.5 text-gray-600 hover:text-gray-800 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: mediumBg,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = lightBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = mediumBg)
                      }
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Secondary actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShareClick(set)}
                      disabled={!set.cards?.length}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border"
                      style={{
                        borderColor: set.cards?.length ? setColor : "#D1D5DB",
                        color: set.cards?.length ? setColor : "#9CA3AF",
                        backgroundColor: "white",
                      }}
                      title={
                        set.cards?.length
                          ? "Chia sẻ bộ thẻ"
                          : "Thêm thẻ để chia sẻ"
                      }
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Chia sẻ</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClick(set)}
                      className="flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-1 opacity-30"
                  style={{ backgroundColor: setColor }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Xóa bộ thẻ
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa bộ thẻ "{setToDelete?.title}"? Hành động này
              không thể hoàn tác.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && setToShare && (
        <ShareSetModal
          set={setToShare}
          onClose={() => {
            setShowShareModal(false);
            setSetToShare(null);
          }}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default FlashcardSets;
