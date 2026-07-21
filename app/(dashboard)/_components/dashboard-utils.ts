import type { DashboardSummary } from "@/src/types/api"

export const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-3)",
  shortlisted: "var(--chart-4)",
  accepted: "var(--chart-1)",
  rejected: "var(--destructive)",
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Rejected",
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  return "Good Evening"
}

export function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function computeInsights(data: DashboardSummary) {
  const total = data.totalApplicants
  const accepted = data.byStatus.accepted ?? 0
  const rejected = data.byStatus.rejected ?? 0
  const pending = data.byStatus.pending ?? 0
  const shortlisted = data.byStatus.shortlisted ?? 0

  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0
  const avgPerDay = total > 0 ? Math.max(1, Math.round(total / 14)) : 0

  let topTrack = "N/A"
  let topTrackCount = 0
  if (data.byTrack) {
    for (const [track, count] of Object.entries(data.byTrack)) {
      if (count > topTrackCount) {
        topTrackCount = count
        topTrack = track.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
      }
    }
  }

  return { acceptanceRate, rejectionRate, avgPerDay, topTrack, topTrackCount, pending, shortlisted }
}
