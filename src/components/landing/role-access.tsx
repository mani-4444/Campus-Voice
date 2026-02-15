"use client";

import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  {
    icon: GraduationCap,
    title: "Student Portal",
    description:
      "Report issues anonymously, upvote problems that matter, track resolution progress, flag false reports, and confirm when issues are resolved.",
    features: [
      "Anonymous reporting",
      "Upvote & follow",
      "Track status",
      "Confirm resolution",
    ],
    accent: "primary",
  },
  {
    icon: BookOpen,
    title: "Faculty Dashboard",
    description:
      "View student-reported issues within your department, escalate priority of critical problems, and access department-level analytics and insights.",
    features: [
      "Department overview",
      "Escalate priority",
      "View analytics",
      "Faculty-specific issues",
    ],
    accent: "primary",
  },
  {
    icon: ShieldCheck,
    title: "Admin Control Panel",
    description:
      "Full system oversight — manage users, locations, and issues. Every action you take is logged in the audit trail for total transparency.",
    features: [
      "Manage all issues",
      "User management",
      "Location hierarchy",
      "Audit trail",
    ],
    accent: "primary",
  },
];

export function RoleAccess() {
  return (
    <section className="relative py-28" id="roles">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Role-Based Access
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tailored for every
            <br />
            <span className="text-primary">stakeholder</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Each role sees exactly what they need — no more, no less.
            Purpose-built interfaces for students, faculty, and administrators.
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group relative rounded-2xl border border-border/50 bg-card/50 p-7 hover:border-primary/20 hover:bg-card transition-all duration-300 card-hover flex flex-col"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary/15 transition-colors">
                <role.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {role.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {role.description}
              </p>

              {/* Feature list */}
              <div className="mt-auto space-y-2">
                {role.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
