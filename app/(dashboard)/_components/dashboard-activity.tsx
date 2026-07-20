"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, ArrowRight, XCircle } from "lucide-react"

interface Activity {
  icon: string
  time: string
  description: string
  color: string
}

const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  ArrowRight,
  XCircle,
}

export function RecentActivityTimeline({
  activities,
  isLoading = false,
}: {
  activities: Activity[]
  isLoading?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0 max-h-[320px] overflow-y-auto">
            {activities.map((activity, i) => {
              const Icon = iconMap[activity.icon] || CheckCircle
              return (
                <div key={i} className="flex gap-3 group">
                  <div className="flex flex-col items-center">
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-muted ${activity.color}`}>
                      <Icon className="size-3" />
                    </div>
                    {i < activities.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{activity.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
