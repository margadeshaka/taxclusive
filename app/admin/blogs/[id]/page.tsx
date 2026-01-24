"use client"

import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

import { AdminWrapper } from "@/components/admin/admin-wrapper"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { SEOScorePanel } from "@/components/admin/seo-score-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"


interface BlogEditPageProps {
  params: { id: string }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function BlogEditPage({ params }: BlogEditPageProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "DRAFT",
    featured: false,
    tags: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    ogImage: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${params.id}`)
      if (response.ok) {
        const blog = await response.json()
        setFormData({
          title: blog.title,
          excerpt: blog.excerpt || "",
          content: blog.content,
          coverImage: blog.coverImage || "",
          status: blog.status,
          featured: blog.featured,
          tags: blog.tags.map((tag: { name: string }) => tag.name).join(", "),
          slug: blog.slug || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          focusKeyword: blog.focusKeyword || "",
          ogImage: blog.ogImage || "",
        })
      } else {
        toast({
          title: "Error",
          description: "Blog not found",
          variant: "destructive"
        })
        router.push("/admin/blogs")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, router, toast])

  useEffect(() => {
    fetchBlog()
  }, [fetchBlog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch(`/api/admin/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          slug: formData.slug,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          focusKeyword: formData.focusKeyword,
          ogImage: formData.ogImage,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog updated successfully",
        })
        router.push("/admin/blogs")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update blog",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminWrapper>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminWrapper>
    )
  }

  return (
    <AdminWrapper>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/blogs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold mb-2">Edit Blog</h1>
            <p className="text-muted-foreground">
              Update your blog post content and settings
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>
                  Edit your blog post content using Markdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        title: newTitle,
                        slug: prev.slug === "" || prev.slug === generateSlug(prev.title) ? generateSlug(newTitle) : prev.slug,
                      }))
                    }}
                    placeholder="Enter blog title"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the blog post"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your blog content here..."
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>
                  Configure how your blog post will be published
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="featured">Featured post</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media & Tags</CardTitle>
                <CardDescription>
                  Add images and categorize your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tax, finance, business (comma separated)"
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-muted-foreground">
                    /blogs/{formData.slug || "your-post-slug"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title (defaults to post title)"
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.metaTitle.length}/60
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Brief description for search results"
                    disabled={isSubmitting}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.metaDescription.length}/160
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focusKeyword">Focus Keyword</Label>
                  <Input
                    id="focusKeyword"
                    value={formData.focusKeyword}
                    onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                    placeholder="Primary keyword for this post"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="Defaults to cover image"
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            <SEOScorePanel
              title={formData.title}
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              focusKeyword={formData.focusKeyword}
              slug={formData.slug}
              content={formData.content}
              coverImage={formData.coverImage}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/admin/blogs")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Blog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  )
}