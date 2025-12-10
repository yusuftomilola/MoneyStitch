// frontend/app/(public)/blog/page.tsx
import { Navbar } from "@/components/layout";
import { client, urlFor } from "@/lib/sanity";
import { BlogCard } from "@/lib/types/blog";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30; // revalidate at most 30 seconds

export const metadata: Metadata = {
  title: "Blog - Financial Guides & Tips",
  description:
    "Explore our collection of practical financial guides, money management tips, and expert insights to help you build better money habits and achieve financial freedom.",
  keywords: [
    "personal finance blog",
    "money tips",
    "budgeting guides",
    "financial literacy",
    "saving money",
    "investment advice",
    "debt management",
    "financial planning",
  ],
  openGraph: {
    title: "MoneyStitch Blog - Financial Wisdom for Everyday Life",
    description:
      "Practical guides, expert insights, and actionable tips to help you build better money habits and secure your financial future.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyStitch Blog - Financial Guides & Tips",
    description:
      "Practical financial guides and money management tips to build better money habits.",
  },
  alternates: {
    canonical: "/blog",
  },
};

async function getData() {
  const query = `
    *[_type == "blog"] | order(_createdAt desc) {
      title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage,
      _createdAt,
      "estimatedReadTime": round(length(pt::text(content)) / 5 / 200)
    }
  `;

  const data = await client.fetch(query);
  return data;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const data: (BlogCard & {
    _createdAt?: string;
    estimatedReadTime?: number;
  })[] = await getData();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>MoneyStitch Blog</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Financial Wisdom for{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Everyday Life
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Practical guides, expert insights, and actionable tips to help you
              build better money habits and secure your financial future.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {data.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No articles yet
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                We're working on creating valuable content for you. Check back
                soon for our latest financial insights and guides.
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post (First Post) */}
              {data.length > 0 && (
                <div className="mb-16">
                  <Link
                    href={`/blog/${data[0].currentSlug}`}
                    className="group block"
                  >
                    <article className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden">
                      <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image Side */}
                        <div className="relative h-64 lg:h-[450px] overflow-hidden">
                          {data[0].titleImage ? (
                            <Image
                              src={urlFor(data[0].titleImage).url()}
                              alt={data[0].title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              priority
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                              <BookOpen className="w-24 h-24 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/80 lg:block hidden" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent lg:hidden" />
                        </div>

                        {/* Content Side */}
                        <div className="relative p-8 lg:p-12 flex flex-col justify-center">
                          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium mb-6 w-fit">
                            <span>Featured Article</span>
                          </div>

                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight">
                            {data[0].title}
                          </h2>

                          <p className="text-slate-300 text-lg mb-6 line-clamp-3 leading-relaxed">
                            {data[0].smallDescription}
                          </p>

                          <div className="flex items-center space-x-6 text-slate-400 text-sm mb-8">
                            {data[0]._createdAt && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(data[0]._createdAt)}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {data[0].estimatedReadTime || 5} min read
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
                            <span>Read Full Article</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              )}

              {/* Rest of Posts */}
              {data.length > 1 && (
                <>
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                      Latest Articles
                    </h2>
                    <div className="hidden sm:flex items-center space-x-2 text-slate-500">
                      <span>{data.length - 1} more articles</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.slice(1).map((post, idx) => (
                      <Link
                        href={`/blog/${post.currentSlug}`}
                        key={idx}
                        className="group block"
                      >
                        <article className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                          {/* Image */}
                          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-100">
                            {post.titleImage ? (
                              <Image
                                src={urlFor(post.titleImage).url()}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="w-16 h-16 text-emerald-600/30" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="flex items-center space-x-4 text-slate-500 text-sm mb-4">
                              {post._createdAt && (
                                <div className="flex items-center space-x-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{formatDate(post._createdAt)}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.estimatedReadTime || 5} min</span>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                              {post.title}
                            </h3>

                            <p className="text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                              {post.smallDescription}
                            </p>

                            <div className="flex items-center space-x-2 text-emerald-600 font-medium group-hover:text-emerald-700">
                              <span>Read More</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
