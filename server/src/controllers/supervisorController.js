import crypto from "crypto";
import db from "../db/index.js";
import { users, supervisors, faculties, departments } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { sendSupervisorOnboardingEmail } from "../utils/email.js";

// Create Supervisor (Admin Only)
export const createSupervisor = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      facultyId,
      departmentId,
      isAdmin,
    } = req.body;

    // Check if email already exists
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

    // Generate onboarding token
    const onboardingToken = crypto.randomBytes(32).toString("hex");
    const onboardingTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (inactive until onboarding is complete)
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        firstName,
        lastName,
        phone,
        role: "supervisor",
        facultyId,
        departmentId,
        isActive: false,
        isEmailVerified: false,
      })
      .returning();

    // Create supervisor record
    await db.insert(supervisors).values({
      userId: newUser.id,
      isAdmin: isAdmin || false,
      onboardingToken,
      onboardingTokenExpiry,
    });

    // Generate onboarding link
    const onboardingLink = `${process.env.FRONTEND_URL}/auth/supervisor-onboarding?tk=${onboardingToken}&email=${email}`;

    // Send onboarding email
    await sendSupervisorOnboardingEmail(email, firstName, onboardingLink);

    res.status(201).json({
      success: true,
      message: "Supervisor created successfully. Onboarding email sent.",
      data: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    console.error("Create supervisor error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating supervisor",
    });
  }
};

// Get All Supervisors (Admin Only)
export const getAllSupervisors = async (req, res) => {
  try {
    const supervisorsList = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        facultyId: users.facultyId,
        departmentId: users.departmentId,
        profileImage: users.profileImage,
        isActive: users.isActive,
        isEmailVerified: users.isEmailVerified,
        isAdmin: supervisors.isAdmin,
        createdAt: users.createdAt,
      })
      .from(users)
      .innerJoin(supervisors, eq(users.id, supervisors.userId))
      .where(eq(users.role, "supervisor"));

    res.json({
      success: true,
      data: supervisorsList,
    });
  } catch (error) {
    console.error("Get supervisors error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching supervisors",
    });
  }
};

/**
 * Get supervisors metrics (Admin Only)
 *
 * Returns an object with counts used by the client side metrics UI.
 * Example response:
 * {
 *   success: true,
 *   data: {
 *     admins: 5,
 *     supervisors: 20
 *   }
 * }
 */
export const getSupervisorsMetrics = async (req, res) => {
  try {
    // Total supervisors (users with role 'supervisor')
    const allSupervisors = await db
      .select({
        id: users.id,
      })
      .from(users)
      .innerJoin(supervisors, eq(users.id, supervisors.userId))
      .where(eq(users.role, "supervisor"));

    const totalSupervisors = Array.isArray(allSupervisors)
      ? allSupervisors.length
      : 0;

    // Total admins among supervisors (supervisors.isAdmin === true)
    const adminSupervisors = await db
      .select({
        id: users.id,
      })
      .from(users)
      .innerJoin(supervisors, eq(users.id, supervisors.userId))
      .where(eq(users.role, "supervisor"))
      .where(eq(supervisors.isAdmin, true));

    const totalAdmins = Array.isArray(adminSupervisors)
      ? adminSupervisors.length
      : 0;

    res.json({
      success: true,
      data: {
        admins: totalAdmins,
        supervisors: totalSupervisors,
      },
    });
  } catch (error) {
    console.error("Get supervisors metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching supervisors metrics",
    });
  }
};

// Get Supervisor by ID (Admin Only)
export const getSupervisorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [supervisor] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        facultyId: users.facultyId,
        departmentId: users.departmentId,
        profileImage: users.profileImage,
        signature: users.signature,
        isActive: users.isActive,
        isEmailVerified: users.isEmailVerified,
        isAdmin: supervisors.isAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(supervisors, eq(users.id, supervisors.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    const [department] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, supervisor.departmentId))
      .limit(1);

    const [faculty] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, supervisor.facultyId))
      .limit(1);

    res.json({
      success: true,
      data: {
        ...supervisor,
        department: department?.name,
        faculty: faculty?.name,
      },
    });
  } catch (error) {
    console.error("Get supervisor error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching supervisor",
    });
  }
};

// Update Supervisor (Admin Only)
export const updateSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      facultyId,
      departmentId,
      isAdmin,
      isActive,
    } = req.body;

    // Check if supervisor exists
    const [existingSupervisor] = await db
      .select()
      .from(supervisors)
      .where(eq(supervisors.userId, id))
      .limit(1);

    if (!existingSupervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Update user fields
    const userUpdateData = {};
    if (firstName) userUpdateData.firstName = firstName;
    if (lastName) userUpdateData.lastName = lastName;
    if (phone !== undefined) userUpdateData.phone = phone;
    if (facultyId) userUpdateData.facultyId = facultyId;
    if (departmentId) userUpdateData.departmentId = departmentId;
    if (isActive !== undefined) userUpdateData.isActive = isActive;

    if (Object.keys(userUpdateData).length > 0) {
      userUpdateData.updatedAt = new Date();
      await db.update(users).set(userUpdateData).where(eq(users.id, id));
    }

    // Update supervisor fields
    if (isAdmin !== undefined) {
      await db
        .update(supervisors)
        .set({
          isAdmin,
          updatedAt: new Date(),
        })
        .where(eq(supervisors.userId, id));
    }

    res.json({
      success: true,
      message: "Supervisor updated successfully",
    });
  } catch (error) {
    console.error("Update supervisor error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating supervisor",
    });
  }
};

// Delete Supervisor (Admin Only)
export const deleteSupervisor = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Check if supervisor exists
    const [supervisor] = await db
      .select()
      .from(supervisors)
      .where(eq(supervisors.userId, id))
      .limit(1);

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Delete user (cascades to supervisor)
    await db.delete(users).where(eq(users.id, id));

    res.json({
      success: true,
      message: "Supervisor deleted successfully",
    });
  } catch (error) {
    console.error("Delete supervisor error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting supervisor",
    });
  }
};

// Resend Onboarding Email (Admin Only)
export const resendOnboardingEmail = async (req, res) => {
  try {
    const { id } = req.params;

    // Get supervisor
    const [supervisorData] = await db
      .select({
        user: users,
        supervisor: supervisors,
      })
      .from(users)
      .innerJoin(supervisors, eq(users.id, supervisors.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (!supervisorData) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Check if already onboarded
    if (supervisorData.user.isActive && supervisorData.user.password) {
      return res.status(400).json({
        success: false,
        message: "Supervisor has already completed onboarding",
      });
    }

    // Generate new token if expired or doesn't exist
    let token = supervisorData.supervisor.onboardingToken;
    const tokenExpiry = supervisorData.supervisor.onboardingTokenExpiry;

    if (!token || !tokenExpiry || new Date(tokenExpiry) < new Date()) {
      token = crypto.randomBytes(32).toString("hex");
      const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await db
        .update(supervisors)
        .set({
          onboardingToken: token,
          onboardingTokenExpiry: newExpiry,
        })
        .where(eq(supervisors.id, supervisorData.supervisor.id));
    }

    // Generate onboarding link
    const onboardingLink = `${process.env.FRONTEND_URL}/onboarding/supervisor?token=${token}`;

    // Send email
    await sendSupervisorOnboardingEmail(
      supervisorData.user.email,
      supervisorData.user.firstName,
      onboardingLink,
    );

    res.json({
      success: true,
      message: "Onboarding email sent successfully",
    });
  } catch (error) {
    console.error("Resend onboarding error:", error);
    res.status(500).json({
      success: false,
      message: "Error resending onboarding email",
    });
  }
};
