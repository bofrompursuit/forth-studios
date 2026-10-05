import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-neutral-700 border-t-purple-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center px-6">
        <h1 className="mb-4 text-4xl text-white">Post Not Found</h1>
        <p className="mb-8 text-neutral-400">{error || 'The blog post you are looking for does not exist.'}</p>
        <Link to="/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 sm:px-6 py-12">
      <article className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 size-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl text-white">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              {post.readTime}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 overflow-hidden rounded-lg">
          <img src={post.image} alt={post.title} className="w-full object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-neutral-300 leading-relaxed text-sm sm:text-base">
            {post.content}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 text-center">
          <h3 className="mb-4 text-xl sm:text-2xl text-white">Ready to Get Started?</h3>
          <p className="mb-6 text-sm sm:text-base text-neutral-400">
            Let's create amazing AI-generated content for your brand.
          </p>
          <Link to="/contact">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Get in Touch
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}