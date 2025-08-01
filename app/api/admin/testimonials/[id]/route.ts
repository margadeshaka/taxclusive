import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      name, 
      designation, 
      company, 
      location, 
      content, 
      rating, 
      avatar, 
      featured, 
      approved 
    } = await req.json()

    const testimonialId = params.id

    const testimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: {
        name,
        designation,
        company,
        location,
        content,
        rating,
        avatar,
        featured,
        approved
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const testimonialId = params.id

    await prisma.testimonial.delete({
      where: { id: testimonialId }
    })

    return NextResponse.json({ message: "Testimonial deleted successfully" })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}