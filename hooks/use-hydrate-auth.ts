"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/src/store"

export function useHydrateAuth() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const hydrated = useAuthStore((s) => s.hydrated)

  useEffect(() => {
    if (!hydrated) {
      hydrate()
    }
  }, [hydrated, hydrate])

  return hydrated
}
