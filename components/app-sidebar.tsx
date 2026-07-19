"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Applicants", url: "/dashboard/applicants", icon: Users },
  { title: "Statistics", url: "/dashboard/statistics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const handleNav = () => setOpenMobile(false)

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <Link
          href="/dashboard"
          onClick={handleNav}
          className="flex items-center gap-2 px-4 pt-4"
        >
          <div className="flex size-8 items-center justify-center rounded-xs bg-primary text-primary-foreground text-sm font-bold">
            I
          </div>
          <span className="text-base font-semibold">InfNova</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/dashboard" && pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.url} onClick={handleNav} />}
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-4 py-2 text-xs text-sidebar-foreground">
              &copy; InfNova
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
