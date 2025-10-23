import nodemailer from "nodemailer";
import User from "../database/usersDB.js"; // User model




const transporter = nodemailer.createTransport({
  service: "gmail", // you can use Outlook, Yahoo, custom SMTP too
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password (not normal password)
  },
});




export const CreateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry
    existingUser.otp = otp;
    existingUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await existingUser.save();

    // Send email
    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `<h2>Your OTP Code</h2><p><b>${otp}</b></p><p>Valid for 5 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent to email!" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};






export const VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Find user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check expiry
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

    // ✅ OTP verified → clear it
    existingUser.otp = null;
    existingUser.otpExpiresAt = null;
    await existingUser.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
