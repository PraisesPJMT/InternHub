import bcrypt from "bcryptjs";
import db from "../db/index.js";
import { users, students, supervisors } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { uploadToR2, deleteFromR2 } from "../utils/storage-va.js";

// Get Current User Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with additional info based on role
    const [userData] = await db
      .select({
        user: users,
        student: students,
        supervisor: supervisors,
      })
      .from(users)
      .leftJoin(students, eq(users.id, students.userId))
      .leftJoin(supervisors, eq(users.id, supervisors.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build response based on role
    const profile = {
      id: userData.user.id,
      email: userData.user.email,
      firstName: userData.user.firstName,
      lastName: userData.user.lastName,
      phone: userData.user.phone,
      role: userData.user.role,
      facultyId: userData.user.facultyId,
      departmentId: userData.user.departmentId,
      profileImage: userData.user.profileImage,
      signature: userData.user.signature,
      isEmailVerified: userData.user.isEmailVerified,
      createdAt: userData.user.createdAt,
    };

    if (userData.user.role === "student" && userData.student) {
      profile.matricNumber = userData.student.matricNumber;
      profile.studentNumber = userData.student.studentNumber;
    }

    if (userData.user.role === "supervisor" && userData.supervisor) {
      profile.isAdmin = userData.supervisor.isAdmin;
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updateData.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
};

// Upload Profile Image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get current user to delete old image
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Upload new image
    const imageUrl = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      "profiles",
    );

    // Delete old image if exists
    if (user.profileImage) {
      await deleteFromR2(user.profileImage);
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        profileImage: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    res.json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile image",
    });
  }
};

// Upload Signature
export const uploadSignature = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get current user to delete old signature
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Upload new signature
    const signatureUrl = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      "signatures",
    );

    // Delete old signature if exists
    if (user.signature) {
      await deleteFromR2(user.signature);
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        signature: signatureUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    res.json({
      success: true,
      message: "Signature updated successfully",
      data: {
        signature: updatedUser.signature,
      },
    });
  } catch (error) {
    console.error("Upload signature error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading signature",
    });
  }
};

// Delete Profile Image
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.profileImage) {
      return res.status(400).json({
        success: false,
        message: "No profile image to delete",
      });
    }

    // Delete from storage
    await deleteFromR2(user.profileImage);

    // Update user
    await db
      .update(users)
      .set({
        profileImage: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting profile image",
    });
  }
};

// Delete Signature
export const deleteSignature = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.signature) {
      return res.status(400).json({
        success: false,
        message: "No signature to delete",
      });
    }

    // Delete from storage
    await deleteFromR2(user.signature);

    // Update user
    await db
      .update(users)
      .set({
        signature: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: "Signature deleted successfully",
    });
  } catch (error) {
    console.error("Delete signature error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting signature",
    });
  }
};
