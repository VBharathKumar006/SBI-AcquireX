"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AuthProvider } from "../lib/auth-context";
import { ToastProvider } from "../lib/toast-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sbi-acquirex-theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("sbi-acquirex-theme", darkMode ? "dark" : "light");
    }
  }, [darkMode, mounted]);

  function handleNavigate(id: string) {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const hasLayout = !isAuthPage;

  return (
    <AuthProvider>
      <ToastProvider>
        {hasLayout && <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />}
        {hasLayout && <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />}
        <div className={hasLayout ? "lg:pl-60 pt-16 transition-all duration-300" : ""}>
          <main className="min-h-screen">{children}</main>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
