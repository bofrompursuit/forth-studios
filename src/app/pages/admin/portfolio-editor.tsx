import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { isAuthenticated } from "../../lib/auth";
import { apiRequest, uploadFile } from "../../lib/api";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Link } from "react-router";

export function PortfolioEditor() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadFile(file);
      setImage(data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const itemData = {
        title,
        description,
        category,
        prompt,
        image,
        published,
        date: new Date().toISOString().split('T')[0],
      };

      await apiRequest('/portfolio', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-180px)] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl text-white">New Portfolio Item</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
              <CardTitle className="text-white">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-neutral-300">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="Enter item title"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-neutral-300">Category *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="e.g., Beauty, Fashion, Food & Drink, Fitness"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-neutral-300">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="bg-neutral-800 border-neutral-700 text-white resize-none"
                  placeholder="Describe this creation"
                />
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-neutral-300">AI Prompt (optional)</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="bg-neutral-800 border-neutral-700 text-white resize-none"
                  placeholder="The prompt you used to generate this image"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-neutral-300">Image *</Label>
                <div className="space-y-4">
                  {image && (
                    <div className="overflow-hidden rounded-lg border border-neutral-700">
                      <img src={image} alt="Preview" className="w-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="size-4" />
                          Upload Image
                        </>
                      )}
                    </Label>
                    {!image && <p className="text-sm text-neutral-500">or paste URL below</p>}
                  </div>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="size-4 rounded border-neutral-700 bg-neutral-800"
                />
                <Label htmlFor="published" className="text-neutral-300 cursor-pointer">
                  Publish immediately (uncheck to save as draft)
                </Label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-950/50 border border-red-900 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving || !image}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? 'Saving...' : 'Create Item'}
                </Button>
                <Link to="/admin/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
