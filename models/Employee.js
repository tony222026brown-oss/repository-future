import mongoose from "mongoose";

/* server/models/Employee.js */
const employeeModel = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    employeeID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employeeName: { type: String, required: true },
    employeePhoto: { type: String, default: undefined },
    employeeType: { type: Number, enum: [0, 1, 2], required: true },
    groupClosedTo: { type: [String], default: undefined },
    permissionBlocked: { type: [String], enum: [0, 1], default: undefined },
    arrivedAt: { type: Date, default: Date.now },
}, {
    timestamp: true
});

export default mongoose.model("Employee", employeeModel);