import twilio from "twilio";
import User from "../database/usersDB.js"; // User model

// ----------------------
// Create & Send OTP
// ----------------------
export const CreateOtp = async (req, res) => {
  const account = process.env.AccountSID;
  const token = process.env.AuthToken;
  const myPhone = process.env.MyNumber;

  const client = twilio(account, token);

  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Find user by phone
    const existingUser = await User.findOne({ phone });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry to user
    existingUser.otp = otp;
    existingUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await existingUser.save();

    // Send OTP SMS
    await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: myPhone,
      to: phone,
    });

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};


// ----------------------
// Verify OTP
// ----------------------
export const VerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    // Find user
    const existingUser = await User.findOne({ phone });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check OTP expiry
    if (!existingUser.otp || Date.now() > existingUser.otpExpiresAt) {
      existingUser.otp = null;
      existingUser.otpExpiresAt = null;
      await existingUser.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Check OTP match
    if (existingUser.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ OTP verified → clear OTP
    existingUser.otp = null;
    existingUser.otpExpiresAt = null;
    await existingUser.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
