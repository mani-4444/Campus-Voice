"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface StepDetailsProps {
    description: string;
    setDescription: (value: string) => void;
    priority: string;
    setPriority: (value: string) => void;
}

const priorities = [
    { value: "low", label: "Low", description: "Minor inconvenience", color: "border-muted-foreground/30 text-muted-foreground", activeColor: "border-muted-foreground bg-muted-foreground/5" },
    { value: "medium", label: "Medium", description: "Affects daily routine", color: "border-primary/30 text-primary", activeColor: "border-primary bg-primary/5" },
    { value: "high", label: "High", description: "Requires urgent attention", color: "border-[var(--warning)]/30 text-[var(--warning)]", activeColor: "border-[var(--warning)] bg-[var(--warning)]/5" },
    { value: "critical", label: "Critical", description: "Safety or emergency", color: "border-destructive/30 text-destructive", activeColor: "border-destructive bg-destructive/5" },
];

export function StepDetails({ description, setDescription, priority, setPriority }: StepDetailsProps) {
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
                <label className="block text-sm font-semibold mb-2">Description</label>
                <p className="text-xs text-muted-foreground mb-3">Be as specific as possible to help resolve this faster</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe the issue in detail..."
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200 leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground/60 mt-1.5 text-right">{description.length}/1000</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <label className="block text-sm font-semibold mb-2">Upload Image (Optional)</label>
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/30 p-10 cursor-pointer transition-all duration-200 hover:bg-muted/20 group">
                    <div className="text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                            <ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Click or drag to upload</p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <label className="block text-sm font-semibold mb-3">Priority</label>
                <div className="grid grid-cols-2 gap-2">
                    {priorities.map((p) => (
                        <motion.button
                            key={p.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPriority(p.value)}
                            className={cn(
                                "rounded-xl border px-4 py-3.5 text-left transition-all duration-200 relative overflow-hidden",
                                priority === p.value
                                    ? p.activeColor
                                    : "border-border hover:border-primary/20"
                            )}
                        >
                            <p className="text-sm font-semibold relative z-10">{p.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">{p.description}</p>
                            {priority === p.value && (
                                <motion.div
                                    layoutId="priority-active"
                                    className="absolute inset-0 bg-primary/5 z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
