"use client";

import {
  Shield,
  ThumbsUp,
  AlertTriangle,
  Eye,
  Sparkles,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Anonymous Issue Reporting",
    description:
      "Submit feedback without revealing your identity. End-to-end encrypted, zero-knowledge architecture ensures complete anonymity.",
  },
  {
    icon: ThumbsUp,
    title: "Upvote & Follow Issues",
    description:
      "Support important issues and track their progress. Community-driven prioritization ensures the most critical problems get attention first.",
  },
  {
    icon: AlertTriangle,
    title: "Faculty Escalation Support",
    description:
      "Faculty members can escalate critical issues directly to administration with priority overrides and department-level insights.",
  },
  {
    icon: Eye,
    title: "Transparent Admin Audit Trail",
    description:
      "Every administrative action is logged and visible. Full transparency prevents corruption and ensures accountability.",
  },
  {
    icon: Sparkles,
    title: "Smart AI Categorization",
    description:
      "AI automatically categorizes, detects duplicates, and identifies trending issues — reducing manual overhead by 80%.",
  },
  {
    icon: Activity,
    title: "Real-Time Resolution Tracking",
    description:
      "Live status updates from submission to resolution. Students see exactly where their issue stands at every stage.",
  },
];

export function Features() {
  return (
    <section className="relative py-28" id="features">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to
            <br />
            <span className="text-primary">transform campus feedback</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A complete platform designed for educational institutions to
            capture, process, and resolve student feedback efficiently.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border/50 bg-card/50 p-7 hover:border-primary/20 hover:bg-card transition-all duration-300 card-hover"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
