"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Award, Target, XCircle, BarChart3 } from "lucide-react"
import type { DashboardSummary } from "@/src/types/api"
import { computeInsights } from "./dashboard-utils"

interface InsightItem {
  icon: React.ElementType
  label: string
  value: string
  color: string
  bg: string
}

export function QuickInsightsCard({
  data,
  isLoading = false,
}: {
  data: DashboardSummary
  isLoading?: boolean
}) {
  const insights = useMemo(() => {
    const i = computeInsights(data)
    const items: InsightItem[] = [
      { icon: TrendingUp, label: "Avg. per day", value: `${i.avgPerDay}`, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
      { icon: Award, label: "Top track", value: i.topTrack, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
      { icon: Target, label: "Acceptance rate", value: `${i.acceptanceRate}%`, color: "text-primary", bg: "bg-primary/10" },
      { icon: XCircle, label: "Rejection rate", value: `${i.rejectionRate}%`, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
      { icon: BarChart3, label: "Pending review", value: `${i.pending}`, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
    ]
    return items
  }, [data])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-7 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
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
          <CardTitle className="text-sm font-semibold text-foreground">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <p className="text-sm text-muted-foreground">No insights available yet.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">Quick Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div key={insight.label} className="flex items-center gap-3">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${insight.bg}`}>
                  <Icon className={`size-3.5 ${insight.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{insight.label}</p>
                  <p className="text-sm font-bold text-foreground truncate">{insight.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
