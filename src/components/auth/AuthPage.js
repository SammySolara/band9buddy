// src/pages/AuthPage.js
import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState("login"); // 'login', 'register', 'forgot'

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

export default AuthPage;
