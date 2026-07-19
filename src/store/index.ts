"use client"

import { create } from "zustand"
import type { SortBy } from "../types/api"

interface AuthState {
  token: string | null
  user: { fullName: string; email: string } | null
  hydrated: boolean
  setAuth: (token: string, user: { fullName: string; email: string }) => void
  clearAuth: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setAuth: (token, user) => {
    localStorage.setItem("access_token", token)
    localStorage.setItem("user", JSON.stringify(user))
    set({ token, user })
  },
  clearAuth: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    set({ token: null, user: null })
  },
  hydrate: () => {
    const token = localStorage.getItem("access_token")
    const user = JSON.parse(localStorage.getItem("user") || "null")
    set({ token, user, hydrated: true })
  },
}))

interface FilterState {
  search: string
  status: string
  track: string
  country: string
  experienceLevel: string
  sortBy: SortBy
  sortOrder: "asc" | "desc"
  page: number
  limit: number
  setSearch: (search: string) => void
  setStatus: (status: string) => void
  setTrack: (track: string) => void
  setCountry: (country: string) => void
  setExperienceLevel: (level: string) => void
  setSortBy: (sortBy: SortBy) => void
  setSortOrder: (order: "asc" | "desc") => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  search: "",
  status: "",
  track: "",
  country: "",
  experienceLevel: "",
  sortBy: "applicationDate",
  sortOrder: "desc",
  page: 1,
  limit: 10,
  setSearch: () => {},
  setStatus: () => {},
  setTrack: () => {},
  setCountry: () => {},
  setExperienceLevel: () => {},
  setSortBy: () => {},
  setSortOrder: () => {},
  setPage: () => {},
  setLimit: () => {},
  resetFilters: () => {},
}

export const useFilterStore = create<FilterState>((set) => ({
  search: defaultFilters.search,
  status: defaultFilters.status,
  track: defaultFilters.track,
  country: defaultFilters.country,
  experienceLevel: defaultFilters.experienceLevel,
  sortBy: defaultFilters.sortBy,
  sortOrder: defaultFilters.sortOrder,
  page: defaultFilters.page,
  limit: defaultFilters.limit,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setTrack: (track) => set({ track, page: 1 }),
  setCountry: (country) => set({ country, page: 1 }),
  setExperienceLevel: (level) => set({ experienceLevel: level, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  resetFilters: () => set({
    search: defaultFilters.search,
    status: defaultFilters.status,
    track: defaultFilters.track,
    country: defaultFilters.country,
    experienceLevel: defaultFilters.experienceLevel,
    sortBy: defaultFilters.sortBy,
    sortOrder: defaultFilters.sortOrder,
    page: defaultFilters.page,
    limit: defaultFilters.limit,
  }),
}))
