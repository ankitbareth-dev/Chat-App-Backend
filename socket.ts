import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import env from "./utils/envVariable";
import { prisma } from "./utils/prisma";

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookiesHeader = socket.handshake.headers.cookie;
      if (!cookiesHeader) {
        return next(new Error("Unauthorized: No cookies"));
      }

      const parsedCookies = cookie.parse(cookiesHeader);
      const token = parsedCookies.token;

      if (!token) {
        return next(new Error("Unauthorized: No token"));
      }

      const decoded: any = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.join(socket.userId!);

    socket.on("join_chat", (targetUserId: string) => {
      console.log(`${socket.userId} wants to chat with ${targetUserId}`);
    });

    socket.on(
      "send_message",
      async (data: { receiverId: string; content: string }) => {
        if (!socket.userId) return;

        const { receiverId, content } = data;

        try {
          const messageData = {
            senderId: socket.userId,
            receiverId,
            content,
          };

          const newMessage = await prisma.message.create({
            data: messageData,
            select: {
              id: true,
              content: true,
              senderId: true,
              receiverId: true,
              timestamp: true,
            },
          });

          io.to(receiverId).emit("receive_message", newMessage);

          socket.emit("message_sent", newMessage);
        } catch (error) {
          console.error("Socket Message Error:", error);
          socket.emit("error_message", "Failed to send message");
        }
      },
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};
