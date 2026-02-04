/* server/socket/actions/message.js */
import Message from "../../models/Message.js";

export async function createAndSaveMessage(payload, senderId) {
  // ----> payload: { temporaryId, receiverId, text, media, file, type }
  const message = new Message({
    messageId: `msg_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    temporaryId: payload.temporaryId || null,
    senderId: senderId,
    receiverId: payload.receiverId,
    text: payload.text || '',
    media: payload.media || [],
    file: payload.file || [],
    type: payload.type || 'message'
  });

  const saved = await message.save();
  return saved;
}
