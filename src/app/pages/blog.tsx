import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { apiRequest } from "../lib/api";
import { motion } from "motion/react";

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

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await apiRequest('/blog');
        setPosts(data.posts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-ink/20 border-t-ink" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="grid gap-8 px-5 pt-14 pb-16 sm:px-12 md:grid-cols-12 md:pt-20 md:pb-24">
        <div className="min-w-0 md:col-span-8">
          <p className="label-caps mb-4 text-sm">Blog</p>
          <h1 className="font-wide text-5xl uppercase leading-[0.88] sm:text-7xl lg:text-8xl">
            Insights &amp; Tips
          </h1>
        </div>
        <p className="self-end text-base leading-relaxed md:col-span-4">
          Learn about AI content creation, industry best practices, and how to leverage
          artificial intelligence for your marketing needs.
        </p>
      </header>

      {/* Blog Posts Grid */}
      <section className="border-t border-ink px-5 py-14 sm:px-12 md:py-20">
        {posts.length > 0 ? (
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="label-caps absolute left-0 top-0 bg-sun px-2.5 py-1 text-xs">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-ink py-3 text-sm">
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 line-clamp-2 text-2xl uppercase group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <span className="label-caps mt-4 inline-flex items-center gap-2 text-sm transition-all group-hover:gap-3">
                    Read more <ArrowRight className="size-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-ink py-20 text-center">
            <h3 className="mb-2 text-2xl uppercase">No blog posts yet</h3>
            <p>Check back soon for insights and tips!</p>
          </div>
        )}
      </section>
    </div>
  );
}
