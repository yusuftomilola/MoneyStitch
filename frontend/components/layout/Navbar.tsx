"use client";
import { DollarSign, X, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthState } from "@/lib/store/authStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthState();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              MoneyStitch
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#tools"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Tools
            </a>
            <a
              href="#blog"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Blog
            </a>
            <a
              href="#premium"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Premium
            </a>
            <a
              href="#contact"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href={"#"}>
                  <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                    Logout
                  </button>
                </Link>
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
            <a
              href="#home"
              className="block text-slate-600 hover:text-emerald-600 py-2"
            >
              Home
            </a>
            <a
              href="#tools"
              className="block text-slate-600 hover:text-emerald-600 py-2"
            >
              Tools
            </a>
            <a
              href="#blog"
              className="block text-slate-600 hover:text-emerald-600 py-2"
            >
              Blog
            </a>
            <a
              href="#premium"
              className="block text-slate-600 hover:text-emerald-600 py-2"
            >
              Premium
            </a>
            <a
              href="#contact"
              className="block text-slate-600 hover:text-emerald-600 py-2"
            >
              Contact
            </a>
            <div className="flex space-x-3 pt-3 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link href={"#"}>
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                      Logout
                    </button>
                  </Link>
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
  );
}
