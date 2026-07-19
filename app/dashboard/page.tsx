"use client"

import Link from "next/link"
import { useDashboard } from "@/src/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Clock, CheckCircle, XCircle, BarChart3 } from "lucide-react"

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="size-4 text-warning" />,
  shortlisted: <Users className="size-4 text-primary" />,
  accepted: <CheckCircle className="size-4 text-success" />,
  rejected: <XCircle className="size-4 text-destructive" />,
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your internship program</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data?.totalApplicants ?? 0}</div>
            )}
          </CardContent>
        </Card>

        {data?.byStatus &&
          Object.entries(data.byStatus).map(([status, count]) => (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium capitalize">{status}</CardTitle>
                {statusIcons[status] || <Users className="size-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Applications by Track</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : data?.byTrack && Object.keys(data.byTrack).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.byTrack).map(([track, count]) => {
                  const total = Object.values(data.byTrack).reduce((a, b) => a + b, 0)
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={track} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{track.replace("-", " ")}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 rounded-xs bg-muted">
                        <div
                          className="h-full rounded-xs bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No track data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/applicants"
              className="flex items-center gap-2 rounded-xs border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Users className="size-4 text-primary" />
              View All Applicants
            </Link>
            <Link
              href="/dashboard/statistics"
              className="flex items-center gap-2 rounded-xs border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <BarChart3 className="size-4 text-primary" />
              View Statistics
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
