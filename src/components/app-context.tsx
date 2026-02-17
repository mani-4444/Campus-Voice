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

  // Fetch profile role from Supabase
  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (
        profile?.role &&
        ["student", "faculty", "admin"].includes(profile.role)
      ) {
        setRoleState(profile.role as UserRole);
      }
    },
    [supabase],
  );

  useEffect(() => {
    setMounted(true);

    // Check current session
    const initAuth = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          // Fallback to localStorage for unauthenticated browsing (landing page, etc.)
          const savedRole = localStorage.getItem("app-role") as UserRole;
          if (
            savedRole &&
            ["student", "faculty", "admin"].includes(savedRole)
          ) {
            setRoleState(savedRole);
          }
        }
      } catch {
        // Supabase not configured or network error — fall back to localStorage
        const savedRole = localStorage.getItem("app-role") as UserRole;
        if (savedRole && ["student", "faculty", "admin"].includes(savedRole)) {
          setRoleState(savedRole);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchProfile(sessionUser.id);
        }
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
    await supabase.auth.signOut();
    setUser(null);
    setRoleState("student");
    localStorage.removeItem("app-role");
    window.location.href = "/login";
  };

  if (!mounted) {
    return null;
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
