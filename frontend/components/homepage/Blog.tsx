import { BookOpen, ArrowRight } from "lucide-react";

export default function Blog() {
  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Read Our Latest Guides
          </h2>
          <p className="text-xl text-slate-600">
            Practical advice to help you make smarter financial decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "10 Ways to Save Money Without Sacrificing Lifestyle",
              excerpt:
                "Discover practical tips that help you cut costs while maintaining the quality of life you love.",
              readTime: "5 min read",
            },
            {
              title: "Understanding Compound Interest: The Secret to Wealth",
              excerpt:
                "Learn how compound interest can transform small investments into substantial wealth over time.",
              readTime: "7 min read",
            },
            {
              title: "Budgeting 101: The 50/30/20 Rule Explained",
              excerpt:
                "Master this simple budgeting framework that's helped millions take control of their finances.",
              readTime: "6 min read",
            },
          ].map((post, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-slate-100 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-emerald-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {post.readTime}
                  </span>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1 group">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
            Explore More Articles
          </button>
        </div>
      </div>
    </section>
  );
}
