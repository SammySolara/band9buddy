// src/App.js
import { useState } from "react";
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
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm onToggleForm={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onToggleForm={() => setIsLogin(true)} />
      )}
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
