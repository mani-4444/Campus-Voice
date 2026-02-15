"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThumbsUp, User } from "lucide-react";
import { statusColorsAlt, priorityDot } from "@/lib/mock/constants";

interface IssueListItemProps {
  issue: {
    id: number;
    title: string;
    status: string;
    priority: string;
    upvotes: number;
    category: string;
    location: string;
    date: string;
  };
  index: number;
}

export function IssueListItem({ issue, index }: IssueListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        href={`/issues/${issue.id}`}
        className="group relative flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors duration-200 border-b border-border/50 last:border-0"
      >
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform duration-300",
            priorityDot[issue.priority],
          )}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors pr-4">
            {issue.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 align-middle">
            <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              #{String(issue.id).padStart(3, "0")}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {issue.category}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <User className="h-2.5 w-2.5" strokeWidth={1.5} />
              Anonymous Student
            </span>
          </div>
        </div>

        <span
          className={cn(
            "text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 border",
            statusColorsAlt[issue.status],
          )}
        >
          {issue.status}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 min-w-[3rem] justify-end">
          <ThumbsUp
            className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
            strokeWidth={1.5}
          />
          <span className="text-xs font-semibold text-foreground">
            {issue.upvotes}
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground/60 shrink-0 hidden sm:block w-20 text-right">
          {issue.date}
        </span>
      </Link>
    </motion.div>
  );
}
