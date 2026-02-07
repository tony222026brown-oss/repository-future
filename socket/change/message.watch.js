/* server/socket/change/messages.change.js */
import messageModel from "../../models/Message.js";

export function initWatchOnMongoDB(io) {
  try {
    const pipeline = [
      { $match: { operationType: { $in: ["insert", "update", "replace"] } } }
    ];

    const changeStream = messageModel.watch(pipeline, { fullDocument: "updateLookup" });

    changeStream.on("change", (change) => {
      try {
        const op = change.operationType;
        const doc = change.fullDocument;
        if (!doc) return;

        // room naming must match your app: user(<id>)
        const receiverRoom = `user(${doc.receiverId})`;
        const senderRoom = `user(${doc.senderId})`;

        if (op === "insert" || op === "replace") {
          console.log("✅ New message detected via change stream:", doc.messageId || doc._id);

          const payload = {
            messageId: doc.messageId,
            temporaryId: doc.temporaryId ?? null,
            senderId: doc.senderId,
            receiverId: doc.receiverId,
            text: doc.text,
            media: doc.media ?? null,
            file: doc.file ?? null,
            type: doc.type,
            createdAt: doc.createdAt
          };

          // Emit to receiver
          io.to(receiverRoom).emit("message:receive", payload);
        } else if (op === "update") {
          // change.updateDescription.updatedFields contient les champs modifiés
          const updated = change.updateDescription?.updatedFields || {};

          // deliveredAt set -> notify sender that message was delivered
          if (updated.deliveredAt) {
            console.log("🔔 Message delivered detected:", doc.messageId);
            io.to(`user(${doc.senderId})`).emit("message:delivered", {
              messageId: doc.messageId,
              deliveredAt: doc.deliveredAt
            });
          }

          // read or readAt set -> notify sender that message was read
          // Accept both boolean read:true OR readAt timestamp
          if (updated.read === true || updated.readAt) {
            console.log("🔔 Message read detected:", doc.messageId);
            io.to(`user(${doc.senderId})`).emit("message:read", {
              messageId: doc.messageId,
              readAt: doc.readAt || new Date()
            });
          }

          // If entire message fields changed and you want to forward to receiver, you can emit message:receive again
          // (optional) if other fields updated that receiver must see:
          // if (Object.keys(updated).length > 0) { io.to(receiverRoom).emit('message:update', { messageId: doc.messageId, updatedFields: updated }) }
        }
      } catch (err) {
        console.error("❌ Error handling changeStream change:", err);
      }
    });

    changeStream.on("error", (err) => {
      console.error("❌ ChangeStream error:", err);
      // retry after backoff
      setTimeout(() => initWatchOnMongoDB(io), 5000);
    });

    process.on("SIGINT", async () => {
      try {
        await changeStream.close();
        console.log("ChangeStream closed on SIGINT");
      } catch (_) {}
      process.exit(0);
    });

    console.log("🔁 Message ChangeStream initialized (insert/update)");
    return changeStream;
  } catch (err) {
    console.error("❌ Failed to init ChangeStream:", err);
    setTimeout(() => initWatchOnMongoDB(io), 5000);
  }
}
