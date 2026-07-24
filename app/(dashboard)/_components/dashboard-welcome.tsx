"use client";

import { useAuthStore } from "@/src/store";
import { getGreeting, formatDate } from "./dashboard-utils";

export function DashboardWelcome() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {getGreeting()}, {user?.fullName ?? "Admin"}!
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s an overview of your internship recruitment pipeline.
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground/70">{formatDate()}</p>
    </div>
  );
}
