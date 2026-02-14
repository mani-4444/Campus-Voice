"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThumbsUp, Clock, User, ChevronRight } from "lucide-react";

interface IssueCardProps {
    issue: {
        id: number;
        title: string;
        status: string;
        priority: string;
        upvotes: number;
        category: string;
        location: string;
        date: string;
        progress: number;
    };
    index: number;
}

const statusColors: Record<string, string> = {
    Submitted: "bg-muted text-muted-foreground border-transparent",
    "Under Review": "bg-primary/10 text-primary border-primary/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

const priorityDot: Record<string, string> = {
    Critical: "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    High: "bg-[var(--warning)] shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    Medium: "bg-primary",
    Low: "bg-muted-foreground",
};

export function IssueCard({ issue, index }: IssueCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
        >
            <Link
                href={`/issues/${issue.id}`}
                className="group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", priorityDot[issue.priority])} />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {issue.priority}
                        </span>
                    </div>
                    <span className={cn("text-[10px] px-2.5 py-1 rounded-full font-semibold border", statusColors[issue.status])}>
                        {issue.status}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug relative z-10">
                    {issue.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-5 relative z-10">
                    <span className="px-2 py-0.5 rounded-md bg-muted/50 font-medium border border-border/50">{issue.category}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{issue.location}</span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden mb-5 relative z-10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${issue.progress}%` }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 1, ease: "easeOut" }}
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            issue.status === "Resolved" ? "bg-emerald-500" : "bg-primary"
                        )}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-3 w-3" strokeWidth={1.5} />
                        </div>
                        <span className="font-medium">Anonymous</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                            <Clock className="h-3 w-3" strokeWidth={1.5} />
                            {issue.date}
                        </span>
                        <span className="text-xs font-semibold flex items-center gap-1 text-foreground bg-secondary/50 px-2 py-1 rounded-lg">
                            <ThumbsUp className="h-3 w-3 text-primary" strokeWidth={2} />
                            {issue.upvotes}
                        </span>
                    </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute right-5 bottom-20 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight className="h-5 w-5 text-primary" />
                </div>
            </Link>
        </motion.div>
    );
}
