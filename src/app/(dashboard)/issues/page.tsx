"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ThumbsUp,
  Loader,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IssueCard } from "@/components/issue-card";
import { IssueListItem } from "@/components/issue-list-item";
import { filterCategories, filterStatuses } from "@/lib/mock/constants";
import { useApp } from "@/components/app-context";
import { getIssues } from "@/lib/services/issues";
import { getUserVotes } from "@/lib/services/admin-issues";
import type { DbIssue } from "@/types/db";

export default function IssueListPage() {
  const { role, user } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterMyUpvoted, setFilterMyUpvoted] = useState(false);
  const [filterEscalated, setFilterEscalated] = useState(false);
  const [filterReporter, setFilterReporter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<DbIssue[]>([]);
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchIssues() {
      try {
        setLoading(true);
        setError(null);
        const [response, votesRes] = await Promise.all([
          getIssues(),
          user
            ? getUserVotes(user.id)
            : Promise.resolve({ data: [] as string[], error: null }),
        ]);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setIssues(response.data);
        }
        if (votesRes.data) {
          setUserVotedIds(votesRes.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load issues");
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, [user]);

  const filtered = issues.filter((issue) => {
    // 1. Role-based visibility
    if (
      role === "faculty" &&
      (issue.category === "Hostel" || issue.category === "Transportation")
    ) {
      return false;
    }

    // 2. Standard filters
    if (activeCategory !== "All" && issue.category !== activeCategory)
      return false;
    if (
      activeStatus !== "All" &&
      issue.status.replace("_", " ") !== activeStatus
    )
      return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase()))
      return false;

    // 3. Advanced toggles
    if (filterMyUpvoted && !userVotedIds.includes(issue.id)) return false;
    // Escalated = high or critical priority
    if (
      filterEscalated &&
      issue.priority !== "critical" &&
      issue.priority !== "high"
    )
      return false;

    // 4. Reporter filter (faculty view) — filter by visibility
    if (filterReporter !== "All" && issue.visibility !== filterReporter)
      return false;

    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Issues</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and track reported campus issues
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/40">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === "grid"
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === "list"
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="List View"
          >
            <List className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading issues...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive mb-1">
              Failed to load issues
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search issues..."
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs text-muted-foreground shadow-sm">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>Active filters: {filtered.length} results</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">
                Category:
              </span>
              {filterCategories
                .filter(
                  (cat) =>
                    role !== "faculty" ||
                    (cat !== "Hostel" && cat !== "Transportation"),
                )
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
                      activeCategory === cat
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">
                Status:
              </span>
              {filterStatuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveStatus(st)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
                    activeStatus === st
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground",
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Reporter filter for faculty: Student vs Faculty issues */}
            {role === "faculty" && (
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">
                  Reporter:
                </span>
                {[
                  { key: "All", label: "All" },
                  { key: "student", label: "Student" },
                  { key: "faculty", label: "Faculty" },
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() =>
                      setFilterReporter(r.key === "All" ? "All" : r.key)
                    }
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
                      filterReporter === (r.key === "All" ? "All" : r.key)
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-border/50">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mr-2">
                Quick Filters:
              </span>

              <button
                onClick={() => setFilterMyUpvoted(!filterMyUpvoted)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border",
                  filterMyUpvoted
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-card text-muted-foreground border-border/50 hover:border-border",
                )}
              >
                <ThumbsUp className="h-3 w-3" strokeWidth={1.5} />
                My Upvoted
              </button>

              <button
                onClick={() => setFilterEscalated(!filterEscalated)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border",
                  filterEscalated
                    ? "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20"
                    : "bg-card text-muted-foreground border-border/50 hover:border-border",
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
        </>
      )}
    </div>
  );
}
