import db from "../db/index.js";
import { faculties, departments, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// ==================== FACULTIES ====================

// Get All Faculties (Public)
export const getAllFaculties = async (req, res) => {
  try {
    const facultiesList = await db
      .select()
      .from(faculties)
      .orderBy(faculties.name);

    res.json({
      success: true,
      data: facultiesList,
    });
  } catch (error) {
    console.error("Get faculties error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculties",
    });
  }
};

// Get Faculty by ID (Public)
export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;

    const [faculty] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, id))
      .limit(1);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Get departments in this faculty
    const departmentsList = await db
      .select()
      .from(departments)
      .where(eq(departments.facultyId, id))
      .orderBy(departments.name);

    res.json({
      success: true,
      data: {
        ...faculty,
        departments: departmentsList,
      },
    });
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty",
    });
  }
};

// Create Faculty (Admin Only)
export const createFaculty = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    // Check if code already exists
    const [existing] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.code, code))
      .limit(1);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Faculty code already exists",
      });
    }

    const [newFaculty] = await db
      .insert(faculties)
      .values({ name, code, description })
      .returning();

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: newFaculty,
    });
  } catch (error) {
    console.error("Create faculty error:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Faculty with this name or code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating faculty",
    });
  }
};

// Update Faculty (Admin Only)
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    // Check if faculty exists
    const [existing] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code;
    if (description !== undefined) updateData.description = description;
    updateData.updatedAt = new Date();

    const [updatedFaculty] = await db
      .update(faculties)
      .set(updateData)
      .where(eq(faculties.id, id))
      .returning();

    res.json({
      success: true,
      message: "Faculty updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
    console.error("Update faculty error:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Faculty with this name or code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating faculty",
    });
  }
};

// Delete Faculty (Admin Only)
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if faculty exists
    const [faculty] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, id))
      .limit(1);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Check if faculty has departments
    const [department] = await db
      .select()
      .from(departments)
      .where(eq(departments.facultyId, id))
      .limit(1);

    if (department) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete faculty with existing departments",
      });
    }

    await db.delete(faculties).where(eq(faculties.id, id));

    res.json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error("Delete faculty error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting faculty",
    });
  }
};

// ==================== DEPARTMENTS ====================

// Get All Departments (Public)
export const getAllDepartments = async (req, res) => {
  try {
    const { facultyId } = req.query;

    let query = db.select().from(departments);

    if (facultyId) {
      query = query.where(eq(departments.facultyId, facultyId));
    }

    const departmentsList = await query.orderBy(departments.name);

    res.json({
      success: true,
      data: departmentsList,
    });
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
    });
  }
};

// Get Department by ID (Public)
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [department] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id))
      .limit(1);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Get department error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching department",
    });
  }
};

// Create Department (Admin Only)
export const createDepartment = async (req, res) => {
  try {
    const { name, code, facultyId, description } = req.body;

    // Check if faculty exists
    const [faculty] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, facultyId))
      .limit(1);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    const [newDepartment] = await db
      .insert(departments)
      .values({ name, code, facultyId, description })
      .returning();

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (error) {
    console.error("Create department error:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Department with this code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating department",
    });
  }
};

// Update Department (Admin Only)
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, facultyId, description } = req.body;

    // Check if department exists
    const [existing] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // If updating facultyId, check if faculty exists
    if (facultyId) {
      const [faculty] = await db
        .select()
        .from(faculties)
        .where(eq(faculties.id, facultyId))
        .limit(1);

      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code;
    if (facultyId) updateData.facultyId = facultyId;
    if (description !== undefined) updateData.description = description;
    updateData.updatedAt = new Date();

    const [updatedDepartment] = await db
      .update(departments)
      .set(updateData)
      .where(eq(departments.id, id))
      .returning();

    res.json({
      success: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("Update department error:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Department with this code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating department",
    });
  }
};

// Delete Department (Admin Only)
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const [department] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id))
      .limit(1);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await db.delete(departments).where(eq(departments.id, id));

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting department",
    });
  }
};

// ==================== METRICS ====================

// Get overall faculties metrics (Public)
// Returns total number of faculties and total number of departments
export const getFacultiesMetrics = async (req, res) => {
  try {
    const facultiesList = await db.select().from(faculties);
    const departmentsList = await db.select().from(departments);

    const totalFaculties = Array.isArray(facultiesList)
      ? facultiesList.length
      : 0;
    const totalDepartments = Array.isArray(departmentsList)
      ? departmentsList.length
      : 0;

    res.json({
      success: true,
      data: {
        totalFaculties,
        totalDepartments,
      },
    });
  } catch (error) {
    console.error("Get faculties metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculties metrics",
    });
  }
};

// Get metrics for a single faculty (Public)
// Returns number of departments, staff (supervisors) and students for the given faculty id
export const getFacultyMetrics = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure faculty exists
    const [faculty] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, id))
      .limit(1);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Departments count
    const departmentsList = await db
      .select()
      .from(departments)
      .where(eq(departments.facultyId, id));

    // Staff count (users with role supervisor and this faculty)
    const staffList = await db
      .select()
      .from(users)
      .where(eq(users.facultyId, id))
      .where(eq(users.role, "supervisor"));

    // Students count (users with role student and this faculty)
    const studentsList = await db
      .select()
      .from(users)
      .where(eq(users.facultyId, id))
      .where(eq(users.role, "student"));

    res.json({
      success: true,
      data: {
        departments: Array.isArray(departmentsList)
          ? departmentsList.length
          : 0,
        staff: Array.isArray(staffList) ? staffList.length : 0,
        students: Array.isArray(studentsList) ? studentsList.length : 0,
      },
    });
  } catch (error) {
    console.error("Get faculty metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty metrics",
    });
  }
};
