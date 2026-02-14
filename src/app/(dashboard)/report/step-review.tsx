"use client";

import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

interface StepReviewProps {
    category: string;
    location: string;
    description: string;
    priority: string;
}

export function StepReview({ category, location, description, priority }: StepReviewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-sm font-semibold mb-3">Review Your Submission</h3>
                <div className="rounded-xl bg-muted/30 border border-border/50 p-4 space-y-3">
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span className="text-sm font-semibold">{category || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm font-semibold">{location || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <span className="text-sm font-semibold capitalize">{priority}</span>
                    </div>
                    <div className="py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground block mb-2">Description</span>
                        <p className="text-sm leading-relaxed text-foreground/80">{description || "No description provided"}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Submitted By</span>
                        <span className="text-sm font-semibold text-primary">Anonymous Student</span>
                    </div>
                </div>
            </motion.div>

            {/* AI Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Sparkles className="w-24 h-24 text-primary" />
                </div>

                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-[0_0_15px_rgba(0,245,212,0.15)]">
                        <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-primary block">AI Analysis Preview</span>
                        <span className="text-[10px] text-muted-foreground">Automated analysis of your submission</span>
                    </div>
                </div>
                <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Sentiment</span>
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">Concern Detected</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Urgency Score</span>
                        <div className="flex items-center gap-2.5">
                            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "75%" }}
                                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,245,212,0.5)]"
                                />
                            </div>
                            <span className="font-semibold text-primary">7.5/10</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Auto-Category</span>
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{category || "Pending"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Similar Issues</span>
                        <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-primary" />
                            <span className="font-semibold">3 found</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
