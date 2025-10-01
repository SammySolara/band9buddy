import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import DashboardRoutes from "./components/dashboard/DashboardRoutes";
import LoadingSpinner from "./components/common/LoadingSpinner";
import GlobalDefineWrapper from "./components/common/GlobalDefineWrapper";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Auth Pages Component
const AuthPages = () => {
  const [activeForm, setActiveForm] = useState("login");
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      {activeForm === "login" && (
        <LoginForm
          onToggleForm={() => setActiveForm("register")}
          onForgotPassword={() => setActiveForm("forgot")}
        />
      )}
      {activeForm === "register" && (
        <RegisterForm onToggleForm={() => setActiveForm("login")} />
      )}
      {activeForm === "forgot" && (
        <ForgotPasswordForm onToggleForm={() => setActiveForm("login")} />
      )}
    </AuthLayout>
  );
};

// Reset Password Page Component - FIXED to check for recovery token
const ResetPasswordPage = () => {
  const { loading } = useAuth();
  const [isRecovery, setIsRecovery] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);

  useEffect(() => {
    // Check if this is a password recovery link
    const checkRecoveryStatus = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.substring(1));
      const type = urlParams.get("type");
      const hasAccessToken = urlParams.get("access_token");

      // It's a recovery if type=recovery OR if there's an access token in the URL
      setIsRecovery(type === "recovery" || !!hasAccessToken);
      setCheckingRecovery(false);
    };

    checkRecoveryStatus();
  }, []);

  if (loading || checkingRecovery) {
    return <LoadingSpinner />;
  }

  // Only redirect if NOT a recovery session
  // If it's a recovery session, ALWAYS show the reset form
  if (!isRecovery) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalDefineWrapper>
          <div className="App">
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<AuthPages />} />
              <Route path="/register" element={<AuthPages />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Dashboard routes - protected */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardRoutes />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </GlobalDefineWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
