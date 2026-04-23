import mongoose from 'mongoose';

/* server/models/Deliver.js */
const clientDeliverModel = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    clientID: { type: String, required: true },
    clientName: { type: String, trim: true, required: true },
    clientGender: { type: Number, enum: [0, 1, 2, 3], required: true },
    clientPhotoProfile: { type: String, default: undefined },
    clientEmotion: { type: String, default: undefined },
    clientLocation: { type: String, default: undefined },
    clientNeed: { type: String, default: undefined },
    isDelivered: { type: Boolean, default: false },
    hasBeenBuy: { type: Boolean, default: false },
    boughtAt: { type: Date, default: Date.now },
    currentBusinessId: { type: String, required: true },
    currentEmployeeId: { type: String, required: true },
    switchAccount: [
        {
            businessId: { type: String, required: true },
            employeeId: { type: String, required: true },
            hasSwitch: { type: Boolean, default: false, required: true },
            switchAt: { type: Date, default: Date.now },
        },
    ],
    timeDeliver: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

export default mongoose.model('Deliver', clientDeliverModel);