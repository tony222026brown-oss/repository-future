/* server/socket/events/message.send.js */
import { createAndSaveMessage } from "../actions/createAndSaveMessage.js";
import { markMessageDelivered } from "../actions/markMessageDelivered.js";

export function eventOnPathMessage(io, socket) {
  socket.on("message:send", async (payload, res) => {
    try {
      // ----> if data don't exist return to the sender `error`
      if (!payload || !payload.receiverId) {
        return res?.({ ok: false, error: "📍 invalid_payload" });
      }

      // ----> Save message in MongoDB Atlas
      const saved = await createAndSaveMessage(payload, socket.user.userID);

      // ----> send to app current `response` of `action on MongoDB Atlas`
      res?.({
        ok: true,
        message: {
          messageId: saved.messageId,
          temporaryId: saved.temporaryId,
          senderId: saved.senderId,
          receiverId: saved.receiverId,
          text: saved.text,
          media: saved.media,
          file: saved.file,
          type: saved.type,
          createdAt: saved.createdAt,
          deliveredAt: saved.deliveredAt || null
        }
      });

      // ----> get `receiverId`
      const receiverIdRroom = `user(${saved.receiverId})`;

      // ----> push `message` to `receiverId` app
      io.to(receiverIdRroom).emit("message:receive", {
        messageId: saved.messageId,
        senderId: saved.senderId,
        receiverId: saved.receiverId,
        text: saved.text,
        media: saved.media,
        file: saved.file,
        createdAt: saved.createdAt
      });

      // If recipient online, mark delivered and emit delivered info to sender

      // ----> view if `receiverId` is connected
      const receiverIsConnected = await io.in(receiverIdRroom).allSockets();

      if (receiverIsConnected && receiverIsConnected.size > 0) {
        // ----> mark `message` was send in MongoDB Atlas
        const deliveredMsg = await markMessageDelivered(saved.messageId);

        // ----> notify sender about delivery
        io.to(`user(${socket.user.userID})`).emit("message:delivered", {
          messageId: deliveredMsg.messageId,
          temporaryId: deliveredMsg.temporaryId,
          deliveredAt: deliveredMsg.deliveredAt
        });
      }
    } catch (err) {
      console.error("❌ error on event(message:send)", err);
      ack?.({ ok: false, error: "❌ server_error" });
    }
  });
}
