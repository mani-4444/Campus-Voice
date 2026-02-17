"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FileText,
  ThumbsUp,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Zap,
  Loader,
  AlertCircle,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { chartData, recentActivity } from "@/lib/mock/analytics";
import { statusColors, priorityColors } from "@/lib/mock/constants";
import { getStudentIssues } from "@/lib/services/student-issues";
import type { DbIssue } from "@/types/db";

const stats = [
  {
    label: "Total Reported",
    value: "12",
    icon: FileText,
    change: "+3 this week",
    trend: "up",
  },
  {
    label: "Upvoted Issues",
    value: "8",
    icon: ThumbsUp,
    change: "+2 this week",
    trend: "up",
  },
  {
    label: "Resolved",
    value: "5",
    icon: CheckCircle,
    change: "42% rate",
    trend: "neutral",
  },
  {
    label: "Pending",
    value: "7",
    icon: Clock,
    change: "3 under review",
    trend: "neutral",
  },
];

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendingIssues, setTrendingIssues] = useState<DbIssue[]>([]);

  useEffect(() => {
    async function fetchTrendingIssues() {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentIssues();
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setTrendingIssues(response.data.slice(0, 5));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load issues");
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingIssues();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-up">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back,{" "}
            <span className="text-foreground font-medium">
              Anonymous Student
            </span>
          </p>
        </div>
        <Link
          href="/report"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 neon-glow active:scale-[0.97] animate-slide-up"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Report New Issue
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`group rounded-2xl border border-border bg-card p-5 card-hover cursor-default animate-slide-up stagger-${i + 1}`}
            style={{
              opacity: 0,
              animationFillMode: "forwards",
              animationDelay: `${i * 80}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <stat.icon
                  className="h-[18px] w-[18px] text-primary"
                  strokeWidth={1.5}
                />
              </div>
              <ArrowUpRight
                className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            <p className="text-[11px] text-primary font-medium mt-2">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Chart */}
        <div
          className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 animate-slide-up"
          style={{
            opacity: 0,
            animationDelay: "300ms",
            animationFillMode: "forwards",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Issue Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Issues reported over time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-lg">
                <TrendingUp className="h-3 w-3" strokeWidth={2} />
                <span>+28%</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F5D4" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#00F5D4" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#00F5D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(125,133,144,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#7D8590" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#7D8590" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    padding: "8px 12px",
                  }}
                  cursor={{ stroke: "rgba(0,245,212,0.15)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="issues"
                  stroke="#00F5D4"
                  strokeWidth={2.5}
                  fill="url(#neonGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#00F5D4",
                    stroke: "#0E1116",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Issues */}
        <div
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 animate-slide-up"
          style={{
            opacity: 0,
            animationDelay: "400ms",
            animationFillMode: "forwards",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold">Trending Issues</h2>
            </div>
            <Link
              href="/issues"
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-[12px] text-muted-foreground">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-1">
              {trendingIssues.map((issue, i) => (
                <Link
                  key={issue.id}
                  href={`/issues/${issue.id}`}
                  className="flex items-start gap-3 rounded-xl p-3 -mx-1 hover:bg-muted/50 transition-all duration-200 group"
                >
                  <span className="text-[10px] font-mono text-muted-foreground/60 mt-1 w-4 shrink-0 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
                      {issue.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          statusColors[issue.status.replace("_", " ")]
                        }`}
                      >
                        {issue.status.replace("_", " ")}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          priorityColors[issue.priority]
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <ThumbsUp
                      className="h-3 w-3 text-muted-foreground/60"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {issue.upvotes}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-2xl border border-border bg-card p-6 animate-slide-up"
        style={{
          opacity: 0,
          animationDelay: "500ms",
          animationFillMode: "forwards",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Activity className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm text-muted-foreground flex-1">
                {item.text}
              </p>
              <span className="text-[11px] text-muted-foreground/60 shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
