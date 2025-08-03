import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "./auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/admin/login")
  }
  return user
}

export async function requireRole(requiredRole: "ADMIN" | "EDITOR") {
  const user = await requireAuth()
  if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
    redirect("/admin")
  }
  return user
}

export function hasPermission(userRole: string, requiredRole: "ADMIN" | "EDITOR") {
  if (requiredRole === "EDITOR") {
    return userRole === "ADMIN" || userRole === "EDITOR"
  }
  return userRole === "ADMIN"
}