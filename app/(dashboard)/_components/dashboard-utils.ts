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
