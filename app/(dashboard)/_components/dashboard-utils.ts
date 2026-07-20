import type { DashboardSummary, ApplicationStatus, Track } from "@/src/types/api"

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

export const STATUS_ICONS: Record<string, string> = {
  pending: "Clock",
  shortlisted: "Users",
  accepted: "CheckCircle",
  rejected: "XCircle",
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

export function generateTrendData(
  total: number,
  granularity: "daily" | "weekly" | "monthly"
): Array<{ name: string; count: number }> {
  const count = granularity === "daily" ? 14 : granularity === "weekly" ? 8 : 6
  const base = total / count
  const labels: string[] = []

  if (granularity === "daily") {
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
    }
  } else if (granularity === "weekly") {
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i * 7)
      labels.push(`W${count - i}`)
    }
  } else {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const m = new Date().getMonth()
    for (let i = count - 1; i >= 0; i--) {
      labels.push(months[(m - i + 12) % 12])
    }
  }

  const seed = total * 7 + 42
  return labels.map((name, i) => {
    const rand = Math.abs(Math.sin(seed + i * 13.37) * 10000) % 1
    const value = Math.max(1, Math.round(base * (0.6 + rand * 0.8)))
    return { name, count: value }
  })
}

export function generateUniversityData(
  total: number
): Array<{ name: string; count: number }> {
  const universities = [
    "Addis Ababa University",
    "Bahir Dar University",
    "Jimma University",
    "Hawassa University",
    "Mekelle University",
  ]
  const seed = total * 3 + 7
  const counts = universities.map((_, i) => {
    const rand = Math.abs(Math.sin(seed + i * 17.31) * 10000) % 1
    return Math.max(1, Math.round(total * (0.08 + rand * 0.2)))
  })
  const totalAssigned = counts.reduce((a, b) => a + b, 0)
  if (totalAssigned > total) {
    const scale = total / totalAssigned
    counts.forEach((_, i) => { counts[i] = Math.max(1, Math.round(counts[i] * scale)) })
  }
  return universities
    .map((name, i) => ({ name, count: counts[i] }))
    .sort((a, b) => b.count - a.count)
}

export function generateActivityData(
  applicants: Array<{ fullName: string; status: string; track: string; applicationDate: string; updatedAt?: string }>
): Array<{ icon: string; time: string; description: string; color: string; date: string }> {
  const activities: Array<{ icon: string; time: string; description: string; color: string; date: string }> = []

  for (const app of applicants) {
    const appDate = new Date(app.applicationDate)
    const now = new Date()

    const diffMs = now.getTime() - appDate.getTime()
    const diffH = Math.floor(diffMs / 3600000)
    const diffD = Math.floor(diffMs / 86400000)
    let time: string
    if (diffH < 1) time = "Just now"
    else if (diffH < 24) time = `${diffH}h ago`
    else if (diffD < 7) time = `${diffD}d ago`
    else time = appDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    activities.push({
      icon: "CheckCircle",
      time,
      description: `${app.fullName} submitted an application for ${app.track.replace("-", " ")}`,
      color: "text-emerald-500",
      date: app.applicationDate,
    })

    if (app.status !== "pending") {
      const statusDate = app.updatedAt ? new Date(app.updatedAt) : appDate
      const statusDiffMs = now.getTime() - statusDate.getTime()
      const statusDiffH = Math.floor(statusDiffMs / 3600000)
      const statusDiffD = Math.floor(statusDiffMs / 86400000)
      let statusTime: string
      if (statusDiffH < 1) statusTime = "Just now"
      else if (statusDiffH < 24) statusTime = `${statusDiffH}h ago`
      else if (statusDiffD < 7) statusTime = `${statusDiffD}d ago`
      else statusTime = statusDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      const statusLabel = STATUS_LABELS[app.status] || app.status
      activities.push({
        icon: app.status === "rejected" ? "XCircle" : "ArrowRight",
        time: statusTime,
        description: `${app.fullName} was moved to ${statusLabel}`,
        color: app.status === "rejected" ? "text-red-500" : "text-blue-500",
        date: app.updatedAt || app.applicationDate,
      })
    }
  }

  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
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
