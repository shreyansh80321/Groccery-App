import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_key_secret_here";

export default async function authMiddleware(req, res, next) {
  // Debug: log incoming authorization header for troubleshooting
  console.log("Auth header received:", req.headers.authorization);
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized-token missing",
    });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid Token";
    res.status(401).json({
      success: false,
      message,
    });
  }
}
