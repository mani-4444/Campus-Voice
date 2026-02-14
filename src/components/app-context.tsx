"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "faculty" | "admin";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  role: "student",
  setRole: () => { },
  sidebarCollapsed: false,
  setSidebarCollapsed: () => { },
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("student");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem("app-role") as UserRole;
    if (savedRole && ["student", "faculty", "admin"].includes(savedRole)) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("app-role", newRole);
  };

  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider value={{ role, setRole, sidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
