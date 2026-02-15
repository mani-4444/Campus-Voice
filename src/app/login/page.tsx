"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, UserRole } from "@/components/app-context";
import { useTheme } from "next-themes";
import { Shield, Eye, EyeOff, Sun, Moon, ArrowRight, Lock, Fingerprint } from "lucide-react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inputFocus, setInputFocus] = useState<string | null>(null);
  const { setRole } = useApp();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const roles: { key: UserRole; label: string; desc: string }[] = [
    { key: "student", label: "Student", desc: "Report & track issues" },
    { key: "faculty", label: "Faculty", desc: "Department oversight" },
    { key: "admin", label: "Admin", desc: "System management" },
  ];

  const handleLogin = () => {
    setLoading(true);
    // Set rule immediately to ensure it persists
    setRole(selectedRole);

    setTimeout(() => {
      if (selectedRole === "student") router.push("/dashboard");
      else if (selectedRole === "faculty") router.push("/faculty");
      else router.push("/admin");
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0D12] via-[#0E1116] to-[#12161C] dark:block hidden" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#EDF2F7] via-[#F7F9FB] to-[#E8ECF0] dark:hidden" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.07] rounded-full blur-[120px] animate-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px] animate-orb-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,245,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-6 right-6 z-10 rounded-xl p-2.5 text-muted-foreground dark:text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      )}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 animate-slide-up">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary neon-glow-strong">
                <Shield className="h-7 w-7 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CampusVoice</h1>
            <p className="text-xs text-muted-foreground dark:text-foreground/70 mt-1.5 tracking-wide uppercase">Smart Feedback Platform</p>
          </div>

          {/* Role Tabs */}
          <div className="flex rounded-xl bg-muted/50 p-1 mb-6 gap-1">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelectedRole(r.key)}
                className={`flex-1 rounded-lg py-2.5 text-center transition-all duration-250 ${selectedRole === r.key
                  ? "bg-card text-foreground shadow-md border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span className="text-sm font-medium block">{r.label}</span>
                <span className="text-[10px] text-muted-foreground dark:text-foreground/70 block mt-0.5">{r.desc}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-foreground/70 mb-2">
                {selectedRole === "student" ? "Roll Number" : "Email Address"}
              </label>
              <div className="relative">
                <Fingerprint
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${inputFocus === "username" ? "text-primary" : "text-muted-foreground/40"
                    }`}
                  strokeWidth={1.5}
                />
                <input
                  type={selectedRole === "student" ? "text" : "email"}
                  placeholder={selectedRole === "student" ? "Enter your roll number" : "Enter your email"}
                  onFocus={() => setInputFocus("username")}
                  onBlur={() => setInputFocus(null)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-foreground/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${inputFocus === "password" ? "text-primary" : "text-muted-foreground/40"
                    }`}
                  strokeWidth={1.5}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onFocus={() => setInputFocus("password")}
                  onBlur={() => setInputFocus(null)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-11 pr-11 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 neon-glow disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground dark:text-foreground/70 uppercase tracking-wider">Secure & Anonymous</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 text-muted-foreground/60 dark:text-foreground/70">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3" strokeWidth={1.5} />
              <span className="text-[10px]">End-to-End Encrypted</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3" strokeWidth={1.5} />
              <span className="text-[10px]">Zero-Knowledge Identity</span>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-[11px] text-muted-foreground/60 dark:text-foreground/70 mt-4">
          All submissions are fully anonymous. Your identity is never revealed.
        </p>
      </div>
    </div>
  );
}
