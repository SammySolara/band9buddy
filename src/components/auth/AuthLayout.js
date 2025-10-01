// src/components/auth/AuthLayout.js
import AnimatedBackground from "../common/AnimatedBackground";
import Logo from "../../assets/B9Logo.png";

const AuthLayout = ({ children }) => {
  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-lg relative z-10">
          <div className="flex justify-center mb-8">
            <img
              src={Logo}
              alt="Band 9 Buddy Logo"
              className="w-60 h-60 object-contain drop-shadow-2xl"
            />
          </div>
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-1 pr-1">
                Band 9 Buddy
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Học tiếng Anh hiệu quả với flashcards và IELTS
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default AuthLayout;
