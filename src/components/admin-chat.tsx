"use client";

import { cn } from "@/lib/utils";
import { ShieldAlert, BadgeInfo, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Update {
  author: string;
  message: string;
  time: string;
  type: string;
}

interface AdminChatProps {
  updates: Update[];
}

const typeIcons: Record<string, React.ReactNode> = {
  system: <BadgeInfo className="h-3.5 w-3.5" />,
  assign: <CheckCircle2 className="h-3.5 w-3.5" />,
  update: <ShieldAlert className="h-3.5 w-3.5" />,
};

const typeStyles: Record<string, string> = {
  system: "bg-muted/50 text-muted-foreground border-border/40",
  assign: "bg-blue-500/5 text-blue-500 border-blue-500/10",
  update: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10",
  critical: "bg-destructive/5 text-destructive border-destructive/10",
};

export function AdminChat({ updates }: AdminChatProps) {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {updates.map((update, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="group relative pl-4"
        >
          <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-border/50 group-hover:bg-primary/50 transition-colors" />

          <div className="rounded-xl bg-card border border-border/60 p-4 hover:bg-muted/10 hover:border-border transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                    typeStyles[update.type] || typeStyles.system,
                  )}
                >
                  {typeIcons[update.type]}
                  {update.author}
                </span>
                {update.type === "system" && (
                  <span className="text-[10px] text-muted-foreground/50 border border-border/30 px-1.5 py-0.5 rounded">
                    Automated
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground/60 font-mono">
                {update.time}
              </span>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed pl-1 border-l-2 border-transparent group-hover:border-primary/20 transition-colors">
              {update.message}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
