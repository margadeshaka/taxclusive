"use client"

import { FileText, MessageSquare, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

import { AdminWrapper } from "@/components/admin/admin-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Blogs",
    value: "24",
    change: "+3 this month",
    icon: FileText,
    color: "text-blue-600"
  },
  {
    title: "Testimonials",
    value: "18",
    change: "+2 this week",
    icon: MessageSquare,
    color: "text-green-600"
  },
  {
    title: "Users",
    value: "5",
    change: "Active admins",
    icon: Users,
    color: "text-purple-600"
  },
  {
    title: "Page Views",
    value: "12.3K",
    change: "+15% this month",
    icon: TrendingUp,
    color: "text-orange-600"
  }
]

export default function AdminDashboard() {
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
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
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
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New blog post published</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Testimonial approved</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
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