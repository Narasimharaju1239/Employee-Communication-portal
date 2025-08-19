import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // Debug: log the Authorization header
  console.log('Authorization header:', req.headers.authorization);
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log('No token found in Authorization header');
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Use decoded.userId instead of decoded.id
    req.user = await User.findById(decoded.userId).select("-password");
    console.log('Token valid, user:', req.user?.email || req.user?._id);
    next();
  } catch (err) {
    console.log('Invalid token:', err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
