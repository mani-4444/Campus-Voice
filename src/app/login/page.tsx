"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Shield,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  Lock,
  Mail,
  UserPlus,
  LogIn,
  Users,
  GraduationCap,
  BookOpen,
  UserCog,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/components/app-context";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [identifier, setIdentifier] = useState(""); // email or roll number
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inputFocus, setInputFocus] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Check Supabase connectivity
    const checkSupabase = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[Supabase] Connected, session:", data?.session ? "exists" : "none");
      } catch (err) {
        console.error("[Supabase] Connection error:", err);
        toast.error("Cannot connect to Supabase. Check your internet connection.");
      }
    };
    
    checkSupabase();
  }, []);

  const redirectByRole = (userRole: UserRole) => {
    // Save role to localStorage for app context
    if (typeof window !== "undefined") {
      localStorage.setItem("app-role", userRole);
      console.log("[Auth] Saved role to localStorage:", userRole);
    }
    
    const path = 
      userRole === "student" ? "/dashboard" :
      userRole === "faculty" ? "/faculty" :
      "/admin";
    
    console.log("[Auth] Redirecting to:", path);
    router.push(path);
  };

  const handleAuth = async () => {
    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    if (!identifier || !password) {
      const idField = role === "student" ? "roll number" : "email";
      toast.error(`Please enter ${idField} and password.`);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    console.log("[Auth] Starting auth process for role:", role);

    try {
      if (isSignUp) {
        // ── Sign Up ──
        const email =
          role === "student"
            ? `${identifier}@campus.edu`
            : `${identifier}@campusvoice.local`;
        console.log("[Auth] Signing up with:", email);
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          data: { role, identifier },
        });
        
        if (error) {
          console.error("[Auth] Signup error:", error.message);
          toast.error(error.message);
          setLoading(false);
          return;
        }
        
        console.log("[Auth] Signup successful, redirecting...");
        toast.success("Account created! Redirecting...");
        
        // Redirect with a small delay to ensure auth state updates
        setTimeout(() => redirectByRole(role), 500);
      } else {
        // ── Sign In ──
        // All roles need emails in format: identifier@domain
        const email =
          role === "student"
            ? `${identifier}@campus.edu`
            : `${identifier}@campusvoice.local`;
        console.log("[Auth] Signing in with:", email);
        
        try {
          const { error, data } = await Promise.race([
            supabase.auth.signInWithPassword({ email, password }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Sign in request timed out after 10 seconds")), 10000)
            )
          ]) as any;
          
          if (error) {
            console.error("[Auth] Signin error:", error.message);
            toast.error(error.message || "Sign in failed");
            setLoading(false);
            return;
          }
          
          console.log("[Auth] Signin successful, user:", data?.user?.email);
          toast.success("Signed in! Redirecting...");
          
          // Redirect with a small delay to ensure auth state updates
          setTimeout(() => redirectByRole(role), 500);
        } catch (signInError) {
          const errorMsg = signInError instanceof Error ? signInError.message : "Sign in failed";
          console.error("[Auth] Signin exception:", errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("[Auth] Exception:", err);
      toast.error(message);
      setLoading(false);
    }
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
                <Shield
                  className="h-7 w-7 text-primary-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CampusVoice</h1>
            <p className="text-xs text-muted-foreground dark:text-foreground/70 mt-1.5 tracking-wide uppercase">
              Smart Feedback Platform
            </p>
          </div>

          {/* Step 1: Role Selection */}
          {!role ? (
            <>
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-foreground dark:text-foreground/90 mb-4 text-center">
                  Sign in as
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "student" as const,
                      label: "Student",
                      icon: GraduationCap,
                    },
                    {
                      value: "faculty" as const,
                      label: "Faculty",
                      icon: BookOpen,
                    },
                    {
                      value: "admin" as const,
                      label: "Admin",
                      icon: UserCog,
                    },
                  ].map(({ value, label, icon: Icon }) => (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-card/50 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-card"
                    >
                      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bottom text */}
              <p className="text-center text-[11px] text-muted-foreground/60 dark:text-foreground/70">
                All submissions are fully anonymous. Your identity is never
                revealed.
              </p>
            </>
          ) : (
            <>
              {/* Step 2: Authentication */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                <button
                  type="button"
                  onClick={() => {
                    setRole(null);
                    setIdentifier("");
                    setPassword("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Change role
                </button>
              </div>

              {/* Sign In / Sign Up toggle */}
              <div className="flex rounded-xl bg-muted/50 p-1 mb-6 gap-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-center transition-all duration-250 ${
                    !isSignUp
                      ? "bg-card text-foreground shadow-md border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-center transition-all duration-250 ${
                    isSignUp
                      ? "bg-card text-foreground shadow-md border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-sm font-medium">Sign Up</span>
                </button>
              </div>

              {/* Form */}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAuth();
                }}
              >
                {/* Identifier Field */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground dark:text-foreground/70 mb-2">
                    {role === "student" ? "Roll Number" : "Email Address"}
                  </label>
                  <div className="relative">
                    <Users
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                        inputFocus === "identifier"
                          ? "text-primary"
                          : "text-muted-foreground/40"
                      }`}
                      strokeWidth={1.5}
                    />
                    <input
                      type={role === "student" ? "text" : "email"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        role === "student"
                          ? "e.g., 2024001"
                          : "you@example.com"
                      }
                      onFocus={() => setInputFocus("identifier")}
                      onBlur={() => setInputFocus(null)}
                      className="w-full rounded-xl border border-border bg-background/50 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground dark:text-foreground/70 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                        inputFocus === "password"
                          ? "text-primary"
                          : "text-muted-foreground/40"
                      }`}
                      strokeWidth={1.5}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        isSignUp ? "Min 6 characters" : "Enter your password"
                      }
                      onFocus={() => setInputFocus("password")}
                      onBlur={() => setInputFocus(null)}
                      className="w-full rounded-xl border border-border bg-background/50 pl-11 pr-11 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      autoComplete={
                        isSignUp ? "new-password" : "current-password"
                      }
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

                {!isSignUp && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 neon-glow disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground dark:text-foreground/70 uppercase tracking-wider">
                  Secure & Anonymous
                </span>
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
            </>
          )}
        </div>

        {/* Bottom text */}
        <p className="text-center text-[11px] text-muted-foreground/60 dark:text-foreground/70 mt-4">
          All submissions are fully anonymous. Your identity is never revealed.
        </p>
      </div>
    </div>
  );
}
