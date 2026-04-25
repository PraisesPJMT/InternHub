import express from 'express';
import {
  studentSignup,
  signin,
  refreshToken,
  forgotPassword,
  verifyOTP,
  resetPassword,
  logout,
  supervisorOnboarding,
} from '../controllers/authController.js';
import {
  validate,
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  supervisorOnboardingSchema,
} from '../middleware/validation.js';

const router = express.Router();

// Student signup
router.post('/signup/student', validate(signupSchema), studentSignup);

// Signin
router.post('/signin', validate(signinSchema), signin);

// Refresh token
router.post('/refresh-token', refreshToken);

// Forgot password flow
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Logout
router.post('/logout', logout);

// Supervisor onboarding
router.post('/onboarding/supervisor', validate(supervisorOnboardingSchema), supervisorOnboarding);

export default router;