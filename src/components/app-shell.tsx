"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";
import { useApp } from "@/components/app-context";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppNavbar />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          sidebarCollapsed ? "pl-[68px]" : "pl-[240px]",
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
