import express from "express";
import {
  createSupervisor,
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
  resendOnboardingEmail,
  getSupervisorsMetrics,
} from "../controllers/supervisorController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate, createSupervisorSchema } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Supervisor management
router.post("/", validate(createSupervisorSchema), createSupervisor);
router.get("/", getAllSupervisors);
// Metrics
router.get("/metrics", getSupervisorsMetrics);
router.get("/:id", getSupervisorById);
router.put("/:id", updateSupervisor);
router.delete("/:id", deleteSupervisor);

// Resend onboarding email
router.post("/:id/resend-onboarding", resendOnboardingEmail);

export default router;
