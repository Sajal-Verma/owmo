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
        enum: ['xiaomi', 'vivo', 'oppo', 'realme', 'samsung', 'apple', 'oneplus'],
        required: true,
    },
    model: {
        type: String,
        lowercase: true,
    },
    issue: {
        type: String,
        enum: ["Screen Issues",
            "Battery & Charging",
            "Audio Issues",
            "Camera Problems",
            "Network/Connectivity",
            "Button & Sensor Faults",
            "Software/OS Issues",
            "Security/Unlock",
            "Liquid Damage",
            "Performance Lag",
            "Update/App Failures",
            "Device Not Turning On",
            'other'],
        required: true,
    },
    issueDescription: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        default: 'pending',
    },
    pic:[imageSchema],
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
    technicianName:{
        type : String,
    }
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);
export default Request;
