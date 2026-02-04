import Message from "../../models/Message.js";

export async function markMessageDelivered(messageId) {
  const updated = await Message.findOneAndUpdate(
    { messageId },
    { deliveredAt: new Date() },
    { new: true }
  );
  return updated;
}
