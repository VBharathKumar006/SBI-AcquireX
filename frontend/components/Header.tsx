"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationHub } from "./NotificationHub";

type Props = {
  darkMode: boolean;
  onToggleDark: () => void;
};

export function Header({ darkMode, onToggleDark }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
      <div className="flex items-center gap-3 lg:ml-0 ml-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sbi-blue to-sbi-cyan text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">SBI AcquireX</h1>
          <p className="hidden text-xs text-slate-500 md:block dark:text-slate-400">
            Agentic customer acquisition platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <NotificationHub />
        {mounted && (
          <button
            onClick={onToggleDark}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}

        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-600 dark:bg-slate-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sbi-blue to-sbi-cyan text-xs font-bold text-white">
            BK
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Bharath K</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Team Alpha</p>
          </div>
        </div>
      </div>
    </header>
  );
}
