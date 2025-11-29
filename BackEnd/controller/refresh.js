import jwt from "jsonwebtoken";


//ok ok ok ok ok ok ------------------------------------------------------------------------------------------------------------
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.refreshKey);

    // Generate new short-lived access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.accessKey,
      { expiresIn: "5m" }
    );

    // Cookie options (dev vs prod)
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 5 * 60 * 1000, // 5 minutes
    };

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("❌ Refresh error:", err.message);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

