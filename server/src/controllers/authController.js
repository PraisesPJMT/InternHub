import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../db/index.js";
import {
  users,
  students,
  supervisors,
  refreshTokens,
  otps,
} from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import {
  sendWelcomeEmail,
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  sendSupervisorOnboardingEmail,
} from "../utils/email.js";

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper: Get OTP expiry time
const getOTPExpiry = () => {
  const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Student Signup
export const studentSignup = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      matricNumber,
      studentNumber,
      facultyId,
      departmentId,
    } = req.body;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: "student",
        facultyId,
        departmentId,
        isActive: true,
        isEmailVerified: false,
      })
      .returning();

    // Create student record
    await db.insert(students).values({
      userId: newUser.id,
      matricNumber,
      studentNumber,
    });

    // Generate OTP for email verification
    const otp = generateOTP();
    await db.insert(otps).values({
      email,
      otp,
      type: "email_verification",
      expiresAt: getOTPExpiry(),
    });

    // Send OTP email
    await sendOTPEmail(email, otp, "verification");

    // Generate tokens
    const tokens = generateTokenPair({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Save refresh token
    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        tokens,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating account",
    });
  }
};

// Sign In
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact support.",
      });
    }

    const responseUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      phone: user.phone,
      facultyId: user.facultyId,
      departmentId: user.departmentId,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    // Check if user is admin
    if (user.role === "supervisor") {
      const [supervisor] = await db
        .select()
        .from(supervisors)
        .where(eq(supervisors.userId, user.id))
        .limit(1);

      responseUser.isAdmin = supervisor.isAdmin || false;
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      message: "Signed in successfully",
      data: {
        user: {
          ...responseUser,
        },
        tokens,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Error signing in",
    });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify token
    const decoded = verifyRefreshToken(token);

    // Check if token exists in database
    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, token),
          eq(refreshTokens.userId, decoded.userId),
          gt(refreshTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    // Update refresh token
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));

    await db.insert(refreshTokens).values({
      userId: decoded.userId,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      data: { tokens },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// Forgot Password - Step 1: Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete old OTPs for this email and type
    await db
      .delete(otps)
      .where(and(eq(otps.email, email), eq(otps.type, "password_reset")));

    // Save new OTP
    await db.insert(otps).values({
      email,
      otp,
      type: "password_reset",
      expiresAt: getOTPExpiry(),
    });

    // Send OTP email
    await sendOTPEmail(email, otp, "password_reset");

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing request",
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find valid OTP
    const [otpRecord] = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.email, email),
          eq(otps.otp, otp),
          eq(otps.used, false),
          gt(otps.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

// Reset Password - Step 3: Set new password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const [otpRecord] = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.email, email),
          eq(otps.otp, otp),
          eq(otps.used, false),
          gt(otps.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Mark OTP as used
    await db.update(otps).set({ used: true }).where(eq(otps.id, otpRecord.id));

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));

    // Delete all refresh tokens for this user
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));

    // Send success email
    await sendPasswordResetSuccessEmail(email, user.firstName);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

// Supervisor Onboarding
export const supervisorOnboarding = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find supervisor with valid token
    const [supervisor] = await db
      .select({
        supervisor: supervisors,
        user: users,
      })
      .from(supervisors)
      .innerJoin(users, eq(supervisors.userId, users.id))
      .where(
        and(
          eq(supervisors.onboardingToken, token),
          gt(supervisors.onboardingTokenExpiry, new Date()),
        ),
      )
      .limit(1);

    if (!supervisor) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired onboarding link",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await db
      .update(users)
      .set({
        password: hashedPassword,
        isActive: true,
        isEmailVerified: true,
      })
      .where(eq(users.id, supervisor.user.id));

    // Clear onboarding token
    await db
      .update(supervisors)
      .set({
        onboardingToken: null,
        onboardingTokenExpiry: null,
      })
      .where(eq(supervisors.id, supervisor.supervisor.id));

    // Send welcome email
    await sendWelcomeEmail(supervisor.user.email, supervisor.user.firstName);

    res.json({
      success: true,
      message: "Account setup completed successfully",
    });
  } catch (error) {
    console.error("Supervisor onboarding error:", error);
    res.status(500).json({
      success: false,
      message: "Error completing account setup",
    });
  }
};
