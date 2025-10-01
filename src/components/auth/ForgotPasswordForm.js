// src/components/auth/ForgotPasswordForm.js
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { authHelpers } from "../../services/supabase";

const ForgotPasswordForm = ({ onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await authHelpers.resetPassword(email);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
          <div className="text-lg font-medium mb-2">Email đã được gửi!</div>
          <p className="text-sm">
            Vui lòng kiểm tra email của bạn để đặt lại mật khẩu. Link sẽ hết hạn
            sau 1 giờ.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleForm}
          className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quên mật khẩu?
        </h2>
        <p className="text-gray-600 text-sm">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Nhập email của bạn"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
      </button>

      <button
        type="button"
        onClick={onToggleForm}
        className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700 font-medium py-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại đăng nhập
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
