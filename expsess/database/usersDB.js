import mongoose from "mongoose";
import imageSchema from "../database/naryDB.js";

const userSchema = new mongoose.Schema(
  {
    name:{ 
      type: String, 
      lowercase: true,
      required: true
    },
    password: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      lowercase: true, 
      required: true, 
      unique: 
      true 
    },
    phone: { type: String,
      required: true,
      unique: true, 
      lowercase: true 
    },
    role: { 
      type: String, 
      lowercase: true, 
      enum: ["user", "technician", "admin"], 
      default: "user" 
    },
    address: { 
      type: String, 
      lowercase: true 
    },
    zip: { 
      type: String, 
      lowercase: true 
    },
    DOB: { 
      type: Date 
    },
    profile: { 
      type: Boolean 
    },
    shop: { 
      type: Boolean 
    },
    shopName: { 
      type: String, 
      lowercase: true 
    },
    qualification: { 
      type: Boolean 
    },
    qualificationName: { 
      type: String, 
      lowercase: true 
    },
    hired: { 
      type: Boolean 
    },
    pass: { 
      type: Boolean 
    },
    experience: { 
      type: Number 
    },
    rating: { 
      type: Number 
    },

    pic: [imageSchema], // array for multiple images

    otp: { 
      type: String 
    },
    otpExpiresAt: { 
      type: Date
    },
    otpVerified: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.otp;
    delete ret.otpExpiresAt;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
