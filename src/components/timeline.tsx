"use client";

import { cn } from "@/lib/utils";
import { Check, Dot } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineStep {
    label: string;
    date: string;
    completed: boolean;
    current: boolean;
    description: string;
}

interface TimelineProps {
    steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
    return (
        <div className="space-y-0 relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border/50" />

            {steps.map((step, i) => (
                <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex gap-6 pb-8 last:pb-0 group"
                >
                    {/* Vertical line connector overlay for completed steps */}
                    {i < steps.length - 1 && step.completed && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ delay: 0.5 + (i * 0.2), duration: 0.5 }}
                            className="absolute left-[15px] top-8 w-0.5 bg-primary/30 z-0 origin-top"
                        />
                    )}

                    {/* Icon */}
                    <div className="relative z-10 shrink-0 mt-1">
                        {step.current ? (
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                                <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,245,212,0.8)]" />
                            </div>
                        ) : step.completed ? (
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                                <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                            </div>
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1 relative">
                            <h3 className={cn(
                                "text-sm font-bold tracking-tight",
                                step.current ? "text-primary" : step.completed ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </h3>
                            {step.date && step.date !== "Pending" && (
                                <span className="text-[11px] font-mono text-muted-foreground/50 bg-muted/30 px-2 py-0.5 rounded-md border border-border/50 w-fit">
                                    {step.date}
                                </span>
                            )}
                        </div>

                        <p className={cn(
                            "text-xs leading-relaxed transition-colors",
                            step.current ? "text-foreground/90" : "text-muted-foreground/70"
                        )}>
                            {step.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
