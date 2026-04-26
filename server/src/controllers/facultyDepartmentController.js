import db from "../db/index.js";
import { faculties, departments, users } from "../db/schema.js";
import { eq, ilike, and, or, asc, desc, sql } from "drizzle-orm";

// ==================== FACULTIES ====================

// Get All Faculties (Public)
export const getAllFaculties = async (req, res) => {
  try {
    const pageNumber = Number.parseInt(req.query.page, 10);
    const limitNumber = Number.parseInt(req.query.limit, 10);
    const page = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
    const limit =
      Number.isNaN(limitNumber) || limitNumber < 1
        ? 10
        : Math.min(limitNumber, 100);
    const offset = (page - 1) * limit;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy.trim() : "";
    const sortOrder =
      typeof req.query.sortOrder === "string" ? req.query.sortOrder.trim() : "";
    const departmentsCount = sql`count(${departments.id})`.as(
      "departmentsCount",
    );
    const sortColumnMap = {
      name: faculties.name,
      code: faculties.code,
      createdAt: faculties.createdAt,
      departmentsCount,
    };
    const sortColumn =
      sortBy && sortColumnMap[sortBy]
        ? sortColumnMap[sortBy]
        : faculties.createdAt;
    const orderByClause =
      sortOrder && sortOrder.toLowerCase() === "desc"
        ? desc(sortColumn)
        : asc(sortColumn);

    const filters = [];
    if (search) {
      const searchPattern = `%${search}%`;
      filters.push(
        or(
          ilike(faculties.name, searchPattern),
          ilike(faculties.code, searchPattern),
          ilike(faculties.description, searchPattern),
        ),
      );
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const baseQuery = db
      .select({
        id: faculties.id,
        name: faculties.name,
        code: faculties.code,
        description: faculties.description,
        createdAt: faculties.createdAt,
        updatedAt: faculties.updatedAt,
        departmentsCount,
      })
      .from(faculties)
      .leftJoin(departments, eq(departments.facultyId, faculties.id))
      .groupBy(faculties.id);
    const facultiesQuery = whereClause
      ? baseQuery.where(whereClause)
      : baseQuery;

    const facultiesList = await facultiesQuery
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const totalQuery = db.select().from(faculties);
    const totalList = await (whereClause
      ? totalQuery.where(whereClause)
      : totalQuery);

    const total = Array.isArray(totalList) ? totalList.length : 0;

    res.json({
      success: true,
      data: facultiesList,
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
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

// Get Departments by Faculty ID (Public)
export const getDepartmentsByFacultyId = async (req, res) => {
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

    const pageNumber = Number.parseInt(req.query.page, 10);
    const limitNumber = Number.parseInt(req.query.limit, 10);
    const page = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
    const limit =
      Number.isNaN(limitNumber) || limitNumber < 1
        ? 10
        : Math.min(limitNumber, 100);
    const offset = (page - 1) * limit;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy.trim() : "";
    const sortOrder =
      typeof req.query.sortOrder === "string" ? req.query.sortOrder.trim() : "";
    const sortColumnMap = {
      name: departments.name,
      code: departments.code,
      createdAt: departments.createdAt,
    };
    const sortColumn =
      sortBy && sortColumnMap[sortBy]
        ? sortColumnMap[sortBy]
        : departments.name;
    const orderByClause =
      sortOrder && sortOrder.toLowerCase() === "desc"
        ? desc(sortColumn)
        : asc(sortColumn);

    const filters = [eq(departments.facultyId, id)];

    if (search) {
      const searchPattern = `%${search}%`;
      filters.push(
        or(
          ilike(departments.name, searchPattern),
          ilike(departments.code, searchPattern),
          ilike(departments.description, searchPattern),
        ),
      );
    }

    const whereClause = and(...filters);

    const departmentsList = await db
      .select()
      .from(departments)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const totalList = await db.select().from(departments).where(whereClause);

    const total = Array.isArray(totalList) ? totalList.length : 0;

    res.json({
      success: true,
      data: departmentsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get departments by faculty error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
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
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy.trim() : "";
    const sortOrder =
      typeof req.query.sortOrder === "string" ? req.query.sortOrder.trim() : "";
    const sortColumnMap = {
      name: departments.name,
      code: departments.code,
      createdAt: departments.createdAt,
    };
    const sortColumn =
      sortBy && sortColumnMap[sortBy]
        ? sortColumnMap[sortBy]
        : departments.name;
    const orderByClause =
      sortOrder && sortOrder.toLowerCase() === "desc"
        ? desc(sortColumn)
        : asc(sortColumn);

    let query = db.select().from(departments);

    if (facultyId) {
      query = query.where(eq(departments.facultyId, facultyId));
    }

    const departmentsList = await query.orderBy(orderByClause);

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

    const staffList = await db
      .select()
      .from(users)
      .where(and(eq(users.departmentId, id), eq(users.role, "supervisor")));

    const studentsList = await db
      .select()
      .from(users)
      .where(and(eq(users.departmentId, id), eq(users.role, "student")));

    res.json({
      success: true,
      data: {
        ...department,
        staffCount: Array.isArray(staffList) ? staffList.length : 0,
        studentCount: Array.isArray(studentsList) ? studentsList.length : 0,
      },
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
