"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { VerifyEmailCredentials } from "@/lib/types/user";
import { verifyEmailSchema } from "@/lib/schemas";
import { useVerifyEmail } from "@/lib/query/hooks";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useVerifyEmail();
  const { user } = useAuthStore();

  const form = useForm<VerifyEmailCredentials>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: token || "",
    },
  });

  // Auto-verify when component mounts if token exists
  useEffect(() => {
    if (token && !verificationAttempted) {
      setVerificationAttempted(true);
      verifyEmail({ token });
    }
  }, [token, verificationAttempted, verifyEmail]);

  // Manual verification handler
  const onSubmit = (data: VerifyEmailCredentials) => {
    verifyEmail(data);
  };

  // Loading State
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-slate-800">
                  MoneyStitch
                </span>
              </div>

              <div className="mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Verifying Your Email
              </h1>
              <p className="text-slate-600 text-lg">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Email Verified!
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                Your email has been successfully verified. You can now access
                all features of MoneyStitch.
              </p>

              <Link
                href={"/dashboard"}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Verification Failed
              </h1>
              <p className="text-slate-600 text-lg mb-6">
                {error?.message ||
                  "The verification link is invalid or has expired."}
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      What can you do?
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 list-disc ml-4">
                      <li>Request a new verification email</li>
                      <li>Check if you used the latest verification link</li>
                      <li>Contact support if the problem persists</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={"/"}
                  className="w-full bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Token State (Manual Entry)
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Verify Your Email
              </h1>
              <p className="text-slate-600 text-lg">
                Enter your verification token below
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Verification Token
                </label>
                <input
                  {...form.register("token")}
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                  placeholder="Enter your verification token"
                />
                {form.formState.errors.token && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.formState.errors.token.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Can't find your token?
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Check your email for the verification link or request a
                      new one.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-20 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                disabled={isPending}
              >
                <span>{isPending ? "Verifying" : "Verify Email"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmailForm;
