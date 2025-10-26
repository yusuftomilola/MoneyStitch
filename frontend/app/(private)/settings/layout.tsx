"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Lock,
  Settings,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const settingsNavigation = [
  {
    name: "Profile",
    href: "/settings/profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    name: "Security",
    href: "/settings/security",
    icon: Lock,
    description: "Password and security settings",
  },
  {
    name: "Account",
    href: "/settings/account",
    icon: Settings,
    description: "Account management and preferences",
  },
];

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Settings
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-8">
              <div className="space-y-2">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                        ${
                          active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          active ? "text-emerald-600" : "text-slate-400"
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`font-semibold ${
                            active ? "text-emerald-700" : "text-slate-700"
                          }`}
                        >
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 hidden xl:block">
                          {item.description}
                        </div>
                      </div>
                      {active && (
                        <ChevronRight className="w-4 h-4 text-emerald-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Settings Menu
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {settingsNavigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                          ${
                            active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "text-slate-600 hover:bg-slate-50"
                          }
                        `}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            active ? "text-emerald-600" : "text-slate-400"
                          }`}
                        />
                        <div className="flex-1">
                          <div
                            className={`font-semibold ${
                              active ? "text-emerald-700" : "text-slate-700"
                            }`}
                          >
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
