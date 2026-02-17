"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Users,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FacultyActionItems } from "@/components/faculty-action-items";
import { AnalyticsCharts } from "@/components/analytics-charts";
import Link from "next/link";
import { useApp } from "@/components/app-context";
import {
  getAssignedIssues,
  getHighPriorityIssues,
} from "@/lib/services/faculty-issues";
import { getIssues } from "@/lib/services/issues";
import type { DbIssue } from "@/types/db";

export default function FacultyDashboard() {
  const { user } = useApp();
  const [allIssues, setAllIssues] = useState<DbIssue[]>([]);
  const [assignedIssues, setAssignedIssues] = useState<DbIssue[]>([]);
  const [highPriority, setHighPriority] = useState<DbIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [allRes, assignedRes, hpRes] = await Promise.all([
        getIssues(),
        user
          ? getAssignedIssues(user.id)
          : Promise.resolve({ data: [] as DbIssue[], error: null }),
        getHighPriorityIssues(),
      ]);
      if (allRes.data) setAllIssues(allRes.data);
      if (assignedRes.data) setAssignedIssues(assignedRes.data);
      if (hpRes.data) setHighPriority(hpRes.data);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    const active = allIssues.filter(
      (i) => i.status !== "resolved" && i.status !== "rejected",
    ).length;
    const resolved = allIssues.filter((i) => i.status === "resolved");
    // Avg resolution time (days between created and updated for resolved issues)
    let avgDays = 0;
    if (resolved.length > 0) {
      const totalDays = resolved.reduce((sum, i) => {
        const created = new Date(i.created_at).getTime();
        const updated = new Date(i.updated_at).getTime();
        return sum + (updated - created) / (1000 * 60 * 60 * 24);
      }, 0);
      avgDays = totalDays / resolved.length;
    }
    const escalations = highPriority.length;

    return [
      {
        label: "Active Issues",
        value: String(active),
        icon: FileText,
        change: `${assignedIssues.length} assigned to you`,
        trend: "up" as const,
        neutral: false,
      },
      {
        label: "Avg Resolution",
        value: `${avgDays.toFixed(1)}d`,
        icon: Clock,
        change: `${resolved.length} resolved`,
        trend: "down" as const,
        neutral: false,
        success: true,
      },
      {
        label: "Total Issues",
        value: String(allIssues.length),
        icon: Users,
        change: `${allIssues.filter((i) => i.status === "in_progress").length} in progress`,
        trend: "up" as const,
        neutral: false,
        success: true,
      },
      {
        label: "Escalations",
        value: String(escalations),
        icon: AlertTriangle,
        change: escalations > 0 ? "Action required" : "All clear",
        trend: "up" as const,
        neutral: false,
        danger: escalations > 0,
      },
    ];
  }, [allIssues, assignedIssues, highPriority]);

  // Compute department data from real issues
  const departmentData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    allIssues.forEach((i) => {
      byCategory[i.category] = (byCategory[i.category] || 0) + 1;
    });
    return Object.entries(byCategory).map(([dept, issues]) => ({
      dept,
      issues,
    }));
  }, [allIssues]);

  // Compute sentiment data from status distribution
  const sentimentData = useMemo(() => {
    const resolved = allIssues.filter((i) => i.status === "resolved").length;
    const pending = allIssues.filter(
      (i) => i.status === "submitted" || i.status === "under_review",
    ).length;
    const inProgress = allIssues.filter(
      (i) => i.status === "in_progress" || i.status === "rejected",
    ).length;
    return [
      { name: "Resolved", value: resolved || 1, color: "#3FB97C" },
      { name: "Pending", value: pending || 1, color: "#00F5D4" },
      { name: "In Progress", value: inProgress || 1, color: "#EF4444" },
    ];
  }, [allIssues]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading faculty dashboard...
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Faculty Overview{" "}
            <Sparkles
              className="h-5 w-5 text-[var(--warning)]"
              fill="currentColor"
            />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time insights and department performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground/60 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
            Last updated: Just now
          </span>
          <Link
            href="/report"
            className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Report New Issue
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "group relative rounded-2xl border bg-card p-6 overflow-hidden transition-all duration-300 hover:shadow-lg",
              stat.danger
                ? "border-destructive/20 hover:border-destructive/40"
                : "border-border hover:border-primary/30",
            )}
          >
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              <ArrowUpRight
                className={cn(
                  "h-5 w-5",
                  stat.danger ? "text-destructive" : "text-muted-foreground",
                )}
              />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-inner",
                  stat.danger
                    ? "bg-destructive/10 text-destructive"
                    : stat.success
                      ? "bg-[var(--success)]/10 text-[var(--success)]"
                      : "bg-primary/10 text-primary",
                )}
              >
                <stat.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">
                {stat.label}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  stat.danger
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : stat.success
                      ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20"
                      : "bg-primary/10 text-primary border-primary/20",
                )}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <AnalyticsCharts
            departmentData={departmentData}
            sentimentData={sentimentData}
          />
        </motion.div>

        {/* Right Column: Action Items (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1"
        >
          <FacultyActionItems />
        </motion.div>
      </div>
    </div>
  );
}
