"use client";

import { Eye, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function Transparency() {
  return (
    <section className="relative py-28" id="transparency">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Eye className="h-7 w-7" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Transparency
            <br />
            <span className="text-primary">Promise</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Campus Voice was built on a single principle — accountability. Every
            action, every decision, every resolution is recorded and visible.
          </p>
        </motion.div>

        {/* Callout box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative rounded-2xl border border-primary/20 bg-primary/[0.03] p-8 md:p-10 text-left"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex items-start gap-5">
            <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">
                All admin actions are logged and visible
                <br className="hidden sm:block" /> to prevent corruption.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Every issue assignment, status change, priority update, and
                resolution is permanently recorded in an immutable audit trail.
                Admin users cannot modify or delete their action history. The
                audit log is accessible to all stakeholders, ensuring complete
                transparency in how student feedback is handled.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Immutable Logs",
                  "Action Timestamps",
                  "Admin Attribution",
                  "Public Visibility",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
