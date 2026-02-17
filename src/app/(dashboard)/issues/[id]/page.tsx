"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ThumbsUp,
  MapPin,
  Tag,
  Clock,
  User,
  CheckCircle,
  Flag,
  Share2,
  MoreVertical,
  AlertTriangle,
  Loader,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Timeline } from "@/components/timeline";
import { AdminChat } from "@/components/admin-chat";
import {
  getIssueById,
  getIssueTimeline,
  getIssueAdminUpdates,
  toggleUpvote,
} from "@/lib/services/issues";
import { useApp } from "@/components/app-context";
import type { DbIssue, DbIssueUpdate } from "@/types/db";

export default function IssueDetailPage() {
  const params = useParams<{ id: string }>();
  const issueId = Number(params.id);
  const { role } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issue, setIssue] = useState<DbIssue | null>(null);
  const [timeline, setTimeline] = useState<DbIssueUpdate[]>([]);
  const [adminUpdates, setAdminUpdates] = useState<DbIssueUpdate[]>([]);

  const [upvoted, setUpvoted] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  const [showReportFalse, setShowReportFalse] = useState(false);
  const [falseReason, setFalseReason] = useState("");

  const [showResolve, setShowResolve] = useState(false);
  const [resolveNote, setResolveNote] = useState("");

  const [adminUpdateText, setAdminUpdateText] = useState("");

  // Load issue data on mount
  useEffect(() => {
    async function fetchIssueData() {
      try {
        setLoading(true);
        setError(null);

        const issueRes = await getIssueById(issueId);
        if (issueRes.error) {
          setError(issueRes.error);
          return;
        }

        setIssue(issueRes.data);
        setUpvoteCount(issueRes.data?.upvotes ?? 0);

        const [timelineRes, updatesRes] = await Promise.all([
          getIssueTimeline(issueId),
          getIssueAdminUpdates(issueId),
        ]);

        if (timelineRes.data) setTimeline(timelineRes.data);
        if (updatesRes.data) setAdminUpdates(updatesRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load issue");
      } finally {
        setLoading(false);
      }
    }

    fetchIssueData();
  }, [issueId]);

  const reporter = issue?.reporter_id ? "faculty" : "student";
  const issueReporterId = issue?.reporter_id ?? "student-001";
  const currentUserId = role === "faculty" ? "faculty-001" : "student-001";
  const isIssueOwner = role === reporter && currentUserId === issueReporterId;
  const canUpvote =
    role !== "admin" && !(role === "faculty" && reporter === "student");
  const canResolve =
    role === "admin" ||
    (reporter === "student" && role === "student") ||
    (reporter === "faculty" && role === "faculty" && isIssueOwner);

  const handleUpvote = async () => {
    if (!issue || upvoting) return;
    try {
      setUpvoting(true);
      const newState = !upvoted;
      const response = await toggleUpvote(issue.id, currentUserId);

      if (response.error) {
        toast.error(response.error);
      } else {
        setUpvoted(newState);
        setUpvoteCount(newState ? upvoteCount + 1 : upvoteCount - 1);
        toast.success(newState ? "Issue upvoted" : "Upvote removed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upvote failed");
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading issue...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          href="/issues"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </div>
          Back to Issues
        </Link>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive mb-1">
              Failed to load issue
            </h3>
            <p className="text-sm text-muted-foreground">
              {error || "Issue not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <Link
          href="/issues"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </div>
          Back to Issues
        </Link>

        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition-colors text-muted-foreground">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition-colors text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-border bg-card p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <div className="h-64 w-64 rounded-full bg-primary blur-[100px]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {issue?.status.replace("_", " ") ?? "Unknown"}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--warning)] px-2.5 py-1 rounded-md bg-[var(--warning)]/10 border border-[var(--warning)]/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                {issue?.priority ?? "—"} Priority
              </span>
              <span className="text-[10px] text-muted-foreground/60 font-mono bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                ID: #{String(issueId).padStart(3, "0")}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 leading-tight">
              {issue?.title ?? "Issue not found"}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                <Tag className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                <span className="font-medium text-foreground">
                  {issue?.category ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                <MapPin
                  className="h-3.5 w-3.5 text-primary"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-foreground">
                  {issue?.location ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2">
                <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                Anonymous {reporter === "faculty" ? "Faculty" : "Student"}
              </div>
              <div className="flex items-center gap-1.5 px-2">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                {issue?.created_at.split('T')[0] ?? "—"}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-row md:flex-col gap-3">
            {canUpvote && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpvote}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all duration-300 shadow-sm min-w-[140px]",
                  upvoted
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,245,212,0.4)]"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground bg-card",
                )}
              >
                <ThumbsUp
                  className={cn("h-4 w-4", upvoted && "fill-current")}
                  strokeWidth={2}
                />
                Upvote {upvoteCount}
              </motion.button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <h3 className="text-sm font-semibold mb-3 text-foreground/80">
            Description
          </h3>
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-sm text-foreground/80 leading-7">
            {issue?.description ?? "No description available."}
          </div>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 rounded-3xl border border-border bg-card p-8 h-fit"
        >
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Status Timeline</h2>
              <p className="text-xs text-muted-foreground">
                Tracking issue progress
              </p>
            </div>
          </div>
          <Timeline steps={timeline} />
        </motion.div>

        {/* Admin Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7 rounded-3xl border border-border bg-card p-8 h-fit"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Flag className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold">Official Updates</h2>
                <p className="text-xs text-muted-foreground">
                  Admin & Maintenance Log
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded border border-border/50">
              {adminUpdates.length} ENTRIES
            </span>
          </div>

          <AdminChat updates={adminUpdates} />

          <div className="mt-6 pt-6 border-t border-border/50">
            {role === "admin" ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={adminUpdateText}
                  onChange={(e) => setAdminUpdateText(e.target.value)}
                  placeholder="Post an official update..."
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={() => {
                    if (!adminUpdateText) return;
                    toast.success("Update posted to timeline");
                    setAdminUpdateText("");
                  }}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Post
                </button>
              </div>
            ) : (
              <p className="text-xs text-center text-muted-foreground/50">
                Only administrators can post updates to this log.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-end gap-4 border-t border-border pt-8"
      >
        {role !== "admin" && (
          <button
            onClick={() => setShowReportFalse(true)}
            className="flex items-center gap-2 rounded-xl border border-destructive/20 px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5 transition-all duration-200"
          >
            <Flag className="h-4 w-4" strokeWidth={2} />
            Report False Issue
          </button>
        )}
        {canResolve && (
          <button
            onClick={() => setShowResolve(true)}
            className="flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-all duration-200 shadow-lg"
          >
            <CheckCircle className="h-4 w-4" strokeWidth={2} />
            Mark as Resolved
          </button>
        )}
        {role === "faculty" && reporter === "student" && (
          <button
            onClick={() => toast.success("Issue escalated to Administration")}
            className="flex items-center gap-2 rounded-xl border border-[var(--warning)]/50 bg-[var(--warning)]/10 text-[var(--warning)] px-4 py-2.5 text-sm font-bold hover:bg-[var(--warning)]/20 transition-all duration-200"
          >
            <AlertTriangle className="h-4 w-4" strokeWidth={2} />
            Escalate Issue
          </button>
        )}
      </motion.div>
      <AnimatePresence>
        {showReportFalse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="text-xl font-bold">Report False Issue</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide a detailed reason why this issue is being
                reported as false. This request will be forwarded to the admin
                for review.
              </p>
              <textarea
                className="w-full h-32 rounded-xl border border-border bg-muted/30 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20 mb-4 resize-none"
                placeholder="Enter your reason here..."
                value={falseReason}
                onChange={(e) => setFalseReason(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReportFalse(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success("Request submitted to Admin Queue");
                    setShowReportFalse(false);
                    setFalseReason("");
                  }}
                  className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold hover:bg-destructive/90 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResolve && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-[var(--success)]">
                <CheckCircle className="h-6 w-6" />
                <h2 className="text-xl font-bold">Mark as Resolved</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                To close this issue, please provide evidence of resolution
                (e.g., description of work done, photos).
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium mb-1.5 ml-1">
                    Resolution Details
                  </label>
                  <textarea
                    className="w-full h-24 rounded-xl border border-border bg-muted/30 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--success)]/20 resize-none"
                    placeholder="Describe the fix..."
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 ml-1">
                    Attach Evidence
                  </label>
                  <div className="h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                    <span className="text-xs">Click to upload photo</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResolve(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success("Resolution evidence submitted for approval");
                    setShowResolve(false);
                    setResolveNote("");
                  }}
                  className="px-4 py-2 rounded-xl bg-[var(--success)] text-white text-sm font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Submit for Approval
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
