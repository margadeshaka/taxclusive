import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: blogId } = await params

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: true
      }
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      title, 
      excerpt, 
      content, 
      coverImage, 
      status, 
      featured, 
      tags = [] 
    } = await req.json()

    const { id: blogId } = await params

    // Get current blog to check if slug needs updating
    const currentBlog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: { tags: true }
    })

    if (!currentBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    let slug = currentBlog.slug

    // If title changed, generate new slug
    if (title !== currentBlog.title) {
      slug = generateSlug(title)
      
      // Ensure slug is unique (excluding current blog)
      let counter = 1
      const originalSlug = slug
      while (await prisma.blog.findFirst({ 
        where: { 
          slug, 
          id: { not: blogId } 
        } 
      })) {
        slug = `${originalSlug}-${counter}`
        counter++
      }
    }

    // Handle tags
    const tagConnections = []
    for (const tagName of tags) {
      if (tagName.trim()) {
        const tagSlug = generateSlug(tagName)
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName.trim(),
            slug: tagSlug
          }
        })
        tagConnections.push({ id: tag.id })
      }
    }

    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        featured,
        publishedAt: status === "PUBLISHED" && currentBlog.status !== "PUBLISHED" 
          ? new Date() 
          : currentBlog.publishedAt,
        tags: {
          set: tagConnections
        }
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: true
      }
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: blogId } = await params

    await prisma.blog.delete({
      where: { id: blogId }
    })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}