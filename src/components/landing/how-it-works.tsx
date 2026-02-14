"use client";

import { Send, BarChart3, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: Send,
    title: "Submit Feedback",
    description:
      "Report an issue anonymously. Choose a category, describe the problem, and submit — your identity is never stored or linked.",
  },
  {
    num: "02",
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Watch your issue move through the pipeline in real-time. Get notified on status changes, admin responses, and priority updates.",
  },
  {
    num: "03",
    icon: CheckCircle,
    title: "See Resolution",
    description:
      "Confirm when issues are resolved. View the full timeline of actions taken, and rate the resolution quality.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 bg-muted/20" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Three steps to a<br />
            <span className="text-primary">better campus</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From anonymous submission to transparent resolution — the entire
            process is streamlined and visible.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Step number + icon */}
              <div className="relative inline-flex mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/60 shadow-lg relative z-10">
                  <step.icon
                    className="h-7 w-7 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground z-20">
                  {step.num}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
