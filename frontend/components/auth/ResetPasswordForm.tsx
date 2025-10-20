"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Password validation criteria
  const passwordCriteria = {
    minLength: resetData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(resetData.password),
    hasLowerCase: /[a-z]/.test(resetData.password),
    hasNumber: /[0-9]/.test(resetData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(resetData.password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const passwordsMatch =
    resetData.password === resetData.confirmPassword &&
    resetData.confirmPassword !== "";

  const handleResetPassword = () => {
    if (!isPasswordValid) {
      alert("Please meet all password requirements");
      return;
    }
    if (!passwordsMatch) {
      alert("Passwords do not match");
      return;
    }
    console.log("Reset password:", resetData);
    setIsSubmitted(true);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const validCount = Object.values(passwordCriteria).filter(Boolean).length;
    if (validCount <= 2)
      return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (validCount <= 4)
      return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
            {/* Success State */}
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Password Reset Successful!
              </h1>
              <p className="text-slate-600 mb-8 text-lg">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>

              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-slate-800">
                MoneyStitch
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Create New Password
            </h1>
            <p className="text-slate-600 text-lg">
              Enter your new password below
            </p>
          </div>

          {/* Reset Password Form */}
          <div className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={resetData.password}
                  onChange={(e) =>
                    setResetData({ ...resetData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                  placeholder="Create a strong password"
                  required
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

              {/* Password Strength Indicator */}
              {resetData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">
                      Password Strength:
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        passwordStrength.label === "Weak"
                          ? "text-red-600"
                          : passwordStrength.label === "Medium"
                          ? "text-yellow-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${passwordStrength.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-slate-700 mb-3">
                Password Requirements:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {passwordCriteria.minLength ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordCriteria.minLength
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordCriteria.hasUpperCase ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordCriteria.hasUpperCase
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordCriteria.hasLowerCase ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordCriteria.hasLowerCase
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordCriteria.hasNumber ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordCriteria.hasNumber
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    One number
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordCriteria.hasSpecialChar ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordCriteria.hasSpecialChar
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    One special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={resetData.confirmPassword}
                  onChange={(e) =>
                    setResetData({
                      ...resetData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-slate-700"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {resetData.confirmPassword && !passwordsMatch && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Passwords do not match</span>
                </div>
              )}
              {passwordsMatch && resetData.confirmPassword && (
                <div className="mt-2 flex items-center space-x-2 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Passwords match</span>
                </div>
              )}
            </div>

            {/* Reset Password Button */}
            <button
              onClick={handleResetPassword}
              disabled={!isPasswordValid || !passwordsMatch}
              className={`w-full py-3 px-4 rounded-xl font-semibold focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-20 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${
                isPasswordValid && passwordsMatch
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Reset Password</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              Remember your password?{" "}
              <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
