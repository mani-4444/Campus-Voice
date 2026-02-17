"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowRight, Loader } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getHighPriorityIssues } from "@/lib/services/faculty-issues";
import { updateIssueStatus } from "@/lib/services/faculty-issues";
import type { DbIssue } from "@/types/db";

const priorityBadgeColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

export function FacultyActionItems() {
  const [items, setItems] = useState<DbIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const res = await getHighPriorityIssues();
      if (res.data) setItems(res.data.slice(0, 5)); // Show top 5
      setLoading(false);
    }
    fetch();
  }, []);

  const handleMarkDone = async (issueId: string) => {
    const res = await updateIssueStatus(issueId, "resolved");
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Issue marked as resolved");
      setItems((prev) => prev.filter((i) => i.id !== issueId));
    }
  };
  return (
    <div className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold">My Action Items</h2>
            <p className="text-xs text-muted-foreground">
              Tasks requiring your attention
            </p>
          </div>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {items.length}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
        {!loading && items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-10">
            No high-priority items
          </p>
        )}
        {!loading &&
          items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl border border-border/50 bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                    priorityBadgeColors[item.priority] ||
                      priorityBadgeColors["medium"],
                  )}
                >
                  {item.priority}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-sm font-medium leading-snug mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMarkDone(item.id);
                  }}
                  className="text-[10px] font-semibold bg-background border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  Mark Done
                </button>
                <Link
                  href={`/issues/${item.id}`}
                  className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors inline-block"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
      </div>

      <Link
        href="/issues"
        className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground py-2 border-t border-border/50 transition-colors"
      >
        View All Tasks <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
