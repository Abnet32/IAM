"use client"

import { useDashboard } from "@/src/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="size-4 text-warning" />,
  shortlisted: <Users className="size-4 text-primary" />,
  accepted: <CheckCircle className="size-4 text-success" />,
  rejected: <XCircle className="size-4 text-destructive" />,
}

export default function StatisticsPage() {
  const { data: dashData, isLoading, error } = useDashboard()

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load statistics.</p>
      </div>
    )
  }

  const total = dashData?.totalApplicants ?? 0
  const accepted = dashData?.byStatus?.accepted ?? 0
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
        <p className="text-sm text-muted-foreground">Aggregate overview of applicants</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : [
              { label: "Total Applications", value: total, icon: Users },
              { label: "Acceptance Rate", value: `${acceptanceRate}%`, icon: TrendingUp },
              { label: "Shortlisted", value: dashData?.byStatus?.shortlisted ?? 0, icon: Users },
              { label: "Rejected", value: dashData?.byStatus?.rejected ?? 0, icon: XCircle },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">By Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : dashData?.byStatus ? (
              <div className="space-y-4">
                {Object.entries(dashData.byStatus).map(([status, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {statusIcons[status]}
                          <span className="capitalize">{status}</span>
                        </div>
                        <span className="font-medium">{count}</span>
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
              <p className="text-sm text-muted-foreground">No data.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">By Track</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : dashData?.byTrack ? (
              <div className="space-y-4">
                {Object.entries(dashData.byTrack).map(([track, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={track} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{track.replace("-", " ")}</span>
                        <span className="font-medium">{count}</span>
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
              <p className="text-sm text-muted-foreground">No data.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
