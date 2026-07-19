import api from "../lib/axios"
import type {
  LoginResponse,
  User,
  Applicant,
  ApplicantSummary,
  NotesResponse,
  DashboardSummary,
  GetApplicantsParams,
  PaginatedApplicants,
} from "../types/api"

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password })
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me")
  return data
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout")
}

export async function getApplicants(params?: GetApplicantsParams): Promise<PaginatedApplicants> {
  const query: Record<string, string | number | boolean | undefined> = {}
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "") query[key] = val
    })
  }
  const { data } = await api.get<PaginatedApplicants>("/applicants", { params: query })
  return data
}

export async function getApplicant(id: string): Promise<Applicant> {
  const { data } = await api.get<Applicant>(`/applicants/${id}`)
  return data
}

export async function updateApplicantStatus(id: string, status: string): Promise<ApplicantSummary> {
  const { data } = await api.patch<ApplicantSummary>(`/applicants/${id}/status`, { status })
  return data
}

export async function updateApplicantNotes(id: string, notes: string | null): Promise<NotesResponse> {
  const { data } = await api.patch<NotesResponse>(`/applicants/${id}/notes`, { notes })
  return data
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>("/dashboard/summary")
  return data
}

export async function resetSession(): Promise<void> {
  await api.post("/session/reset")
}

export async function getTracks(): Promise<{ value: string; label: string }[]> {
  const { data } = await api.get<{ data: { value: string; label: string }[] }>("/tracks")
  return data.data
}

export async function getCountries(): Promise<{ value: string; label: string }[]> {
  const { data } = await api.get<{ data: { value: string; label: string }[] }>("/countries")
  return data.data
}

export async function getExperienceLevels(): Promise<{ value: string; label: string }[]> {
  const { data } = await api.get<{ data: { value: string; label: string }[] }>("/experience-levels")
  return data.data
}
