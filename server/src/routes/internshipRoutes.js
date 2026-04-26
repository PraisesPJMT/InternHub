import express from "express";
import {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/internships", getAllInternships);
router.get("/internships/:id", getInternshipById);

// Admin-only routes
router.post("/internships", authenticate, requireAdmin, createInternship);
router.put("/internships/:id", authenticate, requireAdmin, updateInternship);
router.delete("/internships/:id", authenticate, requireAdmin, deleteInternship);

export default router;
