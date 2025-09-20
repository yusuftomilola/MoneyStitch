import { ArrowRight, TrendingUp } from "lucide-react";

export default function FeaturedTool() {
  return (
    <section
      id="tools"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              See How Fast Your Money Can Grow
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Our compound interest calculator shows you the real power of
              starting early and staying consistent with your savings.
            </p>
            <button className="group bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2">
              <span>Try It Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white text-center mb-6">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">
                Compound Interest Calculator
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Initial Investment
                </label>
                <input
                  type="number"
                  placeholder="$1,000"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 focus:ring-opacity-20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  placeholder="$500"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 focus:ring-opacity-20 outline-none transition-all"
                />
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 p-4 rounded-lg border border-emerald-100">
                <p className="text-center text-slate-600">
                  After 10 years, you could have
                </p>
                <p className="text-center text-3xl font-bold text-emerald-600">
                  $125,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
