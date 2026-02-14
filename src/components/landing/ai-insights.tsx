"use client";

import { Sparkles, Layers, TrendingUp, Copy } from "lucide-react";
import { motion } from "framer-motion";

const aiFeatures = [
  {
    icon: Sparkles,
    title: "Auto-Categorize",
    description:
      "AI reads issue text and assigns the most accurate category automatically.",
  },
  {
    icon: Copy,
    title: "Detect Duplicates",
    description:
      "Smart matching prevents duplicate reports, consolidating community voice.",
  },
  {
    icon: Layers,
    title: "Summarize Issues",
    description:
      "Generates concise summaries from lengthy student descriptions for quick review.",
  },
  {
    icon: TrendingUp,
    title: "Identify Trends",
    description:
      "Surfaces recurring patterns and emerging hotspots before they escalate.",
  },
];

export function AIInsights() {
  return (
    <section className="relative py-28 bg-muted/20" id="ai">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              AI-Powered
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Intelligent insights,
              <br />
              <span className="text-primary">zero manual work</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Our AI engine processes every submission in real-time —
              categorizing, deduplicating, summarizing, and identifying emerging
              trends across your campus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {aiFeatures.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    <feat.icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold mb-0.5">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
