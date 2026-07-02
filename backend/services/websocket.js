import { Server } from "socket.io";
import logger from "./logger.js";

let io;

export function initWebSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingInterval: 30000,
    pingTimeout: 10000
  });

  io.on("connection", (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    socket.on("subscribe:journey", (journeyId) => {
      socket.join(`journey:${journeyId}`);
      logger.info(`Socket ${socket.id} subscribed to journey:${journeyId}`);
    });

    socket.on("subscribe:dashboard", () => {
      socket.join("dashboard");
      logger.info(`Socket ${socket.id} subscribed to dashboard`);
    });

    socket.on("subscribe:admin", () => {
      socket.join("admin");
      logger.info(`Socket ${socket.id} subscribed to admin channel`);
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  logger.info("WebSocket server initialized");
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("WebSocket server not initialized. Call initWebSocket first.");
  }
  return io;
}

export function emitJourneyUpdate(journeyId, data) {
  if (io) {
    io.to(`journey:${journeyId}`).emit("journey:update", data);
    io.to("admin").emit("journey:update", data);
  }
}

export function emitDashboardUpdate(data) {
  if (io) {
    io.to("dashboard").emit("dashboard:update", data);
  }
}

export function emitNotification(userId, notification) {
  if (io) {
    io.to(`user:${userId}`).emit("notification", notification);
    io.to("admin").emit("notification", notification);
  }
}
