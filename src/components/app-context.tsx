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

  // Fetch profile role from Supabase (with fallback to localStorage)
  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();
        
        if (error) {
          console.warn("Profile fetch error (expected if DB not set up):", error.message);
          // Use role from localStorage if available
          const savedRole = localStorage.getItem("app-role") as UserRole;
          if (savedRole && ["student", "faculty", "admin"].includes(savedRole)) {
            setRoleState(savedRole);
          }
          return;
        }
        
        if (profile?.role && ["student", "faculty", "admin"].includes(profile.role)) {
          setRoleState(profile.role as UserRole);
          localStorage.setItem("app-role", profile.role);
        }
      } catch (err) {
        console.warn("Error fetching profile:", err);
        // Fallback to localStorage
        const savedRole = localStorage.getItem("app-role") as UserRole;
        if (savedRole && ["student", "faculty", "admin"].includes(savedRole)) {
          setRoleState(savedRole);
        }
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
