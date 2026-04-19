import mongoose from "mongoose";

/* server/models/Gift.js */
const giftModel = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    name: { type: String, required: true },
    profileImage: { type: String, default: undefined },
    mediaUrl: { type: String, required: true, trim: true },
    contentText: { type: String, default: undefined },
    recipientId: { type: [String], required: true },
    readersId: { type: [String], required: true },
    expiresAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    uploaded: { type: Boolean, default: undefined }
}, {
    timestamps: true
});

export default mongoose.model("Gift", giftModel);