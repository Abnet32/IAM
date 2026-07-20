"use client"

import { create } from "zustand"

export interface Profile {
  fullName: string
  email: string
  phone: string
  jobTitle: string
  company: string
  bio: string
  avatarUrl: string | null
}

interface ProfileState {
  profile: Profile
  isDirty: boolean
  updateProfile: (updates: Partial<Profile>) => void
  resetProfile: () => void
  uploadAvatar: (url: string) => void
  removeAvatar: () => void
  saveProfile: () => void
}

const DEFAULT_PROFILE: Profile = {
  fullName: "Admin",
  email: "admin@infnova.tech",
  phone: "",
  jobTitle: "Administrator",
  company: "InfNova",
  bio: "",
  avatarUrl: null,
}

function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem("profile")
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_PROFILE
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  isDirty: false,

  updateProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
      isDirty: true,
    })),

  resetProfile: () =>
    set({
      profile: loadProfile(),
      isDirty: false,
    }),

  uploadAvatar: (url) =>
    set((state) => ({
      profile: { ...state.profile, avatarUrl: url },
      isDirty: true,
    })),

  removeAvatar: () =>
    set((state) => ({
      profile: { ...state.profile, avatarUrl: null },
      isDirty: true,
    })),

  saveProfile: () => {
    const { profile } = get()
    localStorage.setItem("profile", JSON.stringify(profile))
    set({ isDirty: false })
  },
}))

export interface NotificationPrefs {
  emailNotifications: boolean
  browserNotifications: boolean
  weeklyReports: boolean
  applicationUpdates: boolean
}

interface NotificationState {
  prefs: NotificationPrefs
  updatePref: (key: keyof NotificationPrefs, value: boolean) => void
}

function loadNotifications(): NotificationPrefs {
  if (typeof window === "undefined") {
    return { emailNotifications: true, browserNotifications: true, weeklyReports: false, applicationUpdates: true }
  }
  try {
    const raw = localStorage.getItem("notification_prefs")
    if (raw) return JSON.parse(raw)
  } catch {}
  return { emailNotifications: true, browserNotifications: true, weeklyReports: false, applicationUpdates: true }
}

export const useNotificationStore = create<NotificationState>((set) => ({
  prefs: { emailNotifications: true, browserNotifications: true, weeklyReports: false, applicationUpdates: true },

  updatePref: (key, value) =>
    set((state) => {
      const newPrefs = { ...state.prefs, [key]: value }
      localStorage.setItem("notification_prefs", JSON.stringify(newPrefs))
      return { prefs: newPrefs }
    }),
}))
