"use client"

import { Plus, Edit, Trash2, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"

import { AdminWrapper } from "@/components/admin/admin-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"


interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string
  featured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author: {
    name: string | null
    email: string
  }
  tags: Array<{ id: string; name: string }>
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const handleDelete = async (blog: Blog) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        })
        fetchBlogs()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete blog",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default"
      case "DRAFT":
        return "secondary"
      case "ARCHIVED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <AdminWrapper>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Blogs</h1>
            <p className="text-muted-foreground">
              Manage blog posts and articles
            </p>
          </div>
          <Link href="/admin/blogs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Blog
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Blogs</CardTitle>
            <CardDescription>
              Manage your blog posts and their publication status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{blog.title}</div>
                          {blog.excerpt && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {blog.excerpt}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant={getStatusColor(blog.status)}>
                            {blog.status}
                          </Badge>
                          {blog.featured && <Badge variant="outline">Featured</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {blog.author.name || blog.author.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                          {blog.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{blog.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {blog.publishedAt 
                          ? new Date(blog.publishedAt).toLocaleDateString()
                          : "—"
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {blog.status === "PUBLISHED" && (
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(blog)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {blogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          No blogs found. Create your first blog post to get started.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminWrapper>
  )
}