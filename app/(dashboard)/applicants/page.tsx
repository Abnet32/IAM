"use client"

import Link from "next/link"
import { useApplicants, useUpdateStatus, useReferenceData } from "@/src/hooks/use-api"
import { useFilterStore } from "@/src/store"
import type { Track, ExperienceLevel, ApplicationStatus, SortBy } from "@/src/types/api"
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
  X,
} from "lucide-react"

const statusBadge: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  shortlisted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
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

  const hasFilters = filters.search || filters.status || filters.track

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and review internship applicants
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="h-9 pl-9 pr-9"
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
          />
          {filters.search && (
            <button
              onClick={() => filters.setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.status || "all"} onValueChange={(v) => filters.setStatus(v === "all" ? "" : (v ?? ""))}>
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

          <Select value={filters.track || "all"} onValueChange={(v) => filters.setTrack(v === "all" ? "" : (v ?? ""))}>
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

          <Select value={filters.sortBy} onValueChange={(v) => filters.setSortBy((v ?? "applicationDate") as SortBy)}>
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
            className="h-9 px-2.5"
            onClick={() =>
              filters.setSortOrder(filters.sortOrder === "asc" ? "desc" : "asc")
            }
          >
            <ArrowUpDown className="size-3.5" />
            {filters.sortOrder === "asc" ? "ASC" : "DESC"}
          </Button>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-muted-foreground"
              onClick={() => {
                filters.setSearch("")
                filters.setStatus("")
                filters.setTrack("")
              }}
            >
              <X className="size-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-destructive/20">
          <p className="text-sm text-muted-foreground">
            Failed to load applicants. Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Track</TableHead>
                  <TableHead className="font-semibold">Country</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
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
                    <TableRow key={app.id} className="group">
                      <TableCell className="font-medium">
                        <Link
                          href={`/applicants/${app.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {app.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{app.email}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{app.track.replace("-", " ")}</TableCell>
                      <TableCell className="text-muted-foreground">{app.country}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium capitalize ${statusBadge[app.status]}`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm tabular-nums">
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              render={
                                <Link href={`/applicants/${app.id}`} />
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
                                    Mark as {s}
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

          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing <span className="font-medium text-foreground">{from}</span>
                {" - "}
                <span className="font-medium text-foreground">{to}</span>
                {" of "}
                <span className="font-medium text-foreground">{meta.total}</span>
              </p>
              <div className="flex items-center gap-1">
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
                <span className="px-3 text-sm font-medium">
                  {meta.page} / {totalPages}
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
