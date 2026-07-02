"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    (window as any).addEventListener("beforeinstallprompt", handler);
    return () => (window as any).removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show) return null;

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShow(false);
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sbi-blue/10">
          <Download className="h-5 w-5 text-sbi-blue" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white">Install SBI AcquireX</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Add to home screen for quick access</p>
        </div>
        <button
          onClick={handleInstall}
          className="rounded-lg bg-sbi-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sbi-blue/90"
        >
          Install
        </button>
        <button
          onClick={() => setShow(false)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
