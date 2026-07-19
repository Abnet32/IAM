"use client"

import Link from "next/link"
import { useApplicants, useUpdateStatus, useReferenceData } from "@/src/hooks/use-api"
import { useFilterStore } from "@/src/store"
import type { Track, ExperienceLevel, ApplicationStatus } from "@/src/types/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react"

const statusColor: Record<string, string> = {
  pending: "bg-warning/10 text-warning hover:bg-warning/20",
  shortlisted: "bg-primary/10 text-primary hover:bg-primary/20",
  accepted: "bg-success/10 text-success hover:bg-success/20",
  rejected: "bg-destructive/10 text-destructive hover:bg-destructive/20",
}

export default function ApplicantsPage() {
  const filters = useFilterStore()
  const { data, isLoading, error } = useApplicants({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    status: (filters.status as ApplicationStatus) || undefined,
    track: (filters.track as Track) || undefined,
    country: filters.country || undefined,
    experienceLevel: (filters.experienceLevel as ExperienceLevel) || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder || undefined,
  })
  const refData = useReferenceData()
  const updateStatus = useUpdateStatus()

  const applicants = data?.data ?? []
  const meta = data?.meta

  const totalPages = meta?.totalPages ?? 1
  const from = meta ? (meta.page - 1) * meta.limit + 1 : 0
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applicants</h1>
        <p className="text-sm text-muted-foreground">
          Manage and review internship applicants
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="h-9 pl-8"
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
          />
        </div>

        <Select value={filters.status} onValueChange={(v) => filters.setStatus(v ?? "")}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.track} onValueChange={(v) => filters.setTrack(v ?? "")}>
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="Track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {refData.data?.tracks.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => filters.setSortBy(v ?? "applicationDate")}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="applicationDate">Date</SelectItem>
            <SelectItem value="fullName">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="track">Track</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() =>
            filters.setSortOrder(filters.sortOrder === "asc" ? "desc" : "asc")
          }
        >
          <ArrowUpDown className="mr-1 size-3" />
          {filters.sortOrder === "asc" ? "ASC" : "DESC"}
        </Button>
      </div>

      {error ? (
        <div className="flex h-64 items-center justify-center rounded-xs border">
          <p className="text-sm text-muted-foreground">
            Failed to load applicants. Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xs border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : applicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No applicants found.
                    </TableCell>
                  </TableRow>
                ) : (
                  applicants.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/applicants/${app.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {app.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{app.email}</TableCell>
                      <TableCell className="capitalize">{app.track.replace("-", " ")}</TableCell>
                      <TableCell>{app.country}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${statusColor[app.status]}`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="size-8" />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              render={
                                <Link href={`/dashboard/applicants/${app.id}`} />
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {(["pending", "shortlisted", "accepted", "rejected"] as const).map(
                              (s) =>
                                s !== app.status && (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={() =>
                                      updateStatus.mutate({ id: app.id, status: s })
                                    }
                                    className="capitalize"
                                  >
                                    {s}
                                  </DropdownMenuItem>
                                )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {meta && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing {from}-{to} of {meta.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={meta.page <= 1}
                  onClick={() => filters.setPage(1)}
                >
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={meta.page <= 1}
                  onClick={() => filters.setPage(meta.page - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="px-2">
                  Page {meta.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={meta.page >= totalPages}
                  onClick={() => filters.setPage(meta.page + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={meta.page >= totalPages}
                  onClick={() => filters.setPage(totalPages)}
                >
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
