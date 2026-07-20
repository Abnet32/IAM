"use client"

import { useMemo } from "react"
import { useDashboard } from "@/src/hooks/use-api"
import { XCircle, Users, Clock, CheckCircle } from "lucide-react"
import { DashboardWelcome } from "./_components/dashboard-welcome"
import { DashboardStatsCard } from "./_components/dashboard-stats-card"
import { ApplicationTrendsCard } from "./_components/dashboard-charts"

import { TopUniversitiesCard } from "./_components/dashboard-universities"
import { HiringPipelineCard } from "./_components/dashboard-pipeline"
import { generateTrendData } from "./_components/dashboard-utils"

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  const total = data?.totalApplicants ?? 0
  const pending = data?.byStatus?.pending ?? 0
  const shortlisted = data?.byStatus?.shortlisted ?? 0
  const accepted = data?.byStatus?.accepted ?? 0
  const rejected = data?.byStatus?.rejected ?? 0

  const acceptanceRate = useMemo(
    () => (total > 0 ? Math.round((accepted / total) * 100) : 0),
    [total, accepted]
  )

  const sparkPending = useMemo(() => generateTrendData(pending || 5, "daily").map((d) => d.count), [pending])
  const sparkShortlisted = useMemo(() => generateTrendData(shortlisted || 3, "daily").map((d) => d.count), [shortlisted])
  const sparkAccepted = useMemo(() => generateTrendData(accepted || 2, "daily").map((d) => d.count), [accepted])
  const sparkRejected = useMemo(() => generateTrendData(rejected || 1, "daily").map((d) => d.count), [rejected])


  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto size-10 text-destructive/50" />
          <p className="mt-3 text-sm text-muted-foreground">Failed to load dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 page-enter">
      <DashboardWelcome />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardStatsCard
          title="Total Applicants"
          value={total}
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          change={`${total} total`}
          changeType="neutral"
          sparkData={sparkPending}
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Pending Review"
          value={pending}
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
          change={`${total > 0 ? Math.round((pending / total) * 100) : 0}% of total`}
          changeType="neutral"
          sparkData={sparkPending}
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Interview Stage"
          value={shortlisted}
          icon={Users}
          iconColor="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-500/10"
          change={`${total > 0 ? Math.round((shortlisted / total) * 100) : 0}% of total`}
          changeType="neutral"
          sparkData={sparkShortlisted}
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Accepted"
          value={accepted}
          icon={CheckCircle}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          change={`${acceptanceRate}% acceptance rate`}
          changeType="positive"
          sparkData={sparkAccepted}
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Rejected"
          value={rejected}
          icon={XCircle}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-500/10"
          change={`${total > 0 ? Math.round((rejected / total) * 100) : 0}% rejection rate`}
          changeType="negative"
          sparkData={sparkRejected}
          isLoading={isLoading}
        />
      </div>

      <ApplicationTrendsCard total={total} isLoading={isLoading} />

      <div className="grid gap-4 lg:grid-cols-2">
        <TopUniversitiesCard total={total} isLoading={isLoading} />
        <HiringPipelineCard
          data={data ?? { totalApplicants: 0, byStatus: {}, byTrack: {} }}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
