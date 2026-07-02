"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import config from "./config";

type SocketEvent = {
  type: string;
  data: Record<string, unknown>;
};

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
  lastEvent: SocketEvent | null;
  subscribeJourney: (id: string) => void;
  subscribeAdmin: () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SocketEvent | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const s = io(config.apiUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10
    });

    s.on("connect", () => {
      setConnected(true);
      s.emit("subscribe:dashboard");
    });

    s.on("disconnect", () => setConnected(false));

    s.on("connect_error", () => setConnected(false));

    s.on("journey:update", (data: Record<string, unknown>) => setLastEvent({ type: "journey:update", data }));
    s.on("dashboard:update", (data: Record<string, unknown>) => setLastEvent({ type: "dashboard:update", data }));
    s.on("notification", (data: Record<string, unknown>) => setLastEvent({ type: "notification", data }));

    socketRef.current = s;
    setSocket(s);

    return () => { s.close(); };
  }, []);

  const subscribeJourney = useCallback((journeyId: string) => {
    socketRef.current?.emit("subscribe:journey", journeyId);
  }, []);

  const subscribeAdmin = useCallback(() => {
    socketRef.current?.emit("subscribe:admin");
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, lastEvent, subscribeJourney, subscribeAdmin }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
