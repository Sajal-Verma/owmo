import mongoose from "mongoose";
import imageSchema from "../database/naryDB.js"

const requestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['android', 'tablet', 'ipad', 'iphone'],
        default: 'android',
        required: true,
    },
    brand: {
        type: String,
        enum: ['xiaomi', 'vivo', 'oppo', 'realme', 'samsung', 'apple', 'oneplus', 'other'],
        required: true,
    },
    model: {
        type: String,
        lowercase: true,
    },
    imei: {
        type: String,
        lowercase: true,
    },
    issue: {
        type: String,
        enum: ["Screen Issues",
            "Battery & Charging",
            "Audio Issues",
            "Camera Problems",
            'other'],
        required: true,
    },
    issueDescription: {
        type: String,
    },
    serviceType: {
        type: String,
        lowercase: true,
    },
    urgency: {
        type: String,
        lowercase: true,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    pic: [imageSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This is like a foreign key
        required: true
    },
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "technician", // should have role: technician
        required: true
    },
    technicianName: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "failed", "completed", "refunded", "partial"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cash", "upi", "card"],
        default: "cash"
    },
    paymentAmount: {
        type: Number,
        default: 0
    },
    transactionId: {
        type: String,
        default: null
    },
    paymentDate: {
        type: Date,
        default: null
    },
    cashfreeOrderId: {
        type: String,
        default: null
    },
    cashfreePaymentSession: {
        type: String,
        default: null
    }

}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);

export default Request;   