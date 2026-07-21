"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { LucideIcon } from "lucide-react"

interface DashboardStatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  isLoading?: boolean
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  change,
  changeType = "neutral",
  isLoading = false,
}: DashboardStatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="size-7 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    )
  }

  const changeColor =
    changeType === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : changeType === "negative"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground"

  return (
    <Card className="group transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`flex size-7 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`size-3.5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {change && (
            <p className={`mt-0.5 text-xs ${changeColor}`}>{change}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
