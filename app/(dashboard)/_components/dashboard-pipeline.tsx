"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardSummary } from "@/src/types/api"

const PIPELINE_STAGES = [
  { key: "pending", label: "Applied", color: "bg-amber-500" },
  { key: "shortlisted", label: "Screening", color: "bg-blue-500" },
  { key: "accepted", label: "Interview", color: "bg-emerald-500" },
  { key: "accepted", label: "Accepted", color: "bg-primary" },
] as const

export function HiringPipelineCard({
  data,
  isLoading = false,
}: {
  data: DashboardSummary
  isLoading?: boolean
}) {
  const stages = useMemo(() => {
    const total = data.totalApplicants || 1
    const pending = data.byStatus.pending ?? 0
    const shortlisted = data.byStatus.shortlisted ?? 0
    const accepted = data.byStatus.accepted ?? 0
    const rejected = data.byStatus.rejected ?? 0

    return [
      { label: "Applied", count: total, pct: 100, color: "bg-amber-500 dark:bg-amber-400" },
      { label: "Screening", count: shortlisted + accepted + rejected, pct: total > 0 ? Math.round(((shortlisted + accepted + rejected) / total) * 100) : 0, color: "bg-blue-500 dark:bg-blue-400" },
      { label: "Interview", count: shortlisted, pct: total > 0 ? Math.round((shortlisted / total) * 100) : 0, color: "bg-emerald-500 dark:bg-emerald-400" },
      { label: "Accepted", count: accepted, pct: total > 0 ? Math.round((accepted / total) * 100) : 0, color: "bg-primary" },
    ]
  }, [data])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.totalApplicants === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Hiring Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>
              </div>
              <p className="text-sm text-muted-foreground">No pipeline data available.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">Hiring Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, i) => (
            <div key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-medium text-foreground">{stage.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground tabular-nums">{stage.count}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">({stage.pct}%)</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                  style={{ width: `${stage.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
