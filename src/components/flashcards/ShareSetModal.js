// src/components/flashcards/ShareSetModal.js
import { useState } from "react";
import { createPortal } from "react-dom";
import { Share2, X, Mail, Check, AlertCircle, Loader } from "lucide-react";

const ShareSetModal = ({ set, onClose, onShare }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await onShare(set.id, email);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Không thể chia sẻ bộ thẻ");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const setColor = set.color || "#3B82F6";

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: setColor + "20" }}
            >
              <Share2 className="h-5 w-5" style={{ color: setColor }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Chia sẻ bộ thẻ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Set Info */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: setColor + "10" }}
        >
          <h4 className="font-medium text-gray-900 mb-1">{set.title}</h4>
          <p className="text-sm text-gray-600">{set.cards?.length || 0} thẻ</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Chia sẻ thành công!</p>
              <p className="text-green-700 text-sm mt-1">
                Bộ thẻ đã được gửi đến {email}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Lỗi</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleShare}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email người nhận
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={loading || success}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Người nhận sẽ có một bản sao độc lập của bộ thẻ này
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              style={{
                backgroundColor: loading || success ? "#9CA3AF" : setColor,
              }}
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : success ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã gửi</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ShareSetModal;
