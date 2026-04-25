import { verifyAccessToken } from "../utils/jwt.js";
import db from "../db/index.js";
import { users, supervisors } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER RECEIVED: ", authHeader);

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1]; // Cleaner than substring(7)
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Check if supervisor is admin
    const [supervisor] = await db
      .select()
      .from(supervisors)
      .where(eq(supervisors.userId, req.user.id))
      .limit(1);

    if (!supervisor || !supervisor.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.supervisor = supervisor;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying admin status",
    });
  }
};
