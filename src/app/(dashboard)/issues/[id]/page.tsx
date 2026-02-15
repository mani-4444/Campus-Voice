"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Timeline } from "@/components/timeline";
import { AdminChat } from "@/components/admin-chat";

// Mock data - in a real app this would come from an API based on params.id
const timelineSteps = [
  { label: "Submitted", date: "Feb 12, 2026 - 09:14 AM", completed: true, current: false, description: "Issue reported and added to anonymous queue" },
  { label: "Under Review", date: "Feb 12, 2026 - 11:30 AM", completed: true, current: false, description: "Assigned to Facilities Management department" },
  { label: "In Progress", date: "Feb 13, 2026 - 02:15 PM", completed: true, current: true, description: "Maintenance team dispatched to site" },
  { label: "Resolved", date: "Pending", completed: false, current: false, description: "Awaiting resolution confirmation" },
];

const adminUpdates = [
  { author: "System", message: "Issue #001 submitted and recorded in anonymous queue. Auto-priority: High based on keywords 'AC', 'Library'.", time: "Feb 12, 2026 - 09:14 AM", type: "system" },
  { author: "Ravi (Facilities)", message: "Issue assigned to Facilities Management department for review. Reference ticket created: FM-2026-0212.", time: "Feb 12, 2026 - 11:30 AM", type: "assign" },
  { author: "Suresh (Maintenance)", message: "Maintenance team dispatched to Block A Library. Estimated resolution time provided: 48 hours.", time: "Feb 13, 2026 - 02:15 PM", type: "update" },
  { author: "Ravi (Facilities)", message: "Parts ordered for AC unit replacement (Compressor Unit XJ-900). Vendor: CoolTech Systems. Will update when parts arrive.", time: "Feb 14, 2026 - 10:00 AM", type: "update" },
];

export default function IssueDetailPage() {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(47);

  const [showReportFalse, setShowReportFalse] = useState(false);
  const [falseReason, setFalseReason] = useState("");

  const [showResolve, setShowResolve] = useState(false);
  const [resolveNote, setResolveNote] = useState("");

  const [role, setRole] = useState("student");
  const [adminUpdateText, setAdminUpdateText] = useState("");

  // Mock reporter type for this issue. In a real app this comes from the issue data.
  const reporter = "student"; // or "faculty"

  useEffect(() => {
    const savedRole = localStorage.getItem("app-role");
    if (savedRole) setRole(savedRole);
  }, []);

  const handleUpvote = () => {
    setUpvoted(!upvoted);
    setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <Link href="/issues" className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                In Progress
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--warning)] px-2.5 py-1 rounded-md bg-[var(--warning)]/10 border border-[var(--warning)]/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                High Priority
              </span>
              <span className="text-[10px] text-muted-foreground/60 font-mono bg-muted/50 px-2 py-1 rounded-md border border-border/50">ID: #001</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 leading-tight">
              Library AC not functioning in <span className="text-primary">Block A</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                <Tag className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                <span className="font-medium text-foreground">Infrastructure</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                <MapPin className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                <span className="font-medium text-foreground">Block A</span>
              </div>
              <div className="flex items-center gap-1.5 px-2">
                <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                Anonymous Student
              </div>
              <div className="flex items-center gap-1.5 px-2">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                Feb 12, 2026
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-row md:flex-col gap-3">
            {role !== "admin" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpvote}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all duration-300 shadow-sm min-w-[140px]",
                  upvoted
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,245,212,0.4)]"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground bg-card"
                )}
              >
                <ThumbsUp className={cn("h-4 w-4", upvoted && "fill-current")} strokeWidth={2} />
                Upvote {upvoteCount}
              </motion.button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <h3 className="text-sm font-semibold mb-3 text-foreground/80">Description</h3>
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-sm text-foreground/80 leading-7">
            The air conditioning system in Block A Library has been non-functional for the past 3 days.
            The temperature inside is uncomfortable, especially during afternoon hours, making it difficult
            for students to study. Multiple students have reported this issue verbally to the library staff
            but no action has been taken. The situation is particularly concerning given the current weather conditions.
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
              <p className="text-xs text-muted-foreground">Tracking issue progress</p>
            </div>
          </div>
          <Timeline steps={timelineSteps} />
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
                <p className="text-xs text-muted-foreground">Admin & Maintenance Log</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded border border-border/50">{adminUpdates.length} ENTRIES</span>
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
              <p className="text-xs text-center text-muted-foreground/50">Only administrators can post updates to this log.</p>
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
        <button
          onClick={() => setShowResolve(true)}
          className="flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-all duration-200 shadow-lg"
        >
          <CheckCircle className="h-4 w-4" strokeWidth={2} />
          Mark as Resolved
        </button>
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
                Please provide a detailed reason why this issue is being reported as false. This request will be forwarded to the admin for review.
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
                To close this issue, please provide evidence of resolution (e.g., description of work done, photos).
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium mb-1.5 ml-1">Resolution Details</label>
                  <textarea
                    className="w-full h-24 rounded-xl border border-border bg-muted/30 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--success)]/20 resize-none"
                    placeholder="Describe the fix..."
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 ml-1">Attach Evidence</label>
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
