import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
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
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-neutral-700 border-t-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 sm:px-6 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-4xl sm:text-5xl md:text-6xl text-transparent">
            Insights & Tips
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-400">
            Learn about AI content creation, industry best practices, and how to leverage 
            artificial intelligence for your marketing needs.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Card className="group h-full cursor-pointer border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-xl text-white group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-neutral-400">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-purple-400 group-hover:gap-3 transition-all">
                        Read more <ArrowRight className="size-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="mb-2 text-xl text-neutral-400">No blog posts yet</h3>
            <p className="text-neutral-500">Check back soon for insights and tips!</p>
          </div>
        )}
      </div>
    </div>
  );
}