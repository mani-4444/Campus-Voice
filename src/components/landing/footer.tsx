"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

const links = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield
                  className="h-4 w-4 text-primary-foreground"
                  strokeWidth={2}
                />
              </div>
              <span className="text-base font-bold tracking-tight">
                Campus Voice
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              The smart feedback-to-action platform for educational
              institutions. Anonymous, transparent, and AI-powered.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
              <div className="h-2 w-2 rounded-full bg-success pulse-live" />
              All systems operational
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            &copy; Campus Voice 2026. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
