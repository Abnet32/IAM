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
} from "lucide-react"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  shortlisted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
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
    <div className="space-y-6 page-enter">
      <div className="flex items-center gap-4">
        <Link href="/applicants" className="inline-flex">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{applicant.fullName}</h1>
          <p className="text-sm text-muted-foreground">Applicant Profile</p>
        </div>
        <Badge variant="outline" className={`ml-auto text-xs font-medium capitalize ${statusColor[applicant.status]}`}>
          {applicant.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <a href={`mailto:${applicant.email}`} className="hover:text-primary transition-colors">
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
              <CardTitle className="text-sm font-semibold">Skills & Links</CardTitle>
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
              <div className="flex flex-wrap gap-3">
                {applicant.portfolioUrl && (
                  <a
                    href={applicant.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
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
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <GitHubIcon className="size-4" />
                    GitHub
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {applicant.linkedInUrl && (
                  <a
                    href={applicant.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <LinkedInIcon className="size-4" />
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
                <CardTitle className="text-sm font-semibold">Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{applicant.motivation}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Admin Notes</CardTitle>
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
                className="font-medium"
                onClick={handleSaveNotes}
                disabled={updateNotes.isPending}
              >
                {updateNotes.isPending ? (
                  <span className="flex items-center gap-1.5">
                    <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Save className="size-3.5" />
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
              <CardTitle className="text-sm font-semibold">Application</CardTitle>
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
                <span className="font-medium tabular-nums">
                  {new Date(applicant.applicationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium tabular-nums">
                  {new Date(applicant.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["pending", "shortlisted", "accepted", "rejected"] as const).map((s) => (
                <Button
                  key={s}
                  variant={applicant.status === s ? "default" : "outline"}
                  size="sm"
                  className="w-full capitalize font-medium"
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
              <CardTitle className="text-sm font-semibold">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="size-2 rounded-full bg-primary" />
                  <div className="w-px flex-1 bg-border" />
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium">Applied</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
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
