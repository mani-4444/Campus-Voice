"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Campus Voice gave students a real voice. For the first time, administration actually responds to our concerns — and we can see it happening in real-time.",
    name: "Priya Sharma",
    role: "Student Council President",
    initials: "PS",
  },
  {
    quote: "The faculty dashboard makes it easy to see what's happening in my department. I can escalate serious issues directly and track the resolution process transparently.",
    name: "Dr. Rajesh Kumar",
    role: "Faculty Coordinator, CS Dept",
    initials: "RK",
  },
  {
    quote: "We resolved 73% more issues in the first semester. The audit trail keeps everyone accountable, and the AI categorization saves my team hours every week.",
    name: "Ananya Verma",
    role: "Campus Administrator",
    initials: "AV",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28 bg-muted/20" id="testimonials">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by campuses<br />
            <span className="text-primary">across the country</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-7 flex flex-col hover:border-primary/20 hover:bg-card transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
