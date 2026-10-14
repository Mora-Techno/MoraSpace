import BlogDetailContainer from './_container/blog-detail';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailContainer slug={decodeURIComponent(slug)} />;
}
