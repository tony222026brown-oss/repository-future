import { markMessageRead } from "../actions/markMessageRead.js";

export function registerMessageRead(io, socket) {
  socket.on("message:read", async (payload) => {
    try {
      if (!payload?.messageId) return;
      const updated = await markMessageRead(payload.messageId, socket.user.userID);
      if (updated) {
        // notify sender
        io.to(`user:${updated.from}`).emit("message:read", {
          messageId: updated.messageId,
          readAt: updated.readAt
        });
      }
    } catch (err) {
      console.error("event: message:read error", err);
    }
  });
}
