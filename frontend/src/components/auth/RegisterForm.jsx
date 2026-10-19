import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { IconBrandApple, IconBrandFacebook, IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";

import { useAuth } from "../../context/AuthContext";

import useLoadingText from "../ui/useLoadingText";
import ConfirmModal from "../ui/ConfirmModal";

const inputStyle = "w-full bg-white/15 rounded-md p-3 mt-1 focus:outline-2 focus:outline-yellow-500";

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { loading, runner, texter } = useLoadingText();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmission = (data) => runner(async () => {
    try {
      await registerUser(data);
    } catch (error) {
      setErrorMessage({ type: "error", message: typeof error.response?.data === "string" ? error.response.data : "Failed to register account!" });
    }
  });

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">SIGN UP</h2>
      <form onSubmit={handleSubmit(onSubmission)} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm">Name</label>
          <input id="name" placeholder="Enter your full name" type="text" className={inputStyle} {...register("name", { required: "Name is required!" })} />
          <p className="text-red-500 text-sm min-h-5 mt-1">{errors.name?.message}</p>
        </div>
        <div>
          <label htmlFor="email" className="text-sm">Email</label>
          <input 
            id="email" 
            placeholder="Enter a valid email" 
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
          <p className="text-red-500 text-sm min-h-5 mt-1">{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="phoneNumber" className="text-sm">Contact No.</label>
          <input 
            id="phoneNumber" 
            placeholder="Must be 11 digits"
            type="text" 
            className={inputStyle} 
            {...register("phoneNumber", { 
              required: "Phone number is required!",
              pattern: { value: /^[0-9]{11}$/, message: "Phone number must be 11 digits!" },
              onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); } 
            })} 
          />
          <p className="text-red-500 text-sm min-h-5 mt-1">{errors.phoneNumber?.message}</p>
        </div>
        <div>
          <label htmlFor="password" className="text-sm">Password</label>
          <div className="relative flex">
            <input 
              id="password" 
              placeholder="Must have at least 8 characters" 
              type={showPassword ? "text" : "password"} 
              className={`${inputStyle} pr-10`} 
              {...register("password", {
                required: "Password is required!",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters!"
                }
              })} 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute flex items-center text-gray-300 top-1 right-3 bottom-0 cursor-pointer transition-colors duration-200 hover:text-white">
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          <p className="text-red-500 text-sm min-h-5 mt-1">{errors.password?.message}</p>
        </div>
        <button type="submit" disabled={loading} className="bg-yellow-500 font-bold w-full rounded-md py-4 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50">
          {texter("SIGN UP", "SIGNING UP")}
        </button>
      </form>
      <hr className="border-gray-500 my-4" />
      <p className="text-sm text-center mb-4">or</p>
      <div className="flex gap-2">
        <button className="flex flex-1 justify-center text-red-600 bg-white py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandGoogle size={24} />
        </button>
        <button className="flex flex-1 justify-center text-blue-600 bg-white py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandFacebook size={24} />
        </button>
        <button className="flex flex-1 justify-center text-gray-900 bg-white py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandApple size={24} />
        </button>
      </div>
      <p className="text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/auth" state={{ mode: "login" }} replace className="text-cyan-400 hover:underline">
          Login here.
        </Link>
      </p>
      {errorMessage && <ConfirmModal type={errorMessage.type} message={errorMessage.message} onClose={() => setErrorMessage(null)} />}
    </div>
  )
}