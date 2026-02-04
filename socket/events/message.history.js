import { fetchConversation } from "../actions/fetchConversation.js";

/**
 * Register history fetch.
 * Client emits: socket.emit('message:history', { with: otherUserId, limit, before }, ack)
 * ack => { ok: true, data: [...] } or { ok: false, error: '...' }
 */
export function registerMessageHistory(io, socket) {
  socket.on("message:history", async (payload, ack) => {
    try {
      const me = socket.user.userID;
      const other = payload?.with || payload?.other || payload?.user;
      if (!other) return ack?.({ ok: false, error: "missing_other" });

      const limit = payload?.limit || 20;
      const before = payload?.before || null;

      const messages = await fetchConversation(me, other, { limit, before });
      ack?.({ ok: true, data: messages, count: messages.length });
    } catch (err) {
      console.error("event: message:history error", err);
      ack?.({ ok: false, error: "server_error" });
    }
  });
}
