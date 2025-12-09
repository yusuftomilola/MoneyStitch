// frontend/components/homepage/Blog.tsx
import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react";
import { client, urlFor } from "@/lib/sanity";
import { BlogCard } from "@/lib/types/blog";
import Image from "next/image";
import Link from "next/link";

async function getBlogPosts() {
  const query = `
    *[_type == "blog"] | order(_createdAt desc)[0...3] {
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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Blog() {
  const posts: (BlogCard & {
    _createdAt?: string;
    estimatedReadTime?: number;
  })[] = await getBlogPosts();

  // If no posts, show placeholder content
  const displayPosts = posts.length > 0 ? posts : null;

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Our Blog</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Read Our Latest Guides
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Practical advice to help you make smarter financial decisions
          </p>
        </div>

        {displayPosts ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post, index) => (
              <Link
                href={`/blog/${post.currentSlug}`}
                key={index}
                className="group block"
              >
                <article className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-2">
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
                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-slate-500 text-sm mb-4">
                      {post._createdAt && (
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(post._createdAt)}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.estimatedReadTime || 5} min read</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 mb-5 leading-relaxed line-clamp-3">
                      {post.smallDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-emerald-600 font-medium group-hover:text-emerald-700">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          // Placeholder when no posts are available
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <div className="h-52 bg-gradient-to-br from-emerald-100 to-slate-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-emerald-600/30" />
                </div>
                <div className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/blog">
            <button className="group bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center space-x-2">
              <span>Explore More Articles</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
