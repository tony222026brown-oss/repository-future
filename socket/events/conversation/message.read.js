/* server/socket/events/message.read.js */
import { markMessageRead } from "../actions/markMessageRead.js";

export function eventOnMessageRead(io, socket) {
  socket.on("message:read", async (payload) => {
    try {
      // ----> if `messageId` don't exist return false
      if (!payload?.messageId) return;

      // ----> mark `message read`
      const updated = await markMessageRead(payload.messageId, socket.user.userID);

      // ----> notify `senderId` message was read
      if (updated) {
        io.to(`user(${updated.senderId})`).emit("message:read", {
          messageId: updated.messageId,
          readAt: updated.readAt
        });
      }
    } catch (err) {
      console.error("❌ event: message:read error", err);
    }
  });
}
