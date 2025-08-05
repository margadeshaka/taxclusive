import { Metadata } from "next"
import { SessionProvider } from "@/components/admin/session-provider"

export const metadata: Metadata = {
  title: "Admin Portal | Taxclusive",
  description: "Taxclusive Admin Dashboard",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}