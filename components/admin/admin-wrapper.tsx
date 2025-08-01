"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminNav } from "./admin-nav"
import { Loader2 } from "lucide-react"

interface AdminWrapperProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "EDITOR"
}

export function AdminWrapper({ children, requiredRole = "EDITOR" }: AdminWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/admin/login")
      return
    }

    if (requiredRole === "ADMIN" && session.user.role !== "ADMIN") {
      router.push("/admin")
      return
    }
  }, [session, status, router, requiredRole])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (requiredRole === "ADMIN" && session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}