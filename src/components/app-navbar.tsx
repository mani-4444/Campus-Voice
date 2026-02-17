"use client";

import { useTheme } from "next-themes";
import { useApp } from "@/components/app-context";
import { cn } from "@/lib/utils";
import { Search, Bell, Sun, Moon, ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";

export function AppNavbar() {
  const { theme, setTheme } = useTheme();
  const { role, sidebarCollapsed, signOut } = useApp();
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => setMounted(true), []);

  const roleLabel =
    role === "student" ? "Student" : role === "faculty" ? "Faculty" : "Admin";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6 transition-all duration-300",
        sidebarCollapsed ? "left-[68px]" : "left-[240px]",
      )}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
            searchFocused ? "text-primary" : "text-muted-foreground",
          )}
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder="Search issues, users, locations..."
          className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary pulse-live" />
        </button>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} />
            ) : (
              <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            )}
          </button>
        )}

        {/* Profile dropdown (moved here from sidebar) */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((s) => !s)}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 cursor-pointer hover:bg-muted transition-colors duration-200"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium leading-none">{roleLabel}</p>
            </div>
            <ChevronDown
              className="h-3 w-3 text-muted-foreground"
              strokeWidth={1.5}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
              <a
                href="/profile"
                className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
              >
                View Profile
              </a>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
