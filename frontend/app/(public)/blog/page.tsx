async function getData() {
  const query = `
        *[_type == "blog"] | order(_createdAt desc) {
  title,
    smallDescription,
    "currentSlug": slug.current
}
    `;
}

export default function BlogPage() {
  return (
    <div>
      <h1>Blog Page</h1>
    </div>
  );
}
