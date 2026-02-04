/* server/socket/actions/message.js */
import Message from "../models/Message.js";

export async function createAndSaveMessage(payload, fromUserId) {
  // payload: { tempId, to, text, media, file, type }
  const message = new Message({
    messageId: `msg_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    tempId: payload.tempId || null,
    from: fromUserId,
    to: payload.to,
    text: payload.text || '',
    media: payload.media || [],
    file: payload.file || [],
    type: payload.type || 'message'
  });

  const saved = await message.save();
  return saved;
}
