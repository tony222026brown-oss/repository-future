import mongoose from "mongoose";

/* server/models/BusinessGroup.js */
const businessGroupModel = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    businessId: { type: String, required: true },
    groupID: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    groupPhoto: { type: String, default: undefined },
    responsibleList: { type: [String], default: undefined },
    employeeList: { type: [String], default: undefined },
    employeeBlocked: { type: [String], default: undefined },
    lastModification: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model("BusinessGroup", businessGroupModel);