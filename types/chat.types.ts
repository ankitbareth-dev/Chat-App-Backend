export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  seenAt?: Date | null;

  sender?: {
    id: string;
    name: string;
    profilePicture: string;
  };
}

export interface GetMessagesParams {
  receiverId: string;
  page?: number;
  limit?: number;
}
export interface ChatListUser {
  id: string;
  name: string;
  phone: string;
  profilePicture: string;
}
export interface MessageInput {
  senderId: string;
  receiverId: string;
  content: string;
}
