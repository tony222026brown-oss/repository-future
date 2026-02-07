/* server/socket/actions/message.js */
import Message from "../../models/Message.js";

export async function createAndSaveMessage(payload, senderId) {
  try {
    const message = new Message({
      messageId: payload.messageId || `msg_${Date.now()}_${Math.round(Math.random() * 9999)}`,
      temporaryId: payload.temporaryId || null,
      senderId: senderId,
      receiverId: payload.receiverId,
      text: payload.text || '',
      media: payload.media || [],
      file: payload.file || [],
      type: payload.type || 1
    });
  
    const saved = await message.save();
    return saved;
  } catch(error) {
    console.error("❌ Erreur lors de la sauvegarde du message:", error);
    throw error;
  }
}
