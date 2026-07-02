"use client";

import {
  LayoutDashboard,
  UserRound,
  CreditCard,
  ClipboardCheck,
  BellRing,
  CalendarClock,
  Bot,
  PlugZap,
  ChevronLeft,
  Menu,
  BarChart3,
  ShieldCheck,
  UserCog,
  TrendingUp,
  Smartphone,
  MessageSquare,
  Mic,
  Building2
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/" },
  { id: "profile", label: "Customer Profile", icon: UserRound, href: "/" },
  { id: "products", label: "Product Discovery", icon: CreditCard, href: "/" },
  { id: "onboarding", label: "Onboarding Journey", icon: ClipboardCheck, href: "/" },
  { id: "recovery", label: "Recovery & Engagement", icon: BellRing, href: "/" },
  { id: "agents", label: "Agent Workspace", icon: Bot, href: "/" },
  { id: "integrations", label: "Integrations", icon: PlugZap, href: "/" }
];

const pageLinks = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "Admin", icon: ShieldCheck, href: "/admin" },
  { label: "Profile", icon: UserCog, href: "/profile" }
];

const featureLinks = [
  { label: "AI Planner", icon: CalendarClock, href: "/planner" },
  { label: "Wealth Mgmt", icon: TrendingUp, href: "/wealth" },
  { label: "YONO", icon: Smartphone, href: "/yono" },
  { label: "WhatsApp", icon: MessageSquare, href: "/whatsapp" },
  { label: "Voice Banking", icon: Mic, href: "/voice" },
  { label: "SME Banking", icon: Building2, href: "/sme" }
];

type Props = {
  activeSection: string;
  onNavigate: (id: string) => void;
};

export function Sidebar({ activeSection, onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="fixed left-4 top-3 z-50 rounded-md border border-slate-200 bg-white p-2 shadow-sm lg:hidden dark:border-slate-700 dark:bg-slate-800"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-800 ${
          collapsed ? "w-16" : "w-60"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
          {!collapsed && (
            <Link href="/" className="text-sm font-bold uppercase tracking-wider text-sbi-blue">AcquireX</Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-md p-1.5 text-slate-400 hover:bg-slate-100 lg:block dark:hover:bg-slate-700"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {!collapsed && "Sections"}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === "/" && activeSection === item.id;
            return pathname !== "/" ? (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sbi-blue/10 text-sbi-blue dark:bg-sbi-blue/20 dark:text-sbi-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {!collapsed && "Pages"}
          </p>
          {pageLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sbi-blue/10 text-sbi-blue dark:bg-sbi-blue/20 dark:text-sbi-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}

          <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {!collapsed && "Features"}
          </p>
          {featureLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sbi-blue/10 text-sbi-blue dark:bg-sbi-blue/20 dark:text-sbi-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          {!collapsed && (
            <p className="px-3 text-xs text-slate-400 dark:text-slate-500">SBI GFF 2026</p>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
