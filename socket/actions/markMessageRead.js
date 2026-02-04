import Message from "../models/Message.js";

export async function markMessageRead(messageId, readerId) {
  const updated = await Message.findOneAndUpdate(
    { messageId, to: readerId },
    { readAt: new Date() },
    { new: true }
  );
  return updated;
}
