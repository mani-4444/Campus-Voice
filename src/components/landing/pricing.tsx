"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for small colleges getting started",
    features: [
      "Up to 500 students",
      "Anonymous reporting",
      "Basic issue tracking",
      "Email notifications",
      "Community support",
    ],
    cta: "Get Started",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹4,999",
    period: "/month",
    description: "For established campuses needing full power",
    features: [
      "Unlimited students",
      "AI categorization & dedup",
      "Faculty escalation",
      "Full audit trail",
      "Analytics dashboard",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    href: "/login",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Multi-campus deployments with dedicated support",
    features: [
      "Multi-campus support",
      "SSO / LDAP integration",
      "Dedicated success manager",
      "SLA guarantee",
      "On-premise option",
      "Custom integrations",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    href: "/login",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="relative py-28" id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent
            <br />
            <span className="text-primary">pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free, scale as you grow. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary/30 bg-card shadow-lg shadow-primary/5"
                  : "border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check
                      className="h-4 w-4 text-primary shrink-0"
                      strokeWidth={2}
                    />
                    {feat}
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`w-full flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
                    : "border border-border bg-card hover:bg-muted hover:border-primary/20"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
