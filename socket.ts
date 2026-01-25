import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { sendMessage } from "./services/messageService";
import env from "./utils/envVariable";

export interface SocketWithAuth extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server) => {
  io.use(async (socket: SocketWithAuth, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Authentication error"));
      }

      const token = cookieHeader.split("token=")[1]?.split(";")[0];

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded: any = jwt.verify(token, env.JWT_SECRET);

      if (!decoded.userId) {
        return next(new Error("Authentication error"));
      }

      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: SocketWithAuth) => {
    console.log(`User connected: ${socket.userId}`);

    if (socket.userId) {
      socket.join(socket.userId);
    }

    socket.on(
      "send_message",
      async (data: { receiverId: string; content: string }) => {
        if (!socket.userId) return;

        try {
          const { receiverId, content } = data;

          const message = await sendMessage(socket.userId, receiverId, content);

          io.to(receiverId).emit("receive_message", message);

          socket.emit("message_sent", message);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      },
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
