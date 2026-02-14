"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const actionItems = [
    {
        id: 1,
        title: "Review 'Lab Safety' policy violation report",
        priority: "Critical",
        deadline: "Today, 5:00 PM",
        type: "review",
    },
    {
        id: 2,
        title: "Approve budget for Department Workshop",
        priority: "High",
        deadline: "Tomorrow, 10:00 AM",
        type: "approval",
    },
    {
        id: 3,
        title: "Respond to Dean's query regarding curriculum",
        priority: "Medium",
        deadline: "Feb 16, 2026",
        type: "response",
    },
];

const priorityColors: Record<string, string> = {
    Critical: "text-destructive bg-destructive/10 border-destructive/20",
    High: "text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/20",
    Medium: "text-primary bg-primary/10 border-primary/20",
};

export function FacultyActionItems() {
    return (
        <div className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">My Action Items</h2>
                        <p className="text-xs text-muted-foreground">Tasks requiring your attention</p>
                    </div>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {actionItems.length}
                </span>
            </div>

            <div className="space-y-3 flex-1">
                {actionItems.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative rounded-xl border border-border/50 bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", priorityColors[item.priority])}>
                                {item.priority}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.deadline}
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
                                    // In a real app this would call an API
                                    const newItems = actionItems.filter(i => i.id !== item.id);
                                    // mocking state update visual feedback
                                    if (typeof document !== 'undefined') {
                                        const toast = require("sonner").toast;
                                        toast.success("Item marked as completed");
                                    }
                                }}
                                className="text-[10px] font-semibold bg-background border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                            >
                                Mark Done
                            </button>
                            <Link href={`/issues/1`} className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors inline-block">
                                View Details
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Link href="/issues" className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground py-2 border-t border-border/50 transition-colors">
                View All Tasks <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    );
}
