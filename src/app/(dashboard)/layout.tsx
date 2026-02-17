"use client";

import { AppShell } from "@/components/app-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Middleware handles auth redirection, so this layout just renders the app shell
  return <AppShell>{children}</AppShell>;
}
