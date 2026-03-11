'use client';

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: "user" | "admin" | null;
  isLoading: boolean; // Naya state
  login: (token: string, role: "user" | "admin") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading start

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as "user" | "admin";

    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole || "user");
    }
    setIsLoading(false); // Check khatam
  }, []);

  const login = (newToken: string, newRole: "user" | "admin") => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}