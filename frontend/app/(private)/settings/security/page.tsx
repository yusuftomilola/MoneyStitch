"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { changePasswordSchema } from "@/lib/schemas";
import { useChangePassword } from "@/lib/query/hooks/auth/useChangePassword";

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const SecuritySettingsPage = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    mutate: changePassword,
    isPending,
    isSuccess,
    error,
    isError,
  } = useChangePassword();

  const {
    watch,
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  // Password strength criteria
  const passwordCriteria = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const passwordStrength =
    Object.values(passwordCriteria).filter(Boolean).length;
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    try {
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      console.log("Password change request:", data);

      reset();
    } catch (error) {
      console.error("FRONTEND - Error changing password:", error);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Security Settings
        </h2>
        <p className="text-slate-600">
          Manage your password and account security
        </p>
      </div>

      {/* Security Info Banner */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Keep your account secure
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Use a strong, unique password and never share it with anyone. We
              recommend changing your password every 90 days.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Change Password
          </h3>

          {/* Current Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("currentPassword")}
                type={showCurrentPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all placeholder:text-sm text-base text-gray-600"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all placeholder:text-sm text-base text-gray-600"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">
                    Password Strength:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      passwordStrength <= 2
                        ? "text-red-600"
                        : passwordStrength <= 4
                        ? "text-yellow-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`${getStrengthColor()} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              Password Requirements:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {passwordCriteria.minLength ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
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
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
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
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
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
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
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
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all placeholder:text-sm text-base text-gray-600"
                placeholder="Confirm your new password"
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
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Security Tips
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Use a unique password
              </p>
              <p className="text-sm text-slate-600">
                Don't reuse passwords from other websites
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Enable two-factor authentication
              </p>
              <p className="text-sm text-slate-600">
                Add an extra layer of security to your account (coming soon)
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Never share your password
              </p>
              <p className="text-sm text-slate-600">
                MoneyStitch will never ask for your password via email or phone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
