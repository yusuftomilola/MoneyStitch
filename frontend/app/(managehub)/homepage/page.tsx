"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Shield,
  Clock,
  Mail,
  ArrowRight,
  CheckCircle,
  Smartphone,
  BarChart3,
  Zap,
  Globe,
  Star,
} from "lucide-react";

const ComingSoonPage = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      console.log("Email subscribed:", email);
    }
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Smart User Management",
      description:
        "Seamlessly manage members, staff, and visitors with role-based access control",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Biometric Security",
      description:
        "Advanced fingerprint and facial recognition for secure workspace access",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Analytics",
      description:
        "Track workspace utilization, member engagement, and revenue insights",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile-First Design",
      description:
        "Native mobile apps for seamless check-ins and workspace bookings",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automated Billing",
      description:
        "Flexible subscription models with integrated payment processing",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Blockchain Integration",
      description:
        "Transparent payments and immutable audit logs powered by Stellar",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ManageHub</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Notified
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center bg-white border border-blue-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-blue-600 font-medium text-sm">
              Something Amazing is Coming
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Workspace Management
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary platform combining biometric authentication, real-time
            analytics, and blockchain technology to transform how tech hubs and
            coworking spaces operate.
          </p>

          {/* Countdown Timer */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">
                Launching In
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl md:text-3xl font-bold py-4 px-2 rounded-xl shadow-lg">
                    {String(value).padStart(2, "0")}
                  </div>
                  <span className="text-gray-600 text-sm font-medium mt-2 block capitalize">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Signup */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto mb-16 border border-gray-100">
            {!isSubscribed ? (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Be the First to Know
                </h3>
                <p className="text-gray-600 mb-6">
                  Get exclusive early access and updates on our launch.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center group"
                  >
                    Notify Me
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  You'll be the first to know when we launch. Keep an eye on
                  your inbox!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Features Preview */}
      <section
        id="features"
        className="relative z-10 px-4 py-16 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features Coming Your Way
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of workspace management with
              cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ManageHub</span>
          </div>
          <p className="text-gray-400 mb-6">
            Revolutionizing workspace management for the digital age
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2025 ManageHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComingSoonPage;
