"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, UserRole } from "@/components/app-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListTodo,
  MapPin,
  Shield,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  BarChart3,
  Users,
  FileSearch,
} from "lucide-react";

const navItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
  student: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Report Issue", href: "/report", icon: MessageSquarePlus },
    { label: "All Issues", href: "/issues", icon: ListTodo },
  ],
  faculty: [
    { label: "Dashboard", href: "/faculty", icon: LayoutDashboard },
    { label: "All Issues", href: "/issues", icon: ListTodo },
    // Removed duplicate Analytics link, as Dashboard usually covers it. 
    // If a separate page is needed, it should have a unique route like /faculty/analytics.
    // For now, keeping it simple as requested.
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "All Issues", href: "/issues", icon: ListTodo },
    // Assuming Users and Audit Log are tabs on the Admin Dashboard for now, 
    // or we can make them query params to open specific tabs.
    { label: "Locations", href: "/locations", icon: MapPin },
  ],
};

export function AppSidebar() {
  const { role, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const pathname = usePathname();
  const items = navItems[role];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary neon-glow">
          <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={1.5} />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <span className="text-sm font-bold tracking-tight block">CampusVoice</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Platform</span>
          </div>
        )}
      </div>

      {/* Nav Label */}
      {!sidebarCollapsed && (
        <div className="px-4 pt-5 pb-2">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Navigation</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className={cn("flex-1 space-y-1 overflow-y-auto", sidebarCollapsed ? "px-2 pt-4" : "px-3")}>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <item.icon className={cn("h-[18px] w-[18px] shrink-0", sidebarCollapsed && "mx-auto")} strokeWidth={1.5} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Left-side role badge and logout removed — moved into top-right profile menu */}

      {/* Collapse Toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex w-full items-center justify-center rounded-xl p-2.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors duration-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </aside>
  );
}
