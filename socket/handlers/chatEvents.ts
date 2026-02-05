import { Server as SocketIOServer, Socket } from "socket.io";
import { saveMessage } from "../../services/chat.service";

const getChatRoom = (userId: string) => userId;

export const registerChatHandlers = (io: SocketIOServer, socket: Socket) => {
  socket.on("join_chat", (targetUserId: string) => {
    const userId = socket.userId;
    console.log(`${userId} wants to chat with ${targetUserId}`);
  });

  socket.on(
    "send_message",
    async (data: { receiverId: string; content: string }) => {
      const userId = socket.userId;
      if (!userId) return;

      const { receiverId, content } = data;

      try {
        const newMessage = await saveMessage({
          senderId: userId,
          receiverId,
          content,
        });

        io.to(receiverId).emit("receive_message", newMessage);

        socket.emit("message_sent", newMessage);
      } catch (error) {
        console.error("Socket Message Error:", error);
        socket.emit("error_message", "Failed to send message");
      }
    },
  );

  socket.on("start_typing", (data: { receiverId: string }) => {
    const userId = socket.userId;
    if (!userId) return;

    socket.to(data.receiverId).emit("user_typing", { senderId: userId });
  });

  socket.on("stop_typing", (data: { receiverId: string }) => {
    const userId = socket.userId;
    if (!userId) return;

    socket
      .to(data.receiverId)
      .emit("user_stopped_typing", { senderId: userId });
  });
};
