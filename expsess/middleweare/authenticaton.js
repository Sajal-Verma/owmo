import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken; // Read from cookies

    if (!token) {
        return res.status(401).json({ message: "Access token not found in cookies" });
    }

    try {
        const decoded = jwt.verify(token, process.env.accessKey); // Use accessKey here
        req.user = decoded;  // User info (id, role, etc.)
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired access token" });
    }
};

export default authMiddleware;
