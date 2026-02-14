"use client";

import { motion } from "framer-motion";

const institutions = [
  "National Institute of Technology",
  "State University",
  "Tech College",
  "Research Institute",
  "Central University",
];

export function SocialProof() {
  return (
    <section className="relative py-16 border-y border-border/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium mb-10"
        >
          Trusted by leading institutions across India
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {institutions.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2.5 text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors duration-300"
            >
              <div className="h-8 w-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center">
                <span className="text-[10px] font-bold opacity-60">
                  {name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium tracking-tight">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
