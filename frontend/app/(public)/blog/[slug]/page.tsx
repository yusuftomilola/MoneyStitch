// frontend/app/(public)/blog/[slug]/page.tsx
import { Navbar } from "@/components/layout";
import { client, urlFor } from "@/lib/sanity";
import { BlogArticle, BlogCard } from "@/lib/types/blog";
import { PortableText, PortableTextComponents } from "next-sanity";
import {
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Share2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30; // revalidate at most 30 seconds

async function getData(slug: string) {
  const query = `
    *[_type == "blog" && slug.current == $slug] {
      title,
      content,
      smallDescription,
      "currentSlug": slug.current,
      titleImage,
      _createdAt,
      "estimatedReadTime": round(length(pt::text(content)) / 5 / 200)
    }[0]
  `;

  const data = await client.fetch(query, { slug });
  return data;
}

async function getRelatedPosts(currentSlug: string) {
  const query = `
    *[_type == "blog" && slug.current != $currentSlug] | order(_createdAt desc)[0...3] {
      title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage,
      _createdAt
    }
  `;

  const data = await client.fetch(query, { currentSlug });
  return data;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Custom PortableText components for better styling
const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-12 mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-10 mb-5 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-8 mb-4 leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-semibold text-slate-800 mt-6 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-slate-600 text-lg leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-8 bg-emerald-50 rounded-r-lg">
        <p className="text-slate-700 text-lg italic leading-relaxed">
          {children}
        </p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-6 space-y-3 text-slate-600 text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-6 space-y-3 text-slate-600 text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed pl-2">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed pl-2">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-800">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500 transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-slate-100 text-emerald-700 px-2 py-1 rounded text-base font-mono">
        {children}
      </code>
    ),
  },
};

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data: BlogArticle & {
    _createdAt?: string;
    estimatedReadTime?: number;
    smallDescription?: string;
  } = await getData(slug);
  const relatedPosts: BlogCard[] = await getRelatedPosts(slug);

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="pt-28 pb-20 px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Article Not Found
            </h1>
            <p className="text-slate-600 mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <button className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blog</span>
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>

          {/* Category Badge */}
          {/* <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>MoneyStitch Blog</span>
          </div> */}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            {data.title}
          </h1>

          {/* Description */}
          {data.smallDescription && (
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {data.smallDescription}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-slate-500">
            {data._createdAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(data._createdAt)}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{data.estimatedReadTime || 5} min read</span>
            </div>
            <button className="flex items-center space-x-2 text-slate-500 hover:text-emerald-600 transition-colors ml-auto">
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {data.titleImage && (
        <section className="px-4 sm:px-6 lg:px-8 -mt-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-gray-400">
              <Image
                src={urlFor(data.titleImage).url()}
                alt={data.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="prose-custom">
            <PortableText
              value={data.content}
              components={portableTextComponents}
            />
          </div>
        </div>
      </article>

      {/* Author/CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-500/10 border border-emerald-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Enjoyed this article?
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Join MoneyStitch to access more financial insights and tools to
                help you build better money habits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/blog">
                  <button className="bg-white text-slate-700 px-8 py-3 rounded-full font-semibold border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-600 transition-colors">
                    Read More Articles
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 text-center">
              You Might Also Like
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post, idx) => (
                <Link
                  href={`/blog/${post.currentSlug}`}
                  key={idx}
                  className="group block"
                >
                  <article className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-100">
                      {post.titleImage ? (
                        <Image
                          src={urlFor(post.titleImage).url()}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-emerald-600/30" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-slate-600 line-clamp-2 mb-4 text-sm leading-relaxed">
                        {post.smallDescription}
                      </p>

                      <div className="flex items-center space-x-2 text-emerald-600 font-medium text-sm group-hover:text-emerald-700">
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
