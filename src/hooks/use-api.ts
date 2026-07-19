import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "../services/api"
import type { GetApplicantsParams, ApplicationStatus } from "../types/api"

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: api.getMe,
    staleTime: 5 * 60 * 1000,
  })
}

export function useApplicants(params?: GetApplicantsParams) {
  return useQuery({
    queryKey: ["applicants", params],
    queryFn: () => api.getApplicants(params),
    placeholderData: (prev) => prev,
  })
}

export function useApplicant(id: string) {
  return useQuery({
    queryKey: ["applicant", id],
    queryFn: () => api.getApplicant(id),
    enabled: !!id,
  })
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboardSummary,
    refetchInterval: 30_000,
  })
}

export function useUpdateStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      api.updateApplicantStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applicants"] })
      qc.invalidateQueries({ queryKey: ["applicant"] })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateNotes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string | null }) =>
      api.updateApplicantNotes(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applicant"] })
    },
  })
}

export function useResetSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.resetSession,
    onSuccess: () => {
      qc.invalidateQueries()
    },
  })
}

export function useReferenceData() {
  return useQuery({
    queryKey: ["reference-data"],
    queryFn: async () => {
      const [tracks, countries, levels] = await Promise.all([
        api.getTracks(),
        api.getCountries(),
        api.getExperienceLevels(),
      ])
      return { tracks, countries, levels }
    },
    staleTime: Infinity,
  })
}
