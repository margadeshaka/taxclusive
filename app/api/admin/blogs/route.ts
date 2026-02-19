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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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
      tags = [],
      slug: customSlug,
      metaTitle,
      metaDescription,
      focusKeyword,
      ogImage,
    } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Use custom slug if provided, otherwise generate from title
    let slug = customSlug && customSlug.trim() !== "" ? customSlug.trim() : generateSlug(title)
    
    // Ensure slug is unique
    let counter = 1
    const originalSlug = slug
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`
      counter++
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

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status: (["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status) ? status : "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        featured: featured || false,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        focusKeyword: focusKeyword || null,
        ogImage: ogImage || null,
        tags: {
          connect: tagConnections
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

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}