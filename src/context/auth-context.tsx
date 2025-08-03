'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

type AuthContextType = {
  user: { email: string; company_name: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, company_name: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; company_name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
        console.log("Token found in localStorage:", storedToken);
      setToken(storedToken);

      // Fetch user details using the token
      const fetchUser = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser({ email: data.email, company_name: data.company_name });
          } else {
            console.error("Failed to fetch user details:", res.statusText);
            logout(); // Clear token if fetching user fails
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          logout(); // Clear token if an error occurs
        }
      };

      fetchUser();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ email: data.email, company_name: data.company_name });
        localStorage.setItem('token', data.token); // Store token for persistence
        setToken(data.token); // Save the JWT token
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
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
          body: JSON.stringify({
            user: {
              email,
              password,
              company_name,
            },
          }),
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null); // Clear the token on logout
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}