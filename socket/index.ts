import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import env from "../utils/envVariable";
import { socketAuthMiddleware } from "./middleware/auth";
import { registerChatHandlers } from "./handlers/chatEvents";

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`User connected: ${userId}`);

    if (userId) {
      socket.join(userId);
    }

    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};
