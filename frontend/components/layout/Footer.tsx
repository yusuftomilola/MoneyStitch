import { DollarSign, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MoneyStitch</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              MoneyStitch is your go-to personal finance hub, providing
              practical tools, guides, and resources to help you save smarter,
              spend wisely, and grow your wealth.
            </p>
            <div className="flex space-x-4">
              <button className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#tools"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Tools
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#premium"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Premium
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Calculator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Newsletter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 MoneyStitch. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
