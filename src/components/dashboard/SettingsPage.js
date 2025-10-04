import { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Loader,
  Trash2,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // Handle profile picture upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("error", "Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showMessage("error", "Kích thước ảnh phải nhỏ hơn 4MB");
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Delete old avatar if exists
      if (user?.user_metadata?.avatar_url) {
        const oldPath = user.user_metadata.avatar_url
          .split("/")
          .slice(-2)
          .join("/");
        await supabase.storage.from("avatars").remove([oldPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setProfileData((prev) => ({ ...prev, avatar_url: publicUrl }));
      showMessage("success", "Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      showMessage("error", "Có lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!profileData.name.trim()) {
      showMessage("error", "Tên hiển thị không được để trống!");
      return;
    }

    setLoading(true);

    try {
      // Update name
      const { error: nameError } = await supabase.auth.updateUser({
        data: { name: profileData.name.trim() },
      });

      if (nameError) throw nameError;

      // Check if email changed
      if (profileData.email !== user.email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
          showMessage("error", "Email không hợp lệ!");
          setLoading(false);
          return;
        }

        const { data, error: emailError } = await supabase.auth.updateUser({
          email: profileData.email,
        });

        if (emailError) throw emailError;

        showMessage(
          "success",
          "Đã gửi email xác nhận đến địa chỉ mới! Vui lòng kiểm tra hộp thư và xác nhận để hoàn tất thay đổi."
        );
      } else {
        showMessage("success", "Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Profile update error:", error);

      // Handle specific error cases
      if (error.message?.includes("email")) {
        showMessage("error", "Email đã được sử dụng hoặc không hợp lệ.");
      } else {
        showMessage("error", error.message || "Có lỗi xảy ra khi cập nhật.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setPasswordData({ newPassword: "", confirmPassword: "" });
      showMessage("success", "Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Password reset error:", error);
      showMessage("error", error.message || "Có lỗi khi đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!"
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "Xác nhận lần cuối: Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Tiếp tục?"
    );

    if (!doubleConfirm) return;

    setLoading(true);
    try {
      const userId = user.id;

      // Delete user's data from database tables
      // Uncomment and modify based on your database schema:
      await supabase.from('flashcards').delete().eq('user_id', userId);
      await supabase.from("flashcards_sets").delete().eq("user_id", userId);
      await supabase.from('study_sessions').delete().eq('user_id', userId);
      await supabase.from('test_results').delete().eq('user_id', userId);

      // Delete avatar from storage if exists
      if (user?.user_metadata?.avatar_url) {
        const avatarPath = user.user_metadata.avatar_url
          .split("/")
          .slice(-2)
          .join("/");
        await supabase.storage.from("avatars").remove([avatarPath]);
      }

      // Try to delete user account using RPC function
      const { error: deleteError } = await supabase.rpc("delete_user");

      if (deleteError) {
        console.error("Delete user error:", deleteError);

        // If RPC doesn't exist, inform user to contact support
        showMessage(
          "error",
          "Không thể xóa tài khoản tự động. Vui lòng liên hệ hỗ trợ để được trợ giúp xóa tài khoản."
        );
        setLoading(false);
        return;
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();

      showMessage("success", "Tài khoản đã được xóa thành công!");

      // Redirect to home page after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Account deletion error:", error);
      showMessage(
        "error",
        "Có lỗi khi xóa tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ."
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "danger", label: "Vùng nguy hiểm", icon: AlertCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
        <p className="text-gray-600">
          Quản lý thông tin tài khoản và tùy chọn của bạn
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                    {profileData.avatar_url ? (
                      <img
                        src={profileData.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profileData.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4 text-gray-700" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ảnh đại diện</h3>
                  <p className="text-sm text-gray-600">
                    JPG, PNG, GIF. Tối đa 4MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên hiển thị
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nhập tên của bạn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Nếu thay đổi email, bạn sẽ nhận được email xác nhận. Email mới
                  chỉ có hiệu lực sau khi xác nhận.
                </p>
              </div>

              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Đổi mật khẩu
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ít nhất 6 ký tự"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePasswordReset}
                disabled={
                  loading ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Cập nhật mật khẩu</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Xóa tài khoản
                    </h3>
                    <p className="text-sm text-red-800 mb-4">
                      Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh
                      viễn. Hành động này không thể hoàn tác.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {loading ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-5 w-5" />
                          <span>Xóa tài khoản của tôi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
