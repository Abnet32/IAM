export type Track = "frontend" | "backend" | "ui-ux" | "data-analytics" | "mobile"

export type ApplicationStatus = "pending" | "shortlisted" | "accepted" | "rejected"

export type ExperienceLevel = "beginner" | "intermediate" | "advanced"

export type SortBy = "fullName" | "email" | "applicationDate" | "status" | "track"

export interface User {
  id: string
  fullName: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface ApplicantSummary {
  id: string
  fullName: string
  email: string
  country: string
  track: Track
  status: ApplicationStatus
  applicationDate: string
  updatedAt: string
}

export interface Applicant extends ApplicantSummary {
  phoneNumber: string
  skills: string[]
  experienceLevel: ExperienceLevel
  portfolioUrl: string | null
  githubUrl: string | null
  linkedInUrl: string | null
  motivation: string | null
  notes: string | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedApplicants {
  data: ApplicantSummary[]
  meta: PaginationMeta
}

export interface DashboardSummary {
  totalApplicants: number
  byStatus: Record<string, number>
  byTrack: Record<string, number>
}

export interface NotesResponse {
  id: string
  notes: string | null
  updatedAt: string
}

export interface GetApplicantsParams {
  page?: number
  limit?: number
  search?: string
  status?: ApplicationStatus
  track?: Track
  country?: string
  experienceLevel?: ExperienceLevel
  sortBy?: SortBy
  sortOrder?: "asc" | "desc"
  simulateError?: boolean
  delay?: number
}
