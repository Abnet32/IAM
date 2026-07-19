"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useApplicant, useUpdateStatus, useUpdateNotes } from "@/src/hooks/use-api"
import type { ApplicationStatus } from "@/src/types/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Save,
  Mail,
  Phone,
  MapPin,
  Award,
  Home,
  GitBranch,
} from "lucide-react"

const statusColor: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  shortlisted: "bg-primary/10 text-primary",
  accepted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
}

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: applicant, isLoading, error } = useApplicant(id)
  const updateStatus = useUpdateStatus()
  const updateNotes = useUpdateNotes()
  const [editedNotes, setEditedNotes] = useState<string | null>(null)

  const displayNotes = editedNotes ?? applicant?.notes ?? ""

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !applicant) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Applicant not found.</p>
      </div>
    )
  }

  const handleStatusChange = (status: ApplicationStatus) => {
    updateStatus.mutate({ id, status })
  }

  const handleSaveNotes = () => {
    updateNotes.mutate({ id, notes: displayNotes || null })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/applicants" className="inline-flex">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{applicant.fullName}</h1>
          <p className="text-sm text-muted-foreground">Applicant Profile</p>
        </div>
        <Badge className={`ml-auto text-xs capitalize ${statusColor[applicant.status]}`}>
          {applicant.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <a href={`mailto:${applicant.email}`} className="hover:text-primary">
                  {applicant.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <span>{applicant.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <span>{applicant.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="size-4 text-muted-foreground" />
                <span className="capitalize">{applicant.experienceLevel}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Skills & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {applicant.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                {applicant.portfolioUrl && (
                  <a
                    href={applicant.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Globe className="size-4" />
                    Portfolio
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {applicant.githubUrl && (
                  <a
                    href={applicant.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Home className="size-4" />
                    GitHub
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {applicant.linkedInUrl && (
                  <a
                    href={applicant.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <GitBranch className="size-4" />
                    LinkedIn
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {applicant.motivation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{applicant.motivation}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add internal notes about this applicant..."
                value={displayNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                rows={4}
              />
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={updateNotes.isPending}
              >
                {updateNotes.isPending ? (
                  <span className="flex items-center gap-1">
                    <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Save className="size-3" />
                    Save Notes
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Track</span>
                <span className="capitalize font-medium">{applicant.track.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="capitalize font-medium">{applicant.experienceLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied</span>
                <span className="font-medium">
                  {new Date(applicant.applicationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">
                  {new Date(applicant.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["pending", "shortlisted", "accepted", "rejected"] as const).map((s) => (
                <Button
                  key={s}
                  variant={applicant.status === s ? "default" : "outline"}
                  size="sm"
                  className="w-full capitalize"
                  disabled={applicant.status === s || updateStatus.isPending}
                  onClick={() => handleStatusChange(s)}
                >
                  {s}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="size-2 rounded-full bg-primary" />
                  <div className="w-px flex-1 bg-border" />
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium">Applied</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(applicant.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-2 rounded-full bg-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
