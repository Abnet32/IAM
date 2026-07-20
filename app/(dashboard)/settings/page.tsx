"use client"

import { useState, useCallback, useMemo, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useAuthStore } from "@/src/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sun, Moon, Laptop, Save, Check } from "lucide-react"

const emptySubscribe = () => () => {}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, token } = useAuthStore()
  const [name, setName] = useState("Admin")
  const [email, setEmail] = useState(user?.email ?? "admin@infnova.tech")
  const [saved, setSaved] = useState(false)

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const isDirty = useMemo(
    () => name !== "Admin" || email !== (user?.email ?? "admin@infnova.tech"),
    [name, email, user],
  )

  const handleSave = useCallback(() => {
    if (!token) return
    useAuthStore.getState().setAuth(token, { fullName: name, email })
    setSaved(true)
    toast.success("Settings saved")
    setTimeout(() => setSaved(false), 2000)
  }, [token, name, email])

  const handleCancel = useCallback(() => {
    setName("Admin")
    setEmail(user?.email ?? "admin@infnova.tech")
  }, [user])

  return (
    <div className="space-y-6 max-w-2xl page-enter">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Profile</CardTitle>
          <CardDescription className="text-xs">Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9"
            />
          </div>
          <Separator />
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" className="font-medium" onClick={handleCancel} disabled={!isDirty}>
              Cancel
            </Button>
            <Button size="sm" className="font-medium" onClick={handleSave} disabled={!isDirty}>
              {saved ? (
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5" />
                  Saved
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Save className="size-3.5" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Appearance</CardTitle>
          <CardDescription className="text-xs">Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          {mounted ? (
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                className="flex-1 flex items-center gap-2 font-medium"
                onClick={() => setTheme("light")}
              >
                <Sun className="size-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                className="flex-1 flex items-center gap-2 font-medium"
                onClick={() => setTheme("dark")}
              >
                <Moon className="size-4" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                className="flex-1 flex items-center gap-2 font-medium"
                onClick={() => setTheme("system")}
              >
                <Laptop className="size-4" />
                System
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 h-7 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 h-7 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 h-7 rounded-lg bg-muted animate-pulse" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
