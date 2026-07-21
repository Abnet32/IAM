"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Providers } from "@/src/providers/providers"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider style={{ "--sidebar-width": "17.5rem" } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 px-6 py-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  )
}
