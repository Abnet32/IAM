"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/theme-toggle";
import { Search, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/src/store";
import { useHydrateAuth } from "@/hooks/use-hydrate-auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageNames: Record<string, string> = {
  "/": "Home",
  applicants: "Applicants",
  settings: "Settings",
};

export function SiteHeader() {
  const pathname = usePathname();
  const hydrated = useHydrateAuth();
  const { user } = useAuthStore();
  const segments = pathname.split("/").filter(Boolean);

  const topSegment = segments[0] || "";
  const pageName = pageNames[topSegment] || topSegment || "Overview";
  const isApplicantDetail = segments[0] === "applicants" && segments.length > 1;

  const initials =
    hydrated && user?.fullName
      ? user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "A";
  const displayName = "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {isApplicantDetail ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/applicants">Applicants</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : topSegment ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1">
        <ModeToggle />
      </div>
    </header>
  );
}
