import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { apiRequest } from "../lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
}

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await apiRequest(`/blog/${slug}`);
        setPost(data.post);
      } catch (err: any) {
        console.error('Failed to load blog post:', err);
        setError(err.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-ink/20 border-t-ink" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-start justify-center px-5 py-20 sm:px-12">
        <h1 className="font-wide mb-4 text-5xl uppercase leading-[0.9] sm:text-7xl">Post Not Found</h1>
        <p className="mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
        <Link to="/blog" className="label-caps inline-flex items-center gap-2 border border-ink px-6 py-4 transition hover:bg-ink hover:text-sun">
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Header */}
      <header className="px-5 pt-10 pb-12 sm:px-12 md:pb-16">
        <Link to="/blog" className="label-caps mb-12 inline-flex items-center gap-2 text-sm hover:underline underline-offset-4">
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>
        <p className="label-caps mb-4 text-sm">{post.category}</p>
        <h1 className="font-wide max-w-5xl text-4xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">{post.title}</h1>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-ink pt-4 text-sm">
          <span>
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span>{post.readTime}</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="px-5 sm:px-12">
        <img src={post.image} alt={post.title} className="w-full object-cover" />
      </div>

      {/* Content */}
      <div className="px-5 py-14 sm:px-12 md:py-20">
        <div className="mx-auto max-w-2xl whitespace-pre-wrap text-base leading-relaxed sm:text-lg">
          {post.content}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-ink px-5 py-16 text-sun sm:px-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h2 className="font-wide text-4xl uppercase leading-[0.9] sm:text-6xl md:col-span-8">Ready to Get Started?</h2>
          <div className="md:col-span-4">
            <p className="mb-6 leading-relaxed">
              Let's create amazing AI-generated content for your brand.
            </p>
            <Link to="/contact" className="label-caps inline-flex items-center gap-2 bg-sun px-6 py-4 text-ink transition hover:bg-paper">
              Get in Touch <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
