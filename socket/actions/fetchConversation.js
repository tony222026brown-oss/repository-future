/* server/socket/fetchConversation.js */
import Message from "../../models/Message.js";

export async function fetchConversation(userA, userB, options = {}) {
  // ----> limit of message to recover
  const limit = Math.min(100, options.limit || 20);

  // ----> Date of last message
  const before = options.dateToFetchMessageBefore ? new Date(options.dateToFetchMessageBefore) : new Date();

  // ----> profil of `message` to recover
  const filter = {
    $or: [
      { senderId: userA, receiverId: userB }, 
      { senderId: userB, receiverId: userA }
    ],
    createdAt: { $lt: before }
  };

  // ----> get `all messages` from MongoDB Atlas
  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  // ----> Return chronological order ascending
  return messages.reverse();
}
