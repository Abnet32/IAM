"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  DotProps,
} from "recharts"
import type { DashboardSummary } from "@/src/types/api"

const TRACK_CONFIG = [
  { key: "frontend", label: "Frontend", color: "#3b82f6" },
  { key: "backend", label: "Backend", color: "#10b981" },
  { key: "ui-ux", label: "UI/UX", color: "#8b5cf6" },
  { key: "data-analytics", label: "Data Analytics", color: "#f59e0b" },
  { key: "mobile", label: "Mobile", color: "#ec4899" },
] as const

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { label: string; count: number; color: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-semibold" style={{ color: d.color }}>{d.label}</p>
      <p className="text-sm font-bold text-foreground">{d.count} applicants</p>
    </div>
  )
}

function CustomDot(props: DotProps & { payload?: { color: string } }) {
  const { cx, cy, payload } = props
  if (!cx || !cy || !payload) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={payload.color}
      stroke="hsl(var(--background))"
      strokeWidth={2}
    />
  )
}

export function HiringPipelineCard({
  data,
  isLoading = false,
}: {
  data: DashboardSummary
  isLoading?: boolean
}) {
  const chartData = useMemo(() => {
    return TRACK_CONFIG.map((t) => ({
      label: t.label,
      count: data.byTrack[t.key] ?? 0,
      color: t.color,
    }))
  }, [data])

  const primaryColor = "#8b5cf6"

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (data.totalApplicants === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Overview by Track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>
              </div>
              <p className="text-sm text-muted-foreground">No track data available.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">Overview by Track</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
            <defs>
              <linearGradient id="trackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={primaryColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "var(--foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "hsl(var(--muted-foreground))" }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={primaryColor}
              strokeWidth={2.5}
              fill="url(#trackGradient)"
              dot={<CustomDot />}
              activeDot={{ r: 7, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="space-y-3 border-t pt-4">
          {chartData.map((track) => {
            const pct = data.totalApplicants > 0
              ? Math.round((track.count / data.totalApplicants) * 100)
              : 0

            return (
              <div key={track.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="text-xs font-medium text-foreground">{track.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground tabular-nums">{track.count}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">({pct}%)</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: track.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
