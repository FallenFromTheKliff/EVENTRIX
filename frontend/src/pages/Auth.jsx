import { useLocation } from "react-router";
import EVENTRIX from "../assets/images/EVENTRIX-Title.png";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Auth() {
  const { state } = useLocation();
  const isLogin = state?.mode !== "register";

  return (
    <main className="flex h-dvh items-center justify-center overflow-hidden bg-landing bg-cover bg-center px-6">
      <title>{isLogin ? "Log in to" : "Join us at"} EVENTRIX</title>
      <div className="flex w-full max-w-135 flex-col items-center gap-5 transition-opacity duration-500 starting:opacity-0">
        <img src={EVENTRIX} alt="EVENTRIX" className="w-84 lg:w-96" />
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 p-8 sm:p-10 text-white shadow-2xl shadow-black">
          <div className={`absolute -top-235 left-11/10 size-255 -translate-x-1/2 rounded-full ${isLogin ? "bg-cyan-500" : "bg-yellow-500"}`} />
          <div className="relative">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </main>
  )
}