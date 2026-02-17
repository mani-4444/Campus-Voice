"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export type UserRole = "student" | "faculty" | "admin";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  authLoading: boolean;
}

const AppContext = createContext<AppContextType>({
  role: "student",
  setRole: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  user: null,
  signOut: async () => {},
  authLoading: true,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("student");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const supabase = createClient();

  // Fetch profile role from Supabase (with 5 s timeout + localStorage fallback)
  const fetchProfile = useCallback(
    async (userId: string) => {
      const fallback = () => {
        const saved = localStorage.getItem("app-role") as UserRole;
        if (saved && ["student", "faculty", "admin"].includes(saved)) {
          setRoleState(saved);
        }
      };

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single()
          .abortSignal(controller.signal);

        clearTimeout(timer);

        if (error) {
          console.warn("[AppProvider] Profile fetch error:", error.message);
          fallback();
          return;
        }

        if (
          profile?.role &&
          ["student", "faculty", "admin"].includes(profile.role)
        ) {
          console.log("[AppProvider] Profile role:", profile.role);
          setRoleState(profile.role as UserRole);
          localStorage.setItem("app-role", profile.role);
        }
      } catch (err) {
        console.warn("[AppProvider] Profile fetch failed/timed-out:", err);
        fallback();
      }
    },
    [supabase],
  );

  // Immediately restore role from localStorage so UI renders without waiting
  useEffect(() => {
    setMounted(true);

    // Sync localStorage role immediately (no network wait)
    const savedRole = localStorage.getItem("app-role") as UserRole;
    if (savedRole && ["student", "faculty", "admin"].includes(savedRole)) {
      setRoleState(savedRole);
    }

    // Then check real auth in background
    const initAuth = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        console.log(
          "[AppProvider] getUser:",
          currentUser ? currentUser.email : "none",
        );
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (e) {
        console.warn("[AppProvider] getUser failed:", e);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes (e.g. sign-in from another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        // Role was already set by initAuth or login page — don't re-fetch here
        // to avoid unbounded network calls that can hang the UI.
        if (sessionUser) {
          const saved = localStorage.getItem("app-role") as UserRole;
          if (saved && ["student", "faculty", "admin"].includes(saved)) {
            setRoleState(saved);
          }
        }
        setAuthLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Keep localStorage as fallback for non-authenticated scenarios
    localStorage.setItem("app-role", newRole);
  };

  const signOut = async () => {
    try {
      // Clear the Supabase session
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Logout error:", error);
    } catch (err) {
      console.error("Logout exception:", err);
    }

    // Clear local state
    setUser(null);
    setRoleState("student");
    localStorage.removeItem("app-role");

    // Redirect to login
    window.location.href = "/login";
  };

  if (!mounted) {
    // Return children immediately on SSR — hydration will pick up
    return <>{children}</>;
  }

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        sidebarCollapsed,
        setSidebarCollapsed,
        user,
        signOut,
        authLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
