// frontend/components/layout/Navbar.tsx
"use client";
import { DollarSign, X, Menu, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Add this import
import { useEffect, useState } from "react";
import { useAuthState } from "@/lib/store/authStore";
import { useLogoutUser } from "@/lib/query/hooks";
import { useResendVerifyEmail } from "@/lib/query/hooks";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerificationBannerVisible, setIsVerificationBannerVisible] =
    useState(true);
  const { isAuthenticated, user } = useAuthState();
  const logoutUser = useLogoutUser();
  const { mutate: resendVerification, isPending: isSendingVerification } =
    useResendVerifyEmail();

  const handleLogout = () => {
    logoutUser.mutate();
  };

  // Cooldown state
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  // Load last sent time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lastVerificationEmailSent");
    if (stored) {
      const lastSent = parseInt(stored, 10);
      const elapsed = Math.floor((Date.now() - lastSent) / 1000);
      const remaining = Math.max(0, 60 - elapsed); // 60 second cooldown
      setCooldownSeconds(remaining);
      setLastSentTime(lastSent);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(
        () => setCooldownSeconds(cooldownSeconds - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleResendVerification = async () => {
    const now = Date.now();
    localStorage.setItem("lastVerificationEmailSent", now.toString());
    setLastSentTime(now);
    setCooldownSeconds(60); // 60 second cooldown
    resendVerification();
  };

  const canResend = cooldownSeconds === 0;

  const handleCloseBanner = () => {
    setIsVerificationBannerVisible(false);
    // Optional: Store in localStorage to remember user's preference
    // localStorage.setItem("hideVerificationBanner", "true");
  };

  // Check if banner should be shown
  const showVerificationBanner =
    isAuthenticated &&
    user &&
    !user.isEmailVerified &&
    isVerificationBannerVisible;

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={"/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">
                MoneyStitch
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Admin
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  href="/admin/audit-logs"
                  className="text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Audit Logs
                </Link>
              )}
              <Link
                href="/blog"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Blog
              </Link>
              {isAuthenticated && (
                <Link
                  href="/my-activity"
                  className="text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  My Activity
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Profile Picture */}
                  <Link href="/settings/profile">
                    <div className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden border-2 border-white shadow-md group-hover:shadow-lg transition-shadow">
                          {user?.profilePic?.path ? (
                            <Image
                              src={user.profilePic.path}
                              alt={`${user.firstname} ${user.lastname}`}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>
                              {user?.firstname?.[0]}
                              {user?.lastname?.[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {user?.firstname}
                        </p>
                        <p className="text-xs text-slate-500">View Profile</p>
                      </div>
                    </div>
                  </Link>

                  <button
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleLogout}
                    disabled={logoutUser.isPending}
                  >
                    {logoutUser.isPending ? "Logging Out.." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link href={"/login"}>
                    <button className="text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                      Login
                    </button>
                  </Link>
                  <Link href={"/register"}>
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="block text-slate-600 hover:text-emerald-600 py-2"
                >
                  Admin
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  href="/admin/audit-logs"
                  className="block text-slate-600 hover:text-emerald-600 py-2"
                >
                  Audit Logs
                </Link>
              )}

              <Link
                href="/blog"
                className="block text-slate-600 hover:text-emerald-600 py-2"
              >
                Blog
              </Link>

              {isAuthenticated && (
                <Link
                  href="/my-activity"
                  className="block text-slate-600 hover:text-emerald-600 py-2"
                >
                  My Activity
                </Link>
              )}

              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    {/* Mobile Profile Section */}
                    <Link href="/settings/profile">
                      <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden border-2 border-white shadow-md">
                          {user?.profilePic?.path ? (
                            <Image
                              src={user.profilePic.path}
                              alt={`${user.firstname} ${user.lastname}`}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>
                              {user?.firstname?.[0]}
                              {user?.lastname?.[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {user?.firstname} {user?.lastname}
                          </p>
                          <p className="text-xs text-slate-500">View Profile</p>
                        </div>
                      </div>
                    </Link>

                    <button
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleLogout}
                      disabled={logoutUser.isPending}
                    >
                      {logoutUser.isPending ? "Logging Out.." : "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={"/login"}>
                      <button className="text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-lg cursor-pointer">
                        Login
                      </button>
                    </Link>
                    <Link href={"/register"}>
                      <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Email Verification Banner */}
      {showVerificationBanner && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-4">
              {/* Icon & Message */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-yellow-900">
                    Kindly verify your email address
                  </p>
                  <p className="text-xs text-yellow-700 truncate">
                    We already sent a verification email to your inbox at{" "}
                    <span className="font-semibold">{user?.email}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handleResendVerification}
                  disabled={isSendingVerification || !canResend}
                  className="inline-flex items-center space-x-1 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSendingVerification ? (
                    <>
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Sending...</span>

                      <span className="sm:hidden">Sending...</span>
                    </>
                  ) : !canResend ? (
                    <span>Wait {cooldownSeconds}s</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Resend Email</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCloseBanner}
                  className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going under navbar + banner */}
      {showVerificationBanner && <div className="h-16" />}
    </>
  );
}
