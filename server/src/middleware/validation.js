import { z } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      console.log("Request Content: ", req.body);
      schema.parse(req.body);
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const err = JSON.parse(error?.message).map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        console.error("Validation Error", err);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err,
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  matricNumber: z.string().min(5, "Matric number is required"),
  studentNumber: z.string().min(5, "Student number is required"),
  facultyId: z.string().uuid("Invalid faculty ID"),
  departmentId: z.string().uuid("Invalid department ID"),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const createSupervisorSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  facultyId: z.string().uuid("Invalid faculty ID"),
  departmentId: z.string().uuid("Invalid department ID"),
  isAdmin: z.boolean().optional().default(false),
});

export const supervisorOnboardingSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export const createFacultySchema = z.object({
  name: z.string().min(3, "Faculty name must be at least 3 characters"),
  code: z.string().min(2, "Faculty code must be at least 2 characters").max(50),
  description: z.string().optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters"),
  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(50),
  facultyId: z.string().uuid("Invalid faculty ID"),
  description: z.string().optional(),
});
