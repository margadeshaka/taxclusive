"use client"

import { FileText, MessageSquare, Users, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"

import { AdminWrapper } from "@/components/admin/admin-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

function formatTimeAgo(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`
}

export default function AdminDashboard() {
  const { stats, isLoading, isError } = useDashboardStats()

  if (isError) {
    return (
      <AdminWrapper>
        <div className="p-8">
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load dashboard data</p>
          </div>
        </div>
      </AdminWrapper>
    )
  }

  const statsConfig = [
    {
      title: "Total Blogs",
      value: stats?.totalBlogs?.value ?? 0,
      change: stats?.totalBlogs?.change ?? "Loading...",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Published Blogs",  
      value: stats?.publishedBlogs?.value ?? 0,
      change: stats?.publishedBlogs?.change ?? "Loading...",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Testimonials",
      value: stats?.testimonials?.value ?? 0,
      change: stats?.testimonials?.change ?? "Loading...",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Users",
      value: stats?.users?.value ?? 0,
      change: stats?.users?.change ?? "Loading...",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  return (
    <AdminWrapper>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Taxclusive admin portal. Manage your content and users from here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">
                          {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            stat.value
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in your admin portal</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`h-2 w-2 rounded-full ${
                        activity.type === 'blog' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.type === 'blog' ? 'Blog published' : 'Testimonial added'}: {activity.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Link 
                  href="/admin/blogs/new" 
                  className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer block"
                >
                  <div className="font-medium">Create New Blog</div>
                  <div className="text-sm text-muted-foreground">Write and publish a new blog post</div>
                </Link>
                <Link 
                  href="/admin/testimonials/new" 
                  className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer block"
                >
                  <div className="font-medium">Add Testimonial</div>
                  <div className="text-sm text-muted-foreground">Add a new client testimonial</div>
                </Link>
                <Link 
                  href="/admin/users" 
                  className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer block"
                >
                  <div className="font-medium">Manage Users</div>
                  <div className="text-sm text-muted-foreground">Add or edit admin users</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminWrapper>
  )
}