/* server/actions/markMessageRead.js */
import Message from "../../models/Message.js";

export async function markMessageRead(messageId, readerId) {
  const updated = await Message.findOneAndUpdate(
    { messageId, receiverId: readerId },
    { readAt: new Date() },
    { new: true }
  );
  return updated;
}
