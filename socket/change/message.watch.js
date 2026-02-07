/* server/socket/change/messages.change.js */
import messageModel from "../../models/Message.js";

export function initMessageChangeStream(io) {
  try {
    const pipeline = [
      { $match: { operationType: "insert" } } // uniquement les insert
    ];

    const changeStream = messageModel.watch(pipeline, { fullDocument: "updateLookup" });

    changeStream.on("change", (change) => {
      try {
        const newMessage = change.fullDocument;
        if (!newMessage) return;

        console.log("✅ New message detected via change stream:", newMessage.messageId || newMessage._id);

        // utilise la même convention de room que le reste du code
        const receiverRoom = `user(${newMessage.receiverId})`;

        // Construis le payload conforme au client
        const payload = {
          messageId: newMessage.messageId,
          temporaryId: newMessage.temporaryId ?? null,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          text: newMessage.text,
          media: newMessage.media ?? null,
          file: newMessage.file ?? null,
          type: newMessage.type,
          createdAt: newMessage.createdAt
        };

        // Emit au destinataire (si connecté)
        io.to(receiverRoom).emit("message:receive", payload);

      } catch (err) {
        console.error("❌ Error handling changeStream change:", err);
      }
    });

    changeStream.on("error", (err) => {
      console.error("❌ ChangeStream error:", err);
      // re-try backoff
      setTimeout(() => initMessageChangeStream(io), 5000);
    });

    process.on("SIGINT", async () => {
      try {
        await changeStream.close();
        console.log("ChangeStream closed on SIGINT");
      } catch (_) {}
      process.exit(0);
    });

    console.log("🔁 Message ChangeStream initialized");
    return changeStream;
  } catch (err) {
    console.error("❌ Failed to init ChangeStream:", err);
    setTimeout(() => initMessageChangeStream(io), 5000);
  }
}

// ----> watch updates
messageModel.watch([{ $match: { operationType: 'update' } }], { fullDocument: 'updateLookup' })
  .on('change', change => {
    const updated = change.updateDescription?.updatedFields || {};
    const doc = change.fullDocument;

    if (updated.deliveredAt) {
      io.to(`user(${doc.senderId})`).emit('message:delivered', {
        messageId: doc.messageId,
        deliveredAt: doc.deliveredAt
      });
    }

    if (updated.readAt) {
      io.to(`user(${doc.senderId})`).emit('message:read', {
        messageId: doc.messageId,
        readAt: doc.readAt
      });
    }
  });

