"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  Shield,
  ThumbsUp,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-[140px] animate-orb" />
        <div className="absolute bottom-1/3 right-1/5 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px] animate-orb-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-[180px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,245,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-8 px-4 py-1.5 text-xs font-medium border-primary/20 bg-primary/5 text-primary gap-2"
          >
            <Zap className="h-3 w-3" />
            Now with AI-Powered Categorization
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-foreground">Turn Feedback</span>
          <br />
          <span className="text-primary neon-text-glow">Into Action.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Anonymous reporting. Transparent resolution tracking.
          <br className="hidden sm:block" />
          The smart feedback-to-action platform built for modern campuses.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/login"
            className="group flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-300 neon-glow hover:shadow-[0_0_30px_rgba(0,245,212,0.25)] active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm font-medium text-foreground hover:bg-card hover:border-primary/20 transition-all duration-300"
          >
            <Play className="h-4 w-4 text-primary" />
            View Demo Dashboard
          </Link>
        </motion.div>

        {/* Hero mock dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-primary/[0.08] rounded-3xl blur-[60px] -z-10 scale-90" />

          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="rounded-lg bg-muted/50 px-4 py-1 text-xs text-muted-foreground font-mono">
                  campusvoice.app/dashboard
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    icon: Shield,
                    label: "Reported",
                    value: "156",
                    color: "text-primary",
                  },
                  {
                    icon: ThumbsUp,
                    label: "Upvoted",
                    value: "89",
                    color: "text-primary",
                  },
                  {
                    icon: CheckCircle,
                    label: "Resolved",
                    value: "114",
                    color: "text-[var(--success)]",
                  },
                  {
                    icon: Clock,
                    label: "Pending",
                    value: "34",
                    color: "text-[var(--warning)]",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/40 bg-muted/20 p-4"
                  >
                    <stat.icon
                      className={`h-4 w-4 ${stat.color} mb-2`}
                      strokeWidth={1.5}
                    />
                    <p className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mock issue rows */}
              <div className="rounded-xl border border-border/40 bg-muted/10 overflow-hidden">
                {[
                  {
                    title: "Library AC not functioning — Block A",
                    status: "In Progress",
                    priority: "High",
                  },
                  {
                    title: "WiFi connectivity drops — Hostel 3",
                    status: "Submitted",
                    priority: "Critical",
                  },
                  {
                    title: "Lab equipment outdated — CS Dept",
                    status: "Under Review",
                    priority: "Medium",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 border-b border-border/30 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary/60" />
                      <span className="text-sm font-medium">{row.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {row.status}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${row.priority === "Critical" ? "text-destructive" : row.priority === "High" ? "text-[var(--warning)]" : "text-primary"}`}
                      >
                        {row.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock chart area */}
              <div className="flex items-end gap-1 h-24 px-2">
                {[30, 45, 25, 60, 50, 75, 40, 65, 55, 80, 70, 90].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/30 transition-colors duration-200"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
