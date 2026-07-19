"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/theme-toggle"
import { Search, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/src/store"
import { useHydrateAuth } from "@/hooks/use-hydrate-auth"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const pageNames: Record<string, string> = {
  dashboard: "Dashboard",
  applicants: "Applicants",
  statistics: "Statistics",
  settings: "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()
  const hydrated = useHydrateAuth()
  const { user } = useAuthStore()
  const segments = pathname.split("/").filter(Boolean)

  const dashboardSegment = segments[1] || "dashboard"
  const pageName = pageNames[dashboardSegment] || dashboardSegment
  const isDetail = segments.length > 2

  const initials = hydrated && user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "A"
  const displayName = hydrated && user?.fullName ? user.fullName : "Admin"
  const displayEmail = hydrated && user?.email ? user.email : "admin@infnova.tech"

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isDetail ? (
              <>
                <BreadcrumbLink href="/dashboard/applicants">
                  Applicants
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </>
            ) : (
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-9 w-48 pl-8 text-sm lg:w-64"
          />
        </div>

        <Button variant="ghost" size="icon" className="size-9">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="flex items-center gap-2 p-1" />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:block">
              {displayName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{displayEmail}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              useAuthStore.getState().clearAuth()
              window.location.href = "/login"
            }}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
