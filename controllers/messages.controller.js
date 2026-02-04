/* server/controllers/messages.controller.js */
import Message from '../models/Message.js';

export const recoverMessages = async (req, res) => {
  try {
    const userId = req.user.userID;
    const other = req.query.with;
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    if (!other) return res.status(400).json({ error: 'missing_with' });

    const filter = {
      $or: [
        { from: userId, to: other },
        { from: other, to: userId }
      ],
      createdAt: { $lt: before }
    };

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ data: messages.reverse(), count: messages.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
}