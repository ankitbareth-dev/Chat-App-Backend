import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import env from "../utils/envVariable";
import { socketAuthMiddleware } from "./middleware/auth";
import { registerChatHandlers } from "./handlers/chatEvents";
import { prisma } from "../utils/prisma";

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const userId = socket.userId;

    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: true },
        });

        io.emit("user_status", { userId, isOnline: true });
      } catch (err) {
        console.error("Failed to update online status:", err);
      }

      socket.join(userId);
    }

    registerChatHandlers(io, socket);

    socket.on("disconnect", async () => {
      if (userId) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isOnline: false,
              lastSeen: new Date(),
            },
          });

          io.emit("user_status", {
            userId,
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (err) {
          console.error("Failed to update offline status:", err);
        }
      }
    });
  });

  return io;
};
