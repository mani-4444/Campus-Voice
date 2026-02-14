"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.06] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            Ready to build a<br />
            <span className="text-primary neon-text-glow">better campus?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
            Join institutions that are transforming student feedback into real
            action — transparently and efficiently.
          </p>

          <Link
            href="/login"
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-300 neon-glow hover:shadow-[0_0_40px_rgba(0,245,212,0.3)] active:scale-[0.98]"
          >
            Launch Platform
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <p className="mt-6 text-xs text-muted-foreground/50">
            Free to start · No credit card required · Setup in 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
