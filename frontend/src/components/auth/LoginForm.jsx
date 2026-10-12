import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { IconBrandApple, IconBrandFacebook, IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";

import { useAuth } from "../../context/AuthContext";
import useLoadingText from "../ui/useLoadingText";
import ConfirmModal from "../ui/ConfirmModal";

const inputStyle = "w-full bg-white/15 rounded-md p-2 mt-1 focus:outline-2 focus:outline-cyan-500";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, runner, texter } = useLoadingText();
  const { register, handleSubmit, clearErrors, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmission = (data) => runner(async () => {
    clearErrors("root.serverError");
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      const response = error.response?.data;
      setSuccessMessage({ type: "error", message: response ? response?.message : "Unable to sign in!" })
    }
  });

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">SIGN IN</h2>
      <form onSubmit={handleSubmit(onSubmission)} noValidate className="mt-4 space-y-3">
        <div>
          <label htmlFor="email" className="text-sm">Email</label>
          <input 
            id="email" 
            placeholder="Enter your email" 
            type="email" 
            className={inputStyle} 
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address!"
              }
            })} 
          />
          <p className="text-red-500 text-sm h-5 mt-1">{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password" className="text-sm">Password</label>
          <div className="relative flex">
            <input id="password" placeholder="Enter your password" type={showPassword ? "text" : "password"} className={`${inputStyle} pr-10`} {...register("password", { required: "Password is required!" })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute flex items-center text-gray-300 top-1 right-3 bottom-0 cursor-pointer transition-colors duration-200 hover:text-white">
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          <p className="text-red-500 text-sm h-5 mt-1">{errors.password?.message}</p>
        </div>
        <button type="submit" disabled={loading} className="bg-cyan-500 font-bold w-full rounded-md py-2 cursor-pointer transition duration-200 hover:brightness-90 disabled:opacity-50">
          {texter("Sign In", "Signing In")}
        </button>
        <label className="flex items-center text-sm gap-2">
          <input type="checkbox" className="size-4 accent-cyan-500 cursor-pointer" {...register("rememberMe")} />
          Remember me
        </label>
      </form>
      <hr className="border-gray-500 my-3" />
      <p className="text-sm text-center mb-3">or</p>
      <div className="flex gap-2">
        <button className="flex flex-1 justify-center text-red-600 bg-white py-1.5 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandGoogle size={24} />
        </button>
        <button className="flex flex-1 justify-center text-blue-600 bg-white py-1.5 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandFacebook size={24} />
        </button>
        <button className="flex flex-1 justify-center text-gray-900 bg-white py-1.5 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandApple size={24} />
        </button>
      </div>
      <p className="text-sm text-center mt-6">
        Don't have an account?{" "}
        <Link to="/auth" state={{ mode: "register" }} replace className="text-yellow-400 hover:underline">
          Register here.
        </Link>
      </p>
      {successMessage && <ConfirmModal type={successMessage.type} message={successMessage.message} onClose={() => setSuccessMessage(null)} />}
    </div>
  )
}