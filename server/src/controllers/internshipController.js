import db from "../db/index.js";
import { internships } from "../db/schema.js";
import { eq, ilike, and, or, asc, desc } from "drizzle-orm";

// Get All Internships (Public) with pagination/search/sort
export const getAllInternships = async (req, res) => {
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

    const sortColumnMap = {
      title: internships.title,
      code: internships.code,
      duration: internships.duration,
      createdAt: internships.createdAt,
    };

    const sortColumn =
      sortBy && sortColumnMap[sortBy]
        ? sortColumnMap[sortBy]
        : internships.createdAt;

    const orderByClause =
      sortOrder && sortOrder.toLowerCase() === "desc"
        ? desc(sortColumn)
        : asc(sortColumn);

    const filters = [];
    if (search) {
      const searchPattern = `%${search}%`;
      filters.push(
        or(
          ilike(internships.title, searchPattern),
          ilike(internships.code, searchPattern),
          ilike(internships.description, searchPattern),
        ),
      );
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const baseQuery = db.select().from(internships);
    const internshipsQuery = whereClause
      ? baseQuery.where(whereClause)
      : baseQuery;

    const internshipsList = await internshipsQuery
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const totalList = await (whereClause
      ? baseQuery.where(whereClause)
      : baseQuery);

    const total = Array.isArray(totalList) ? totalList.length : 0;

    res.json({
      success: true,
      data: internshipsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get internships error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching internships",
    });
  }
};

// Get Internship by ID (Public)
export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const [internship] = await db
      .select()
      .from(internships)
      .where(eq(internships.id, id))
      .limit(1);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.json({
      success: true,
      data: {
        internship,
        metrics: {
          totalApplications: 0,
          totalAccepted: 0,
          totalRejected: 0,
          totalPending: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get internship error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching internship",
    });
  }
};

// Create Internship (Admin Only)
export const createInternship = async (req, res) => {
  try {
    const { title, code, description, duration } = req.body;

    const [existing] = await db
      .select()
      .from(internships)
      .where(eq(internships.code, code))
      .limit(1);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Internship code already exists",
      });
    }

    const [newInternship] = await db
      .insert(internships)
      .values({ title, code, description, duration })
      .returning();

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      data: newInternship,
    });
  } catch (error) {
    console.error("Create internship error:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Internship with this code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating internship",
    });
  }
};

// Update Internship (Admin Only)
export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, description, duration } = req.body;

    const [existing] = await db
      .select()
      .from(internships)
      .where(eq(internships.id, id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (code) {
      const [existingCode] = await db
        .select()
        .from(internships)
        .where(eq(internships.code, code))
        .limit(1);

      if (existingCode && existingCode.id !== id) {
        return res.status(409).json({
          success: false,
          message: "Internship code already exists",
        });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (code) updateData.code = code;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    updateData.updatedAt = new Date();

    const [updatedInternship] = await db
      .update(internships)
      .set(updateData)
      .where(eq(internships.id, id))
      .returning();

    res.json({
      success: true,
      message: "Internship updated successfully",
      data: updatedInternship,
    });
  } catch (error) {
    console.error("Update internship error:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Internship with this code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating internship",
    });
  }
};

// Delete Internship (Admin Only)
export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db
      .select()
      .from(internships)
      .where(eq(internships.id, id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    await db.delete(internships).where(eq(internships.id, id));

    res.json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    console.error("Delete internship error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting internship",
    });
  }
};
