import mongoose from "mongoose";

/* server/models/Business.js */
const businessModel = new mongoose.Schema({
    id: { type: String, required: true, unique: true, trim: true },
    businessId: { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
    businessPhoto: { type: String, default: undefined },
    isSync: { type: Boolean, default: false },
    biography: { type: String, default: undefined },
    businessType: { type: Number, enum: [0, 1, 2, 3] },
    syncAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model("Business", businessModel);