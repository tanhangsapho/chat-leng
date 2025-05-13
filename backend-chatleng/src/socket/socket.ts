import { Server as IOServer, Socket } from "socket.io";
import http from "http";
import { logger } from "../utils";

let io: IOServer | null = null;

/**
 * Initialize (or return) the singleton Socket.IO server
 */
export function initSocket(server: http.Server): IOServer {
  if (io) {
    return io;
  }

  io = new IOServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    logger.info("Socket connected", { id: socket.id });

    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      logger.info("🔑 Socket joined room", { id: socket.id, room });
    });

    socket.on(
      "chatMessage",
      async (payload: { room: string; user: string; text: string }) => {
        logger.debug("📨 chatMessage received", payload);
        // you can persist to Mongo here or emit to others immediately:
        io!.to(payload.room).emit("chatMessage", {
          user: payload.user,
          text: payload.text,
          ts: new Date().toISOString(),
        });
      }
    );

    socket.on("disconnect", (reason) => {
      logger.info("Socket disconnected", { id: socket.id, reason });
    });
  });

  return io;
}

export async function closeSocket(): Promise<void> {
  if (io) {
    return new Promise((resolve) => {
      io!.close(() => {
        logger.info("⚪️ Socket.IO server closed");
        resolve();
      });
    });
  }
}
