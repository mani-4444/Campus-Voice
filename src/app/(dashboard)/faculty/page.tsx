"use client";

import {
  FileText,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FacultyActionItems } from "@/components/faculty-action-items";
import { AnalyticsCharts } from "@/components/analytics-charts";
import Link from "next/link";

const stats = [
  { label: "Active Issues", value: "23", icon: FileText, change: "+5 this week", trend: "up", neutral: false },
  { label: "Avg Resolution", value: "4.2d", icon: Clock, change: "-0.8d faster", trend: "down", neutral: false, success: true },
  { label: "Feedback Score", value: "4.8/5", icon: Users, change: "Top 10%", trend: "up", neutral: false, success: true },
  { label: "Escalations", value: "3", icon: AlertTriangle, change: "Action required", trend: "up", neutral: false, danger: true },
];

const sentimentData = [
  { name: "Positive", value: 35, color: "#3FB97C" },
  { name: "Neutral", value: 40, color: "#00F5D4" },
  { name: "Negative", value: 25, color: "#EF4444" },
];

const departmentData = [
  { dept: "CS", issues: 12 },
  { dept: "EE", issues: 8 },
  { dept: "ME", issues: 15 },
  { dept: "CE", issues: 6 },
  { dept: "BT", issues: 9 },
];

export default function FacultyDashboard() {
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
            Faculty Overview <Sparkles className="h-5 w-5 text-[var(--warning)]" fill="currentColor" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time insights and department performance</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground/60 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
            Last updated: Just now
          </span>
          <Link href="/report" className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
            Generate Report
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
              stat.danger ? "border-destructive/20 hover:border-destructive/40" : "border-border hover:border-primary/30"
            )}
          >
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              <ArrowUpRight className={cn("h-5 w-5", stat.danger ? "text-destructive" : "text-muted-foreground")} />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-inner",
                stat.danger ? "bg-destructive/10 text-destructive" :
                  stat.success ? "bg-[var(--success)]/10 text-[var(--success)]" :
                    "bg-primary/10 text-primary"
              )}>
                <stat.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">{stat.label}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                stat.danger ? "bg-destructive/10 text-destructive border-destructive/20" :
                  stat.success ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20" :
                    "bg-primary/10 text-primary border-primary/20"
              )}>
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
          <AnalyticsCharts departmentData={departmentData} sentimentData={sentimentData} />
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
