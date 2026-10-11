import { Link, useLocation } from "react-router";
import { IconArrowLeft } from "@tabler/icons-react";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Auth() {
  const { state } = useLocation();
  const isLogin = state?.mode !== "register";

  return (
    <main className="min-h-screen bg-landing bg-cover bg-center bg-fixed font-word">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex w-fit items-center text-white gap-2 transition-colors duration-200 hover:text-cyan-400">
          <IconArrowLeft size={24} />
          Back to Home
        </Link>
      </div>
      <div className="relative w-full max-w-sm text-white bg-black/60 p-8 overflow-hidden rounded-xl backdrop-blur-sm">
        <div className={`absolute -top-235 left-6/5 size-250 -translate-x-1/2 rounded-full ${isLogin ? "bg-cyan-500" : "bg-yellow-500"}`} />
        <div className="relative">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </main>
  )
}