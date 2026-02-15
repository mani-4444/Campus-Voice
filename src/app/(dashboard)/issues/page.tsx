"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IssueCard } from "@/components/issue-card";
import { IssueListItem } from "@/components/issue-list-item";

const issues = [
  { id: 1, title: "Library AC not functioning in Block A", status: "In Progress", priority: "High", upvotes: 47, category: "Infrastructure", location: "Block A", date: "Feb 12, 2026", progress: 60, reporter: "student" },
  { id: 2, title: "WiFi connectivity drops in Hostel 3", status: "Submitted", priority: "Critical", upvotes: 38, category: "IT Services", location: "Hostel 3", date: "Feb 11, 2026", progress: 10, reporter: "student" },
  { id: 3, title: "Lab equipment outdated in CS Department", status: "Under Review", priority: "Medium", upvotes: 31, category: "Academics", location: "Block B", date: "Feb 10, 2026", progress: 30, reporter: "faculty" },
  { id: 4, title: "Cafeteria hygiene concerns reported", status: "In Progress", priority: "High", upvotes: 28, category: "Facilities", location: "Cafeteria", date: "Feb 9, 2026", progress: 45, reporter: "student" },
  { id: 5, title: "Parking lot lighting insufficient", status: "Submitted", priority: "Low", upvotes: 19, category: "Safety", location: "Main Campus", date: "Feb 8, 2026", progress: 5, reporter: "faculty" },
  { id: 6, title: "Hostel water supply irregular schedule", status: "Resolved", priority: "High", upvotes: 52, category: "Hostel", location: "Hostel 1", date: "Feb 5, 2026", progress: 100, reporter: "student" },
  { id: 7, title: "Bus timing inconsistency for Route 3", status: "In Progress", priority: "Medium", upvotes: 23, category: "Transportation", location: "Main Campus", date: "Feb 4, 2026", progress: 55, reporter: "student" },
  { id: 8, title: "Exam hall seating arrangement complaint", status: "Resolved", priority: "Low", upvotes: 15, category: "Administration", location: "Block C", date: "Feb 3, 2026", progress: 100, reporter: "faculty" },
];

const filterCategories = ["All", "Infrastructure", "IT Services", "Academics", "Facilities", "Safety", "Hostel", "Transportation", "Administration"];
const filterStatuses = ["All", "Submitted", "Under Review", "In Progress", "Resolved"];

export default function IssueListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterMyUpvoted, setFilterMyUpvoted] = useState(false);
  const [filterEscalated, setFilterEscalated] = useState(false);
  const [filterReporter, setFilterReporter] = useState("All");

  // In a real app, we'd use the hook. For now, mocking based on localStorage or default.
  // We need to access role to filter out Hostel/Transport for faculty.
  const [role, setRole] = useState("student");

  useEffect(() => {
    const savedRole = localStorage.getItem("app-role");
    if (savedRole) setRole(savedRole);
  }, []);

  const filtered = issues.filter((issue) => {
    // 1. Role-based visibility
    if (role === "faculty" && (issue.category === "Hostel" || issue.category === "Transportation")) {
      return false;
    }

    // 2. Standard filters
    if (activeCategory !== "All" && issue.category !== activeCategory) return false;
    if (activeStatus !== "All" && issue.status !== activeStatus) return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase())) return false;

    // 3. Advanced toggles
    if (filterMyUpvoted && ![1, 4, 7].includes(issue.id)) return false; // Mocking "My Upvoted"
    // Mocking "Escalated" check - assuming high priority or specific keyword in title/status
    if (filterEscalated && issue.priority !== "Critical" && issue.priority !== "High") return false;
    if (filterReporter !== "All" && issue.reporter !== filterReporter.toLowerCase()) return false;

    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Issues</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and track reported campus issues</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/40">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="List View"
          >
            <List className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs text-muted-foreground shadow-sm">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Active filters: {filtered.length} results</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">Category:</span>
          {filterCategories
            .filter(cat => role !== "faculty" || (cat !== "Hostel" && cat !== "Transportation"))
            .map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
                  activeCategory === cat
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">Status:</span>
          {filterStatuses.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
                activeStatus === st
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Reporter filter for faculty: Student vs Faculty issues */}
        {role === "faculty" && (
          <div className="flex flex-wrap gap-2 items-center pt-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">Reporter:</span>
            {[
              { key: "All", label: "All" },
              { key: "student", label: "Student" },
              { key: "faculty", label: "Faculty" },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setFilterReporter(r.key === "All" ? "All" : r.key)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
                  filterReporter === (r.key === "All" ? "All" : r.key) ? "bg-primary/10 text-primary border-primary/20" : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-border/50">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">Quick Filters:</span>

          <button
            onClick={() => setFilterMyUpvoted(!filterMyUpvoted)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border",
              filterMyUpvoted ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-card text-muted-foreground border-border/50 hover:border-border"
            )}
          >
            <ThumbsUp className="h-3 w-3" strokeWidth={1.5} />
            My Upvoted
          </button>

          <button
            onClick={() => setFilterEscalated(!filterEscalated)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border",
              filterEscalated ? "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20" : "bg-card text-muted-foreground border-border/50 hover:border-border"
            )}
          >
            ⚠️ Escalated / Critical
          </button>

        </div>
      </div>

      {/* Issue Cards */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No issues found matching your filters.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
          >
            {filtered.map((issue, i) => (
              <IssueListItem key={issue.id} issue={issue} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                No issues found matching your filters.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
