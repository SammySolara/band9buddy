import { useState, useEffect } from "react";
import { X, Mail, Users, Trash2, Check, AlertCircle } from "lucide-react";
import { supabase } from "../../services/supabase";

const ShareModal = ({ setId, setTitle, onClose }) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingShares, setLoadingShares] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadShares();
  }, [setId]);

  const loadShares = async () => {
    try {
      setLoadingShares(true);
      const { data, error } = await supabase
        .from("flashcard_set_shares")
        .select("*")
        .eq("set_id", setId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShares(data || []);
    } catch (err) {
      console.error("Error loading shares:", err);
    } finally {
      setLoadingShares(false);
    }
  };

  const handleShare = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.email === email.toLowerCase()) {
      setError("Bạn không thể chia sẻ với chính mình");
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      const existingShare = shares.find(
        (share) => share.shared_with_email.toLowerCase() === email.toLowerCase()
      );

      if (existingShare) {
        setError("Bộ thẻ đã được chia sẻ với email này");
        setLoading(false);
        return;
      }

      const { error: shareError } = await supabase
        .from("flashcard_set_shares")
        .insert({
          set_id: setId,
          owner_id: user.id,
          shared_with_email: email.toLowerCase(),
          shared_with_user_id: existingUser?.id || null,
          permission: permission,
        });

      if (shareError) throw shareError;

      setSuccess(`Đã chia sẻ với ${email}`);
      setEmail("");
      setPermission("view");
      loadShares();
    } catch (err) {
      console.error("Error sharing:", err);
      setError("Có lỗi xảy ra khi chia sẻ");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async (shareId) => {
    try {
      const { error } = await supabase
        .from("flashcard_set_shares")
        .delete()
        .eq("id", shareId);

      if (error) throw error;

      setSuccess("Đã xóa quyền truy cập");
      loadShares();
    } catch (err) {
      console.error("Error removing share:", err);
      setError("Có lỗi xảy ra khi xóa quyền truy cập");
    }
  };

  const handleUpdatePermission = async (shareId, newPermission) => {
    try {
      const { error } = await supabase
        .from("flashcard_set_shares")
        .update({ permission: newPermission })
        .eq("id", shareId);

      if (error) throw error;

      setSuccess("Đã cập nhật quyền");
      loadShares();
    } catch (err) {
      console.error("Error updating permission:", err);
      setError("Có lỗi xảy ra khi cập nhật quyền");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Chia sẻ bộ thẻ
            </h2>
            <p className="text-sm text-gray-600 mt-1">{setTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">{success}</p>
              <button
                onClick={() => setSuccess("")}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email người nhận
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleShare()}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quyền truy cập
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPermission("view")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    permission === "view"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">Xem</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Chỉ xem và học
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPermission("edit")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    permission === "edit"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">Chỉnh sửa</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Xem và chỉnh sửa
                  </div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? "Đang chia sẻ..." : "Chia sẻ"}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Người có quyền truy cập
            </h3>

            {loadingShares ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : shares.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">Chưa chia sẻ với ai</p>
              </div>
            ) : (
              <div className="space-y-3">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {share.shared_with_email}
                        </div>
                        <div className="text-xs text-gray-500">
                          Chia sẻ lúc{" "}
                          {new Date(share.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={share.permission}
                        onChange={(e) =>
                          handleUpdatePermission(share.id, e.target.value)
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="view">Xem</option>
                        <option value="edit">Chỉnh sửa</option>
                      </select>

                      <button
                        onClick={() => handleRemoveShare(share.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa quyền truy cập"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
