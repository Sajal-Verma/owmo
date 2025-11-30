import User from "../database/usersDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Cloudnary from "../middleweare/Cloudnary.js";
import { sendEmail } from "./Otp.js";
import { LookupRequestWithCorId } from "twilio/lib/rest/lookups/v2/query.js";



dotenv.config();


export const register = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;

    // Normalize inputs
    email = email?.toLowerCase().trim();
    name = name?.trim();

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    await newUser.save();

    // ================= EMAIL TEMPLATE ==================
    const mess = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
        <h2 style="color: #0a84ff;">Welcome to OWMO!</h2>

        <p>Dear ${newUser.name},</p>

        <p>
          Your account has been successfully created in the <b>OWMO Smart Mobile Repairing System</b>.
          You can now log in and start using the platform.
        </p>

        <p><b>Your Login Details:</b></p>
        <ul>
          <li><b>Email:</b> ${newUser.email}</li>
          <li><b>Role:</b> ${newUser.role}</li>
        </ul>

        <br>

        <a href="https://your-owmo-login-url.com"
          style="display: inline-block; padding: 10px 18px; 
                 background: #0a84ff; color: #fff; 
                 text-decoration: none; border-radius: 6px;">
          Login to Your Account
        </a>

        <br><br>

        <p>Thank you for joining OWMO!<br><b>– OWMO Support Team</b></p>

        <hr style="margin-top: 26px; border-top: 1px solid #ddd;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `;

    // Send welcome email
    await sendEmail(newUser.email, "Your OWMO Account Has Been Created", mess);

    // ================= TECHNICIAN EXTRA EMAIL ==================
    if (newUser.role === "technician") {
      const technicianMsg = `
        <div style="font-family: Arial; padding: 20px; color: #444;">
          <h2 style="color:#0a84ff;">Technician Onboarding</h2>

          <p>Hello ${newUser.name},</p>

          <p>Your account has been created as a <b>Technician</b>.
          Your profile is now under verification by the Admin.</p>

          <p>You will be able to log in once all hiring steps are completed.</p>

          <br>

          <p>Regards,<br><b>OWMO Support Team</b></p>
        </div>
      `;

      await sendEmail(newUser.email, "Technician Verification In Progress", technicianMsg);
    }

    // ============================================================

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};








//login section
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    //console.log(user);
    if (!user) {
      return res.status(401).json({ message: "user not find" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWTs
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.refreshKey,
      { expiresIn: "1d" }
    );

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.accessKey,
      { expiresIn: "5m" }
    );

    // Send tokens as HttpOnly cookies
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None", // allow React frontend to receive cookies
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 5 * 60 * 1000, // 5 minutes
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          role: user.role,
          hired: user.hired,
          pass: user.pass,
          name: user.name,
        },
      });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};






//updata the data of role based access

export const update = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };
    //console.log(update);

    // define uploadedLinks at top
    let uploadedLinks = [];

    // Single file upload (profile pic)
    if (req.file && req.file.path) {
      updates.pic = [
        {
          url: req.file.path,
          public_id: req.file.filename,
        },
      ];
    }

    // Multiple files
    if (req.files && req.files.length > 0) {
      uploadedLinks = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // Simplified logic
    const updateData = { $set: updates };

    if (uploadedLinks.length > 0) {
      updateData.$push = { pic: { $each: uploadedLinks } };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};









//
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};





export const del = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    const deletedUser = user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all images from Cloudinary if any
    if (Array.isArray(user.pic) && user.pic.length > 0) {
      for (const img of user.pic) {
        if (img && img.public_id) {
          try {
            const result = await Cloudnary.uploader.destroy(img.public_id);
            console.log("Image deleted:", result);
          } catch (cloudErr) {
            console.error(`Error deleting image ${img.public_id}:`, cloudErr);
          }
        }
      }
    }

    
    const mess = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
    <h2 style="color: #ff3b30;">OWMO Account Update</h2>
    
    <p>Dear ${deletedUser.name},</p>

    <p>
      We want to inform you that your account on the 
      <b>OWMO Smart Mobile Repairing System</b> has been 
      <span style="color: #ff3b30; font-weight: bold;">deleted by the administrator</span>.
      </p>
      
    <p>
      If you believe this action was taken in error or need more information,  
      please contact our support team.
      </p>

    <br>

    <a href="https://your-owmo-support-url.com"
    style="display: inline-block; padding: 10px 18px; 
    background: #ff3b30; color: #fff; 
    text-decoration: none; border-radius: 6px;">
    Contact Support
    </a>
    
    <br><br>
    
    <p>Thank you for your understanding.<br><b>– OWMO Support Team</b></p>
    
    <hr style="margin-top: 26px; border-top: 1px solid #ddd;" />
    
    <p style="font-size: 12px; color: #777;">
    This is an automated email. Please do not reply.
    </p>
    </div>
    `;
    
    
    await sendEmail(deletedUser.email, "Your OWMO Account Has Been Deleted", mess);
    
    // Delete user document from DB
    await user.deleteOne();
    
    return res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};




export const see = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const request = await User.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Data not found" });
    }

    let newData = {};

    // Convert Mongoose document to plain JS object
    const userObj = request.toObject();

    if (request.role === "user" || request.role === "admin") {
      // Select only limited fields
      const { name, email, phone, address, zip, DOB, pic ,role } = userObj;
      newData = { name, email, phone, address, zip, DOB, pic ,role };
    } else {
      // Select extended fields
      const {
        name,
        email,
        phone,
        address,
        zip,
        DOB,
        pic,
        role, 
        shop,
        shopName,
        qualificationName,
        hired,
        pass,
        experience,
        rating,
        prize,
      } = userObj;

      newData = {
        name,
        email,
        phone,
        address,
        zip,
        DOB,
        pic,
        role, 
        shop,
        shopName,
        qualificationName,
        hired,
        pass,
        experience,
        rating,
        prize,
      };
    }
    //console.log(newData);

    return res
      .status(200)
      .json({ message: "Request successful", user: newData });
  } catch (error) {
    console.error("Error seeing request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};



//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Check whether it's email or phone
    let user;
    if (emailOrPhone.includes("@")) {
      user = await User.findOne({ email: emailOrPhone });
    } else {
      user = await User.findOne({ phone: emailOrPhone });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get technicians by ZIP code
export const ZipTech = async (req, res) => {
  try {
    const { pincode } = req.query; // ✅ read from query, not body

    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required" });
    }

    const users = await User.find({ zip: pincode, role: "technician" })
      .select("name address zip DOB pic prize shopName experience");

    if (!users.length) {
      return res.status(404).json({ message: "No technicians found for this ZIP code" });
    }

    res.status(200).json({ message: "Request successful", users });
  } catch (error) {
    console.error("Error fetching technician by ZIP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Show all users to admin
export const showAll = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    //console.log("Role received:", role);

    const admin = await User.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const query = {};
    if (role) query.role = role;

    const selectedFields = {
      name: 1,
      phone: 1,
      email: 1,
      address: 1,
      ...(role !== "user" && { hired: 1 })
    };

    const allUsers = await User.find(query, selectedFields);

    return res.status(200).json({
      message: "All users fetched successfully",
      users: allUsers,
    });

  } catch (error) {
    console.error("Error in showAll:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
