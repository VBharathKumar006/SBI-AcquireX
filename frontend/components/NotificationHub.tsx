"use client";

import { useState, useCallback, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useSocket } from "../lib/socket";

const ICON_MAP = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
};

const COLOR_MAP = {
  success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  error: "text-red-500 bg-red-50 dark:bg-red-500/10",
  info: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  warning: "text-amber-500 bg-amber-50 dark:bg-amber-500/10"
};

type NotificationItem = {
  id: number;
  read: boolean;
  type?: string;
  title?: string;
  body?: string;
  [key: string]: unknown;
};

export function NotificationHub() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { connected, lastEvent } = useSocket();

  useEffect(() => {
    if (lastEvent?.type === "notification") {
      setNotifications((prev) => [
        { id: Date.now(), ...lastEvent.data, read: false } as NotificationItem,
        ...prev.slice(0, 49)
      ]);
    }
  }, [lastEvent]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                {!connected && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    offline
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="rounded px-2 py-1 text-[11px] font-medium text-sbi-blue hover:bg-sbi-blue/10"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const nType = (n.type || "info") as keyof typeof ICON_MAP;
                  const Icon = ICON_MAP[nType] || Info;
                  const colorClass = COLOR_MAP[nType] || COLOR_MAP.info;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 border-b border-slate-100 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 ${n.read ? "opacity-60" : ""}`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="mt-0.5 shrink-0 rounded p-0.5 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
