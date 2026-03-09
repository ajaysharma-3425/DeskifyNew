"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: "user" | "admin" | null;
  login: (token: string, role: "user" | "admin") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);



  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setToken(storedToken);
        setRole(payload.role || "user");
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);


  const login = (newToken: string, newRole: "user" | "admin") => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);

    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}