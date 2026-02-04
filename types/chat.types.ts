export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
}

export interface GetMessagesParams {
  receiverId: string;
  page?: number;
  limit?: number;
}
