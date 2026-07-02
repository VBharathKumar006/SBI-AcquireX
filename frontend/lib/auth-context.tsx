"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type User = { id: string; name: string; email: string };
type AuthState = { user: User | null; token: string | null; loading: boolean };

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

import { API } from "./config";

const AUTH_API = API.auth;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem("aquirex_token");
    if (token) {
      fetch(`${AUTH_API}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((data) => setState({ user: data.user, token, loading: false }))
        .catch(() => { localStorage.removeItem("aquirex_token"); setState({ user: null, token: null, loading: false }); });
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      return err.error || "Login failed";
    }
    const data = await res.json();
    localStorage.setItem("aquirex_token", data.token);
    setState({ user: data.user, token: data.token, loading: false });
    return null;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${AUTH_API}/signup`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      return err.error || "Signup failed";
    }
    const data = await res.json();
    localStorage.setItem("aquirex_token", data.token);
    setState({ user: data.user, token: data.token, loading: false });
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aquirex_token");
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
