// src/App.js
import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthLayout from './components/auth/AuthLayout'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Dashboard from './components/dashboard/Dashboard'
import LoadingSpinner from './components/common/LoadingSpinner'

// Auth wrapper component
const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Dashboard />
  }

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm onToggleForm={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onToggleForm={() => setIsLogin(true)} />
      )}
    </AuthLayout>
  )
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AuthWrapper />
      </div>
    </AuthProvider>
  )
}

export default App