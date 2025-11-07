import { client, urlFor } from "@/lib/sanity";
import { BlogArticle } from "@/lib/types/blog";
import { PortableText } from "next-sanity";
// import { PortableText } from "@portabletext/react";
import Image from "next/image";

export const revalidate = 30; // revalidate at most 30 seconds

async function getData(slug: string) {
  const query = `
        *[_type == "blog" && slug.current == "${slug}"] {
  title,
    content,
    "currentSlug": slug.current,
    titleImage,
}[0]
    `;

  const data = await client.fetch(query, { slug });

  return data;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data: BlogArticle = await getData(slug);
  return (
    <div className="mt-8 px-4 mx-auto">
      <h1>
        <span className="block text-base text-center text-primary font-semibold tracking-wide uppercase">
          MoneyStitch - Blog
        </span>
        <span className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
          {data.title}
        </span>
      </h1>

      <Image
        src={urlFor(data.titleImage).url()}
        width={800}
        height={800}
        alt="Title Image"
        priority
        className="rounded-lg mt-8 border"
      />

      <div className="mt-16 prose prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
        <PortableText value={data.content} />
      </div>
    </div>
  );
}
