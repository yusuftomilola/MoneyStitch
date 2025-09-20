import { Calculator, BookOpen, Users } from "lucide-react";

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Why Choose MoneyStitch?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Practical Tools
            </h3>
            <p className="text-slate-600 leading-relaxed">
              From compound interest to budgeting calculators, plan your money
              with ease using our suite of financial tools.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Expert Insights
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Simplified money advice for everyday people, backed by financial
              expertise and real-world experience.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Smart Community
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Join others who are building wealth step by step in our supportive
              community of smart money managers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
