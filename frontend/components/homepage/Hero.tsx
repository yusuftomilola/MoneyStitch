import {
  PiggyBank,
  TrendingUp,
  ArrowRight,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute top-0 left-1/4 animate-bounce delay-1000">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="absolute top-10 right-1/4 animate-bounce delay-2000">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Stitching{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Smart Money
            </span>{" "}
            Habits Into Your Life
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed">
            MoneyStitch helps you master personal finance with practical tools,
            smart guides, and resources designed to make your money work for
            you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2">
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              Try Our Free Calculator
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-slate-500">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>1,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
