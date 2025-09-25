"use client";
import { useRegisterUser } from "@/lib/query/hooks";
import { registerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import z from "zod";
import Link from "next/link";

export default function RegisterForm() {
  const createUserMutation = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  type RegisterUserFormFields = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterFormSubmit: SubmitHandler<
    RegisterUserFormFields
  > = async (data) => {
    try {
      createUserMutation.mutate(data);
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
              Create Account
            </h1>
            <p className="text-slate-600 text-lg">
              Start your financial journey
            </p>
          </div>

          {/* Register Form */}
          <form
            className="space-y-6"
            onSubmit={handleSubmit(handleRegisterFormSubmit)}
          >
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="firstname"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    {...register("firstname")}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                    placeholder="First name"
                  />
                </div>
                {errors.firstname && (
                  <span className="text-red-500">
                    {errors.firstname.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="lastname"
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    {...register("lastname")}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                    placeholder="Last name"
                  />
                </div>
                {errors.lastname && (
                  <span className="text-red-500">
                    {errors.lastname.message}
                  </span>
                )}
              </div>
            </div>

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
                  placeholder="Create a password"
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

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-20 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
            >
              {createUserMutation.isPending ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link href="/login">
                <button className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">
                  Sign in here
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
//   <form onSubmit={handleSubmit(handleRegisterFormSubmit)}>
//     <div>
//       <label htmlFor="firstname">Firstname: </label>
//       <input
//         type="text"
//         {...register("firstname")}
//         name="firstname"
//         placeholder="Enter first name"
//       />
//       {errors.firstname && (
//         <span className="text-red-500">{errors.firstname.message}</span>
//       )}
//     </div>
//     <div>
//       <label htmlFor="lastname">Lastname: </label>
//       <input
//         type="text"
//         {...register("lastname")}
//         name="lastname"
//         placeholder="Enter last name"
//       />
//       {errors.lastname && (
//         <span className="text-red-500">{errors.lastname.message}</span>
//       )}
//     </div>
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

//     <button type="submit" disabled={createUserMutation.isPending}>
//       {createUserMutation.isPending ? "Creating..." : "Create Account"}
//     </button>
//   </form>
// );
