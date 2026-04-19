import Message from "../../models/Message.js";

/* server/socket/actions/conversation/markMessageDelivered.js */
export async function markMessageDelivered(messageId) {
  const updated = await Message.findOneAndUpdate(
    { messageId },
    { deliveredAt: new Date() },
    { new: true }
  );
  return updated;
}
