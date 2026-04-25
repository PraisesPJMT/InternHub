import express from "express";
import {
  getAllFaculties,
  getFacultyById,
  getFacultiesMetrics,
  getFacultyMetrics,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/facultyDepartmentController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  validate,
  createFacultySchema,
  createDepartmentSchema,
} from "../middleware/validation.js";

const router = express.Router();

// ==================== FACULTIES ====================
// Public routes
// Metrics endpoints - placed before the `:id` route so the literal 'metrics' path isn't captured as an id
router.get("/faculties/metrics", getFacultiesMetrics);
router.get("/faculties/:id/metrics", getFacultyMetrics);
router.get("/faculties", getAllFaculties);
router.get("/faculties/:id", getFacultyById);

// Admin-only routes
router.post(
  "/faculties",
  authenticate,
  requireAdmin,
  validate(createFacultySchema),
  createFaculty,
);
router.put(
  "/faculties/:id",
  authenticate,
  requireAdmin,
  validate(createFacultySchema),
  updateFaculty,
);
router.delete("/faculties/:id", authenticate, requireAdmin, deleteFaculty);

// ==================== DEPARTMENTS ====================
// Public routes
router.get("/departments", getAllDepartments);
router.get("/departments/:id", getDepartmentById);

// Admin-only routes
router.post(
  "/departments",
  authenticate,
  requireAdmin,
  validate(createDepartmentSchema),
  createDepartment,
);
router.put(
  "/departments/:id",
  authenticate,
  requireAdmin,
  validate(createDepartmentSchema),
  updateDepartment,
);
router.delete("/departments/:id", authenticate, requireAdmin, deleteDepartment);

export default router;
