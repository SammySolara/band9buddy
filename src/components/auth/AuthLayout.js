// src/components/auth/AuthLayout.js
import AnimatedBackground from '../common/AnimatedBackground'

const AuthLayout = ({ children }) => {
  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Band 9 Buddy
              </h1>
              <p className="text-gray-600 mt-2">
                Học tiếng Anh hiệu quả với flashcards và IELTS
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default AuthLayout