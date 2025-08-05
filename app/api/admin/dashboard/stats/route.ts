import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date for month/week calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get total counts
    const [
      totalBlogs,
      publishedBlogs,
      totalTestimonials,
      totalUsers,
      blogsThisMonth,
      blogsLastMonth,
      testimonialsThisWeek,
      recentBlogs,
      recentTestimonials
    ] = await Promise.all([
      // Total blogs
      prisma.blog.count(),
      
      // Published blogs only
      prisma.blog.count({
        where: { status: "PUBLISHED" }
      }),
      
      // Total testimonials
      prisma.testimonial.count(),
      
      // Total users
      prisma.user.count(),
      
      // Blogs created this month
      prisma.blog.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      
      // Blogs created last month
      prisma.blog.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Testimonials this week
      prisma.testimonial.count({
        where: {
          createdAt: {
            gte: startOfWeek
          }
        }
      }),
      
      // Recent published blogs
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: {
          title: true,
          createdAt: true,
          updatedAt: true,
          status: true
        },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      
      // Recent testimonials
      prisma.testimonial.findMany({
        select: {
          name: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ])

    // Combine and sort recent activity
    const recentActivity = [
      ...recentBlogs.map(blog => ({
        type: 'blog',
        name: blog.title,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
        status: blog.status
      })),
      ...recentTestimonials.map(testimonial => ({
        type: 'testimonial',
        name: testimonial.name,
        createdAt: testimonial.createdAt.toISOString(),
        updatedAt: testimonial.updatedAt.toISOString(),
        status: 'published'
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 10)

    // Calculate percentage changes
    const blogGrowthRate = blogsLastMonth > 0 
      ? Math.round(((blogsThisMonth - blogsLastMonth) / blogsLastMonth) * 100)
      : blogsThisMonth > 0 ? 100 : 0

    const stats = {
      totalBlogs: {
        value: totalBlogs,
        change: blogsThisMonth > 0 ? `+${blogsThisMonth} this month` : "No new blogs this month",
        trend: blogGrowthRate
      },
      publishedBlogs: {
        value: publishedBlogs,
        change: `${totalBlogs - publishedBlogs} drafts`,
        trend: 0
      },
      testimonials: {
        value: totalTestimonials,
        change: testimonialsThisWeek > 0 ? `+${testimonialsThisWeek} this week` : "No new testimonials this week",
        trend: testimonialsThisWeek
      },
      users: {
        value: totalUsers,
        change: "Active users",
        trend: 0
      },
      recentActivity: recentActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}