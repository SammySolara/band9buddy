// src/components/auth/ResetPasswordForm.js - DEBUGGED VERSION
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Validate recovery session with better error handling
    const validateSession = async () => {
      try {
        console.log("Full URL:", window.location.href);
        console.log("Hash:", window.location.hash);

        // Wait for Supabase to process the hash
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check URL for recovery token
        const hash = window.location.hash.substring(1);
        const urlParams = new URLSearchParams(hash);
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");
        const type = urlParams.get("type");

        console.log("URL Params:", {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          type,
        });

        // Check if we have a session (Supabase auto-processes the tokens)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("Session:", { hasSession: !!session, error: sessionError });

        // If we have a session, we're good to go
        if (session) {
          console.log("Valid recovery session found");
          setIsValidating(false);
          return;
        }

        // If no session but we have tokens in URL, try to set the session manually
        if (accessToken && refreshToken) {
          console.log("Attempting to set session from URL tokens");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error setting session:", error);
            setError(
              "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới."
            );
          } else {
            console.log("Session set successfully");
          }
          setIsValidating(false);
          return;
        }

        // No session and no tokens - invalid link
        setError(
          "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới."
        );
        setIsValidating(false);
      } catch (err) {
        console.error("Session validation error:", err);
        setError("Có lỗi xảy ra khi xác thực. Vui lòng thử lại.");
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      setLoading(false);
      return;
    }

    try {
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        if (updateError.message.includes("session")) {
          setError(
            "Phiên làm việc đã hết hạn. Vui lòng yêu cầu link đặt lại mật khẩu mới."
          );
        } else {
          setError(updateError.message);
        }
        setLoading(false);
        return;
      }

      console.log("Password updated successfully");

      // Sign out to clear the recovery session
      await supabase.auth.signOut();

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Password update error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Đang xác thực...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
        <div className="text-lg font-medium mb-2">
          Mật khẩu đã được đặt lại thành công!
        </div>
        <p className="text-sm">Đang chuyển hướng đến trang đăng nhập...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đặt lại mật khẩu
        </h2>
        <p className="text-gray-600 text-sm">Nhập mật khẩu mới của bạn</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <p>{error}</p>
          {error.includes("hết hạn") && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-2 text-red-800 underline hover:text-red-900"
            >
              Quay lại đăng nhập để yêu cầu link mới
            </button>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu mới / New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={!!error}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ít nhất 6 ký tự"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Xác nhận mật khẩu / Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={!!error}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !!error}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
