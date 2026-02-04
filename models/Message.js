import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  temporaryId: { type: String },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, default: '' },
  media: [{ url: String, mime: String, size: Number }],
  file: [{ url: String, name: String, size: Number }],
  type: { type: String, enum: ['message','system','image','file'], default: 'message' },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// index pour rechercher conversation entre deux users
messageSchema.index({ from: 1, to: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
