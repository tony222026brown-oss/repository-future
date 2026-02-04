import { createAndSaveMessage } from "../actions/createAndSaveMessage.js";
import { markMessageDelivered } from "../actions/markMessageDelivered.js";

/**
 * Register handler for "message:send"
 * - ack: returns { ok, message } or { ok:false, error }
 */
export function registerMessageSend(io, socket) {
  socket.on("message:send", async (payload, ack) => {
    try {
      if (!payload || !payload.to) {
        return ack?.({ ok: false, error: "invalid_payload" });
      }

      // Save message in DB
      const saved = await createAndSaveMessage(payload, socket.user.userID);

      // Ack to sender with server-side saved message
      ack?.({
        ok: true,
        message: {
          messageId: saved.messageId,
          tempId: saved.tempId,
          from: saved.from,
          to: saved.to,
          text: saved.text,
          media: saved.media,
          file: saved.file,
          createdAt: saved.createdAt,
          deliveredAt: saved.deliveredAt || null
        }
      });

      // emit to recipient room
      const toRoom = `user:${saved.to}`;
      io.to(toRoom).emit("message:receive", {
        messageId: saved.messageId,
        from: saved.from,
        to: saved.to,
        text: saved.text,
        media: saved.media,
        file: saved.file,
        createdAt: saved.createdAt
      });

      // If recipient online, mark delivered and emit delivered info to sender
      const socketsOfRecipient = await io.in(toRoom).allSockets();
      if (socketsOfRecipient && socketsOfRecipient.size > 0) {
        const deliveredMsg = await markMessageDelivered(saved.messageId);
        // notify sender about delivery
        io.to(`user:${socket.user.userID}`).emit("message:delivered", {
          messageId: deliveredMsg.messageId,
          tempId: deliveredMsg.tempId,
          deliveredAt: deliveredMsg.deliveredAt
        });
      }
    } catch (err) {
      console.error("event: message:send error", err);
      ack?.({ ok: false, error: "server_error" });
    }
  });
}
