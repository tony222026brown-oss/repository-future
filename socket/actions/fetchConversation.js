import Message from "../../models/Message.js";

/* Fetch conversation between userA and userB - options: { limit = 20, before = new Date() } */
export async function fetchConversation(userA, userB, options = {}) {
  const limit = Math.min(100, options.limit || 20);
  const before = options.before ? new Date(options.before) : new Date();

  const filter = {
    $or: [
      { from: userA, to: userB },
      { from: userB, to: userA }
    ],
    createdAt: { $lt: before }
  };

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  // Return chronological order ascending
  return messages.reverse();
}
