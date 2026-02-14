"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Shield,
  ChevronDown,
  Search,
  Eye,
  LayoutList,
  Users,
  Activity,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AuditLog } from "@/components/audit-log";
import { UserManagementTable } from "@/components/user-management-table";

const stats = [
  { label: "Total Issues", value: "156", icon: FileText, change: "+12 this week", trend: "up" },
  { label: "Pending", value: "34", icon: Clock, change: "22% of total", trend: "neutral" },
  { label: "Overdue", value: "8", icon: AlertTriangle, change: "Action required", danger: true, trend: "up" },
  { label: "Resolved", value: "114", icon: CheckCircle, change: "73% resolution rate", success: true, trend: "up" },
];

const issueRows = [
  { id: 1, title: "Library AC not functioning in Block A", status: "In Progress", priority: "High", assigned: "Facilities Dept", date: "Feb 12" },
  { id: 2, title: "WiFi connectivity drops in Hostel 3", status: "Submitted", priority: "Critical", assigned: "Unassigned", date: "Feb 11" },
  { id: 3, title: "Lab equipment outdated in CS Department", status: "Under Review", priority: "Medium", assigned: "CS Dept Head", date: "Feb 10" },
  { id: 4, title: "Cafeteria hygiene concerns reported", status: "In Progress", priority: "High", assigned: "Health Officer", date: "Feb 9" },
  { id: 5, title: "Parking lot lighting insufficient", status: "Submitted", priority: "Low", assigned: "Unassigned", date: "Feb 8" },
  { id: 6, title: "Hostel water supply irregular schedule", status: "Resolved", priority: "High", assigned: "Maintenance", date: "Feb 5" },
];

const statusColors: Record<string, string> = {
  Submitted: "bg-muted text-muted-foreground",
  "Under Review": "bg-primary/10 text-primary",
  "In Progress": "bg-primary/10 text-primary",
  Resolved: "bg-[var(--success)]/10 text-[var(--success)]",
};

const priorityColors: Record<string, string> = {
  Critical: "text-destructive",
  High: "text-[var(--warning)]",
  Medium: "text-primary",
  Low: "text-muted-foreground",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"issues" | "users" | "logs" | "requests">("issues");
  const [search, setSearch] = useState("");

  const filteredRows = issueRows.filter((r) =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Admin Console <Shield className="h-6 w-6 text-primary" strokeWidth={2} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">System-wide monitoring and configuration</p>
        </div>

        <div className="flex bg-muted/30 p-1 rounded-xl border border-border/40">
          {[{ id: "issues", label: "Issues", icon: LayoutList }, { id: "requests", label: "Requests", icon: AlertTriangle }, { id: "users", label: "Users", icon: Users }, { id: "logs", label: "Audit Logs", icon: Activity }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "rounded-2xl border bg-card p-5 overflow-hidden transition-all duration-300 hover:shadow-lg",
              stat.danger ? "border-destructive/20" : "border-border"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                stat.danger ? "bg-destructive/10 text-destructive" :
                  stat.success ? "bg-[var(--success)]/10 text-[var(--success)]" :
                    "bg-primary/10 text-primary"
              )}>
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <ArrowUpRight className={cn("h-4 w-4 opacity-50", stat.danger ? "text-destructive" : "text-muted-foreground")} />
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            <div className="mt-3 flex items-center gap-2">
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

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0 bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
      >
        {activeTab === "issues" && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <LayoutList className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Global Issue Tracker</h2>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search all issues..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium truncate max-w-[280px] group-hover:text-primary transition-colors">{row.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">#{String(row.id).padStart(3, "0")} · Anonymous Student</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                          statusColors[row.status].replace("text-", "border-transparent text-") // Adjust styles slightly for badges
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("text-xs font-semibold", priorityColors[row.priority])}>{row.priority}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/50 w-fit">
                          {row.assigned}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{row.date}</td>
                      <td className="px-5 py-4">
                        <Link href={`/issues/${row.id}`} className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="p-6 h-full overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center text-[var(--warning)]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Review Queue</h2>
                <p className="text-xs text-muted-foreground">Pending approvals for issue resolution and false reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-auto">
              {/* Resolution Requests */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[var(--success)]" /> Resolution Approvals
                </h3>
                <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold">Hostel 1 Water Supply</p>
                      <p className="text-xs text-muted-foreground mt-1">Reported fixed by Maintenance Team</p>
                    </div>
                    <span className="text-[10px] bg-muted px-2 py-1 rounded">2 hrs ago</span>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg text-xs italic text-muted-foreground border border-border/50">
                    "Replaced the main valve controller. Water flow is normalized."
                  </div>
                  <div className="h-24 w-full bg-muted/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border">
                    [Evidence Photo Placeholder]
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-xs font-bold hover:bg-[var(--success)]/20 transition-colors">Approve</button>
                    <button className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">Reject</button>
                  </div>
                </div>
              </div>

              {/* False Reports */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Flag className="h-4 w-4 text-destructive" /> False Issue Reports
                </h3>
                <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold">Cafeteria Hygiene</p>
                      <p className="text-xs text-muted-foreground mt-1">Flagged by Cafeteria Manager</p>
                    </div>
                    <span className="text-[10px] bg-muted px-2 py-1 rounded">5 hrs ago</span>
                  </div>
                  <div className="bg-destructive/5 p-3 rounded-lg text-xs italic text-destructive/80 border border-destructive/10">
                    "This report is malicious. We had a health inspection yesterday and passed with A++. See attached certificate."
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">Confirm False (Delete)</button>
                    <button className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">Reject Flag</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="p-6 h-full overflow-hidden flex flex-col">
            <UserManagementTable />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="p-6 h-full overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">System Audit Logs</h2>
                <p className="text-xs text-muted-foreground">Immutable record of all administrative actions</p>
              </div>
            </div>
            <div className="flex-1 min-h-0 border border-border/50 rounded-xl bg-background/50 p-4">
              <AuditLog />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
