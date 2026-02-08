import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
//import env from "../utils/envVariable"; will use latter on production
import { socketAuthMiddleware } from "./middleware/auth";
import { registerChatHandlers } from "./handlers/chatEvents";

export const initializeSocket = (httpServer: HTTPServer) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ];
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.userId;
    //console.log(`User connected: ${userId}`);

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
