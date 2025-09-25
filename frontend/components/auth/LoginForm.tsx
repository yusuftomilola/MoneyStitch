"use client";
import { useLoginUser } from "@/lib/query/hooks";
import { loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const loginUserMutation = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);
  type LoginUserFormFields = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginFormSubmit: SubmitHandler<LoginUserFormFields> = async (
    data
  ) => {
    try {
      loginUserMutation.mutate(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-lg">
              Sign in to your MoneyStitch account
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(handleLoginFormSubmit)}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-semibold text-slate-700 mb-2"
                htmlFor="email"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-semibold text-slate-700 mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <Link href="/forgot-password">
                <button
                  type="button"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-20 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
              disabled={loginUserMutation.isPending}
            >
              {loginUserMutation.isPending ? "Logging In..." : "Log In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link href="/register">
                <button className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">
                  Sign up here
                </button>
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link href="/">
              <button className="w-full text-slate-500 hover:text-slate-700 flex items-center justify-center space-x-2 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to MoneyStitch</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// return (
//   <form onSubmit={handleSubmit(handleLoginFormSubmit)}>
//     <div>
//       <label htmlFor="email">Email: </label>
//       <input
//         type="email"
//         {...register("email")}
//         name="email"
//         placeholder="Enter your email"
//       />
//       {errors.email && (
//         <span className="text-red-500">{errors.email.message}</span>
//       )}
//     </div>
//     <div>
//       <label htmlFor="password">Password: </label>
//       <input
//         type="password"
//         {...register("password")}
//         name="password"
//         placeholder="Enter your password"
//       />
//       {errors.password && (
//         <span className="text-red-500">{errors.password.message}</span>
//       )}
//     </div>

//     <button type="submit" disabled={loginUserMutation.isPending}>
//       {loginUserMutation.isPending ? "Logging In..." : "Log In"}
//     </button>
//   </form>
// );
