'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

type AuthContextType = {
  user: { email: string; company_name: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, company_name: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; company_name: string } | null>(null);

  useEffect(() => {
    // Optionally, fetch session on mount
    // e.g., check localStorage/token
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login (replace with real API call)
    // On success, fetch company name
    console.log(password);
    try {
      // Here you would POST to /login and get a token. For now, just fetch /me.
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/me?email=${encodeURIComponent(email)}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setUser({ email: data.email, company_name: data.company_name });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (email: string, password: string, company_name: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, company_name }),
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}