import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { IconBrandApple, IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";

import { useAuth } from "../../context/AuthContext";
import useLoadingText from "../ui/useLoadingText";

const inputStyle = "text-white w-full bg-white/15 rounded-md p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-500";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, runner, texter } = useLoadingText();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const onSubmission = (data) => runner(async () => {
    try {
      await login(data);
      navigate("/");
    } catch {
      setError("root.serverError", { message: "Invalid email or password!" });
    }
  });

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">SIGN IN</h2>
      <form onSubmit={handleSubmit(onSubmission)} noValidate className="mt-6 space-y-4">
        {errors.root?.serverError && (
          <div className="text-center text-red-500 bg-red-500/10 border border-red-500 p-2.5">
            {errors.root.serverError.message}
          </div>
        )}
        <div>
          <label htmlFor="email" className="text-sm">Email</label>
          <input id="email" type="email" className={inputStyle} {...register("email", { required: "Email is required!" })} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="text-sm">Password</label>
          <input id="password" type="password" className={inputStyle} {...register("password", { required: "Password is required!" })} />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="bg-cyan-500 font-bold w-full rounded-md py-2.5 cursor-pointer transition duration-200 hover:brightness-90 disabled:opacity-50">
          {texter("Sign In", "Signing In")}
        </button>
        <label className="flex items-center text-sm gap-2">
          <input type="checkbox" className="size-4 accent-cyan-500 cursor-pointer" {...register("rememberMe")} />
          Remember me
        </label>
      </form>
      <hr className="border-gray-500 my-4" />
      <p className="text-sm text-center mb-4">or</p>
      <div className="flex gap-2">
        <button className="flex flex-1 justify-center text-gray-900 bg-white py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandGoogle size={24} />
        </button>
        <button className="flex flex-1 justify-center text-blue-600 bg-white py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandFacebook size={24} />
        </button>
        <button className="flex flex-1 justify-center text-gray-900 bg-white py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
          <IconBrandApple size={24} />
        </button>
      </div>
      <p className="text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/auth" state={{ mode: "register" }} replace className="text-yellow-400 hover:underline">
          Register here.
        </Link>
      </p>
    </div>
  )
}