-- CreateIndex
CREATE INDEX "Message_receiverId_senderId_seenAt_idx" ON "Message"("receiverId", "senderId", "seenAt");
