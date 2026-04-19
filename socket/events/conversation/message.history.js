import { fetchConversation } from "../../actions/conversation/fetchConversation.js";

/* server/socket/events/message.history.js */
export function getMessageFromConversation(io, socket) {
  socket.on("message:history", async (payload, res) => {
    try {
      const me = socket.user.userID;
      const other = payload?.with || payload?.other || payload?.user;

      if (!other) return res?.({ ok: false, error: "📍 missing_other" });

      const limit = payload?.limit || 20;

      const messages = await fetchConversation(me, other, { limit, dateToFetchMessageBefore });

      res?.({ ok: true, data: messages, count: messages.length });
    } catch (err) {
      console.error("❌ event: message:history error", err);
      res?.({ ok: false, error: "📍 server_error" });
    }
  });
}
