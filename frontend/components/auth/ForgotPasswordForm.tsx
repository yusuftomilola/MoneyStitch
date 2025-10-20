"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { forgotPasswordSchema } from "@/lib/schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "@/lib/query/hooks";

const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useForgotPassword();
  const { isSuccess, isPending } = forgotPasswordMutation;
  type ForgotPasswordFormFields = z.infer<typeof forgotPasswordSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<ForgotPasswordFormFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPasswordFormSubmit: SubmitHandler<
    ForgotPasswordFormFields
  > = async (data) => {
    console.log("From the form:", data);
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              {isSuccess ? "Check Your Email" : "Forgot Password"}
            </h1>
            <p className="text-slate-600 text-lg">
              {isSuccess
                ? "We've sent you instructions to reset your password"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {/* Forgot Password Form */}
          <form
            className="space-y-6"
            onSubmit={handleSubmit(handleForgotPasswordFormSubmit)}
          >
            {!isSuccess ? (
              <>
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Password Reset Instructions
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        We'll send you a secure link to reset your password.
                        Check your email and follow the instructions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Send Reset Link Button */}
                <button
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-20 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                  type="submit"
                  disabled={isPending}
                >
                  <span>
                    {isPending ? "Sending reset link" : "Send Reset Link"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-800  mb-2">
                        <span className="font-semibold">
                          If an account with that email exists,
                        </span>{" "}
                        a reset link has been sent.
                      </p>

                      <p className="text-sm text-emerald-700 leading-relaxed">
                        Please check your inbox at{" "}
                        <span className="font-semibold">{watch("email")}</span>{" "}
                        and follow the instructions to reset your password. The
                        link will expire in 1 hour.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700 font-medium mb-2">
                    Didn't receive the email?
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Wait a few minutes for the email to arrive</li>
                    <li>Contact support if you continue to have issues</li>
                  </ul>
                </div>
              </>
            )}
          </form>

          {/* Navigation Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-slate-600">
              Remember your password?{" "}
              <Link
                href={"/login"}
                className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                Sign in here
              </Link>
            </p>

            {!isSuccess && (
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link
                  href={"/register"}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  Create one now
                </Link>
              </p>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              href={"/"}
              className="w-full text-slate-500 hover:text-slate-700 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to MoneyStitch</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
