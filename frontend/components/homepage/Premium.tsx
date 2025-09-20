import { CheckCircle } from "lucide-react";

export default function Premium() {
  return (
    <section
      id="premium"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Want More? Go{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Premium
          </span>
        </h2>
        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
          Unlock advanced features and exclusive content to accelerate your
          wealth-building journey
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            "Advanced financial tools & calculators",
            "Exclusive guides and detailed reports",
            "Private money accountability group",
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-slate-800 p-6 rounded-xl"
            >
              <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              <span className="text-slate-200">{benefit}</span>
            </div>
          ))}
        </div>

        <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-10 py-4 rounded-full text-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-2xl">
          Join Premium
        </button>
      </div>
    </section>
  );
}
