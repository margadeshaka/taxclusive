"use client"

import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  Shield
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { SimpleThemeToggle } from "@/components/theme-toggle"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "EDITOR"]
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
    roles: ["ADMIN", "EDITOR"]
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
    roles: ["ADMIN", "EDITOR"]
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"]
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN"]
  }
]

export function AdminNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  const userRole = session?.user?.role

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Taxclusive</p>
          </div>
        </div>
        <SimpleThemeToggle />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          if (!userRole || !item.roles.includes(userRole)) {
            return null
          }

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || session?.user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.role}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}