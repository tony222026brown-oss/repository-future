import mongoose from "mongoose";

/* server/models/Customer.js */
const customerModel = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    businessId: { type: String, required: true },
    employeeId: { type: String, required: true },
    slotPartOf: { type: Number, required: true, default: 1 },
    userId: { type: String, required: true },
    connected: { type: Boolean, default: undefined },
    userName: { type: String, required: true },
    gender: { type: Number, enum: [0, 1, 2, 3], required: true },
    profileImage: { type: String, default: undefined },
    lastMessage: { type: String, default: undefined },
    giftsReceived: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },
    timeExpired: { type: Date, default: Date.now }, // Add plus 2 weeks
    timeAcquired: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model("Customer", customerModel);