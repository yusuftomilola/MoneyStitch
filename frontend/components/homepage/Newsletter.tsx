"use client";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = () => {
    if (email) {
      console.log("Newsletter signup:", email);
      setEmail("");
      alert("Thank you for subscribing!");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Smart Money Tips, Straight to Your Inbox
          </h2>
          <p className="text-xl text-slate-600">
            Join 1,000+ readers who receive weekly tips on saving, investing,
            and wealth-building.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 focus:ring-opacity-20 outline-none transition-all text-lg"
            />
            <button
              onClick={handleNewsletterSubmit}
              className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
