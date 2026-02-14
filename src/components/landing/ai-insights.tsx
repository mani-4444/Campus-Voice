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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              AI-Powered
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Intelligent insights,
              <br />
              <span className="text-primary">zero manual work</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our AI engine processes every submission in real-time —
              categorizing, deduplicating, summarizing, and identifying emerging
              trends across your campus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
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

          {/* Right: Mock AI output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50 ml-2">
                  ai-analysis-output.json
                </span>
              </div>

              {/* JSON content */}
              <div className="p-6 font-mono text-xs leading-7 overflow-x-auto">
                <div className="text-muted-foreground/50">{"{"}</div>
                <div className="ml-4">
                  <span className="text-primary">&quot;analysis&quot;</span>
                  <span className="text-muted-foreground/50">: {"{"}</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">&quot;category&quot;</span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-[var(--success)]">
                    &quot;Infrastructure&quot;
                  </span>
                  <span className="text-muted-foreground/50">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">&quot;confidence&quot;</span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-[var(--warning)]">0.94</span>
                  <span className="text-muted-foreground/50">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">
                    &quot;duplicates_found&quot;
                  </span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-[var(--warning)]">2</span>
                  <span className="text-muted-foreground/50">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">&quot;sentiment&quot;</span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-destructive">&quot;negative&quot;</span>
                  <span className="text-muted-foreground/50">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">
                    &quot;priority_suggestion&quot;
                  </span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-[var(--warning)]">
                    &quot;high&quot;
                  </span>
                  <span className="text-muted-foreground/50">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">&quot;summary&quot;</span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-[var(--success)]">
                    &quot;AC malfunction in Block A Library affecting 200+
                    students daily&quot;
                  </span>
                  <span className="text-muted-foreground/50">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">&quot;trending&quot;</span>
                  <span className="text-muted-foreground/50">: </span>
                  <span className="text-primary">true</span>
                </div>
                <div className="ml-4 text-muted-foreground/50">{"}"}</div>
                <div className="text-muted-foreground/50">{"}"}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
