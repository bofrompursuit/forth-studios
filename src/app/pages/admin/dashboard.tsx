import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { isAuthenticated, signOut } from "../../lib/auth";
import { apiRequest } from "../../lib/api";
import { FileText, Image, Mail, LogOut, Plus, Eye, EyeOff, Trash2, Edit } from "lucide-react";
import { Badge } from "../../components/ui/badge";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }

    async function loadData() {
      try {
        const [blogData, portfolioData, subscriberData, snapshotData] = await Promise.all([
          apiRequest('/blog'),
          apiRequest('/portfolio'),
          apiRequest('/newsletter'),
          apiRequest('/snapshots'),
        ]);

        setBlogPosts(blogData.posts);
        setPortfolioItems(portfolioData.items);
        setSubscribers(subscriberData.subscribers);
        setSnapshots(snapshotData.snapshots);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  async function togglePublish(type: 'blog' | 'portfolio' | 'snapshot', id: string, currentStatus: boolean) {
    try {
      if (type === 'blog') {
        const slug = id.replace('blog_', '');
        await apiRequest(`/blog/${slug}`, {
          method: 'PUT',
          body: JSON.stringify({ published: !currentStatus }),
        });
        setBlogPosts(posts => posts.map(p => 
          p.id === id ? { ...p, published: !currentStatus } : p
        ));
      } else if (type === 'portfolio') {
        await apiRequest(`/portfolio/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ published: !currentStatus }),
        });
        setPortfolioItems(items => items.map(i => 
          i.id === id ? { ...i, published: !currentStatus } : i
        ));
      } else {
        await apiRequest(`/snapshots/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ published: !currentStatus }),
        });
        setSnapshots(snaps => snaps.map(s => 
          s.id === id ? { ...s, published: !currentStatus } : s
        ));
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  }

  async function deleteItem(type: 'blog' | 'portfolio' | 'snapshot', id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (type === 'blog') {
        const slug = id.replace('blog_', '');
        await apiRequest(`/blog/${slug}`, { method: 'DELETE' });
        setBlogPosts(posts => posts.filter(p => p.id !== id));
      } else if (type === 'portfolio') {
        await apiRequest(`/portfolio/${id}`, { method: 'DELETE' });
        setPortfolioItems(items => items.filter(i => i.id !== id));
      } else {
        await apiRequest(`/snapshots/${id}`, { method: 'DELETE' });
        setSnapshots(snaps => snaps.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-neutral-700 border-t-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl text-white">Admin Dashboard</h1>
            <p className="mt-2 text-neutral-400">Manage your content and view analytics</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-neutral-400">Blog Posts</CardTitle>
              <FileText className="size-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{blogPosts.length}</div>
              <p className="text-xs text-neutral-500">
                {blogPosts.filter(p => p.published).length} published
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-neutral-400">Portfolio Items</CardTitle>
              <Image className="size-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{portfolioItems.length}</div>
              <p className="text-xs text-neutral-500">
                {portfolioItems.filter(i => i.published).length} published
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-neutral-400">Snapshots</CardTitle>
              <Image className="size-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{snapshots.length}</div>
              <p className="text-xs text-neutral-500">
                {snapshots.filter(s => s.published).length} published
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-neutral-400">Newsletter Subscribers</CardTitle>
              <Mail className="size-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{subscribers.length}</div>
              <p className="text-xs text-neutral-500">Total subscribers</p>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts Section */}
        <Card className="mb-8 border-neutral-800 bg-neutral-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Blog Posts</CardTitle>
                <CardDescription>Manage your blog content</CardDescription>
              </div>
              <Link to="/admin/blog/new">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 size-4" />
                  New Post
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {blogPosts.length > 0 ? (
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white">{post.title}</h3>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-neutral-400">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/blog/edit/${post.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish('blog', post.id, post.published)}
                      >
                        {post.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('blog', post.id)}
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500">No blog posts yet</p>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card className="mb-8 border-neutral-800 bg-neutral-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Portfolio Items</CardTitle>
                <CardDescription>Manage your portfolio content</CardDescription>
              </div>
              <Link to="/admin/portfolio/new">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 size-4" />
                  New Item
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {portfolioItems.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish('portfolio', item.id, item.published)}
                        className="bg-neutral-900/80"
                      >
                        {item.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('portfolio', item.id)}
                        className="bg-neutral-900/80"
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white">{item.title}</p>
                        <Badge variant={item.published ? "default" : "secondary"} className="text-xs">
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500">No portfolio items yet</p>
            )}
          </CardContent>
        </Card>

        {/* Snapshots Section */}
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Snapshots by Bo</CardTitle>
                <CardDescription>Manage your personal photography</CardDescription>
              </div>
              <Link to="/admin/snapshots/new">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 size-4" />
                  New Snapshot
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {snapshots.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
                  >
                    <img
                      src={snapshot.image}
                      alt={snapshot.caption || 'Snapshot'}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish('snapshot', snapshot.id, snapshot.published)}
                        className="bg-neutral-900/80"
                      >
                        {snapshot.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('snapshot', snapshot.id)}
                        className="bg-neutral-900/80"
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white">{snapshot.caption || 'Untitled'}</p>
                        <Badge variant={snapshot.published ? "default" : "secondary"} className="text-xs">
                          {snapshot.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500">No snapshots yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}