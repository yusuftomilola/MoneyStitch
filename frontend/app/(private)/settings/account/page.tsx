"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "@/lib/store/authStore";
import {
  Calendar,
  Shield,
  AlertTriangle,
  LogOut,
  Trash2,
  Download,
  Mail,
  Send,
  Clock,
} from "lucide-react";
import {
  useDeleteUser,
  useLogoutUser,
  useResendVerifyEmail,
  useDataExport,
} from "@/lib/query/hooks";

const AccountSettingsPage = () => {
  const { user } = useAuthState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isPending, mutate: logout } = useLogoutUser();
  const deleteUser = useDeleteUser();
  const resendVerificationEmail = useResendVerifyEmail();
  const dataExportMutation = useDataExport();

  // Email verification cooldown state
  const [emailCooldownSeconds, setEmailCooldownSeconds] = useState(0);
  const [emailLastSentTime, setEmailLastSentTime] = useState<number | null>(
    null
  );

  // Data export cooldown state
  const [exportCooldownSeconds, setExportCooldownSeconds] = useState(0);
  const [exportLastSentTime, setExportLastSentTime] = useState<number | null>(
    null
  );

  // Load last sent time for email verification from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lastVerificationEmailSent");
    if (stored) {
      const lastSent = parseInt(stored, 10);
      const elapsed = Math.floor((Date.now() - lastSent) / 1000);
      const remaining = Math.max(0, 60 - elapsed); // 60 second cooldown
      setEmailCooldownSeconds(remaining);
      setEmailLastSentTime(lastSent);
    }
  }, []);

  // Load last export time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lastDataExportTime");
    if (stored) {
      const lastExport = parseInt(stored, 10);
      const elapsed = Math.floor((Date.now() - lastExport) / 1000);
      const remaining = Math.max(0, 300 - elapsed); // 300 seconds = 5 minutes cooldown
      setExportCooldownSeconds(remaining);
      setExportLastSentTime(lastExport);
    }
  }, []);

  // Countdown timer for email verification
  useEffect(() => {
    if (emailCooldownSeconds > 0) {
      const timer = setTimeout(
        () => setEmailCooldownSeconds(emailCooldownSeconds - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [emailCooldownSeconds]);

  // Countdown timer for data export
  useEffect(() => {
    if (exportCooldownSeconds > 0) {
      const timer = setTimeout(
        () => setExportCooldownSeconds(exportCooldownSeconds - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [exportCooldownSeconds]);

  const handleResendVerification = async () => {
    const now = Date.now();
    localStorage.setItem("lastVerificationEmailSent", now.toString());
    setEmailLastSentTime(now);
    setEmailCooldownSeconds(60); // 60 second cooldown
    console.log("Resending verification email to:", user?.email);
    resendVerificationEmail.mutate();
  };

  const canResendEmail = emailCooldownSeconds === 0;

  const handleDeleteAccount = async () => {
    deleteUser.mutate();
  };

  const handleLogout = () => {
    logout();
  };

  const handleExportData = async () => {
    const now = Date.now();
    localStorage.setItem("lastDataExportTime", now.toString());
    setExportLastSentTime(now);
    setExportCooldownSeconds(300); // 300 seconds = 5 minutes cooldown

    dataExportMutation.mutate();
  };

  const canExportData = exportCooldownSeconds === 0;

  // Format time remaining for display
  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Account Settings
        </h2>
        <p className="text-slate-600">
          Manage your account preferences and data
        </p>
      </div>

      {/* Account Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Account Information
        </h3>
        <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Email Address
                </p>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.isEmailVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user?.isEmailVerified ? "Verified" : "Unverified"}
            </div>
          </div>

          {/* Verification Status & Action */}
          {!user?.isEmailVerified && (
            <div className="space-y-2 p-4 ">
              {/* Resend Verification Button */}
              <button
                onClick={handleResendVerification}
                disabled={resendVerificationEmail.isPending || !canResendEmail}
                className="flex items-center space-x-2 text-sm  hover:text-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed  rounded-full px-3 py-1 cursor-pointer bg-yellow-100 text-yellow-700"
              >
                {resendVerificationEmail.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-700 border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : !canResendEmail ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Wait {emailCooldownSeconds}s</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>

              {/* Info Message */}
              <p className="text-xs text-slate-500 mt-2">
                Please verify your email to unlock all features
              </p>
            </div>
          )}

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Account Created
                </p>
                <p className="text-sm text-slate-600">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Account Status
                </p>
                <p className="text-sm text-slate-600">Active</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              Good Standing
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 mb-1">
                    Export Your Data
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Download a copy of your account data, including your profile
                    information, financial records, and activity history.
                  </p>

                  {/* Cooldown Info Message */}
                  {!canExportData && !dataExportMutation.isPending && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                          <p className="font-semibold">
                            Export cooldown active
                          </p>
                          <p className="mt-1">
                            You can request another export in{" "}
                            {formatTimeRemaining(exportCooldownSeconds)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleExportData}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      canExportData && !dataExportMutation.isPending
                        ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                    disabled={dataExportMutation.isPending || !canExportData}
                  >
                    {dataExportMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Exporting Data...</span>
                      </>
                    ) : !canExportData ? (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>
                          Wait {formatTimeRemaining(exportCooldownSeconds)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Request Data Export</span>
                      </>
                    )}
                  </button>

                  {/* Last export info */}
                  {exportLastSentTime && (
                    <p className="text-xs text-slate-500 mt-2">
                      Last export:{" "}
                      {new Date(exportLastSentTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Session Management
        </h3>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Sign Out</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Sign out of your MoneyStitch account on this device. You'll
                  need to sign in again to access your account.
                </p>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">
                  Delete Account
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Permanently delete your MoneyStitch account and all associated
                  data. This action cannot be undone.
                </p>
                <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-red-800">
                      <p className="font-semibold mb-1">
                        Warning: This action is irreversible
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          All your financial data will be permanently deleted
                        </li>
                        <li>You will lose access to all premium features</li>
                        <li>
                          Your username and email will become available for
                          reuse
                        </li>
                        <li>Any active subscriptions will be cancelled</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete My Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Delete Account?
              </h3>
              <p className="text-slate-600">
                This will permanently delete your account and all your data.
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 font-medium mb-2">
                You will lose:
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>All financial records and transactions</li>
                <li>Saved budgets and goals</li>
                <li>Account history and reports</li>
                <li>Premium membership benefits</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleDeleteAccount();
                }}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleteUser.isPending}
              >
                {deleteUser.isPending ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting account...</span>
                  </span>
                ) : (
                  "Yes, Delete My Account"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsPage;
