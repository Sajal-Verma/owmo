import User from "../database/usersDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Cloudnary from "../middleweare/Cloudnary.js";



dotenv.config();


export const register = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;

    // Normalize inputs
    if (email) email = email.toLowerCase().trim();
    if (name) name = name.trim();

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    await newUser.save();

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
    console.log(email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "user not find" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
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

    // All text fields sent in body
    const updates = { ...req.body };

    // If single profile pic uploaded (normalize to object)
    if (req.file && req.file.path) {
      updates.pic = [
        {
          url: req.file.path,
          public_id: req.file.filename,
        },
      ];
    }

    // Handle multiple file uploads (gallery, docs, etc.)
    let uploadedLinks = [];
    if (req.files && req.files.length > 0) {
      uploadedLinks = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updates,
        ...(uploadedLinks.length > 0 && {
          $push: { pic: { $each: uploadedLinks } },
        }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "updated successfully",
      user: updatedUser,
      updatedFields: updates,
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

        const request = await User.findById(id);

        if (!request) {
            return res.status(404).json({ message: "data not found" });
        }

        return res.status(200).json({ message: "Request successfully", user: request });

    } catch (error) {
        console.error("Error seeing  request:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};