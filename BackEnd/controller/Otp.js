import nodemailer from "nodemailer";
import User from "../database/usersDB.js";
import Twilio from "twilio";

const account = process.env.AccountSID;
const token = process.env.AuthToken;
const myPhone = process.env.MyNumber;

export const client = Twilio(account, token);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


//function for send the e-mail
export const sendEmail = async (to, subject, htmlMessage) => {
  try {
    await transporter.sendMail({
      from: `"OWMO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlMessage,
    });

    console.log("Email sent successfully.");
    return true;

  } catch (err) {
    console.error("Email sending failed:", err.message);
    return false;
  }
};

// ================== CREATE OTP ==================
export const CreateOtp = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    let user;
    if (emailOrPhone.includes("@")) {
      user = await User.findOne({ email: emailOrPhone });
    } else {
      user = await User.findOne({ phone: emailOrPhone });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP + Expiry (5 minutes)
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP
    if (emailOrPhone.includes("@")) {
      const subject = "Your OTP Code";
      const html = `<h3>Your OTP Code</h3><p><b>${otp}</b></p><p>Valid for 5 minutes.</p>`;

      sendEmail(emailOrPhone,subject,html);
    } else {
      await client.messages.create({
        body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        from: myPhone,
        to: emailOrPhone.startsWith("+") ? emailOrPhone : `+91${emailOrPhone}`,
      });
    }

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

// ================== VERIFY OTP ==================
export const VerifyOtp = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({ message: "Email/Phone and OTP are required" });
    }

    let user;
    if (emailOrPhone.includes("@")) {
      user = await User.findOne({ email: emailOrPhone });
    } else {
      user = await User.findOne({ phone: emailOrPhone });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Expired or missing OTP
    if (!user.otp || Date.now() > new Date(user.otpExpiresAt).getTime()) {
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Invalid OTP
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ OTP verified
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
