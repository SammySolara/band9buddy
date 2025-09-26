// src/components/common/LoadingSpinner.js
import AnimatedBackground from './AnimatedBackground'

const LoadingSpinner = () => {
  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              {/* Inner ring */}
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Band 9 Buddy</h2>
            <p className="text-white/80">Đang tải...</p>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default LoadingSpinner