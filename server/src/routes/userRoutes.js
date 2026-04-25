import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  uploadSignature,
  deleteProfileImage,
  deleteSignature,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, updateProfileSchema, changePasswordSchema } from '../middleware/validation.js';
import { uploadImage, uploadSignature as uploadSig, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile management
router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.put('/change-password', validate(changePasswordSchema), changePassword);

// Profile image
router.post('/profile-image', uploadImage, handleMulterError, uploadProfileImage);
router.delete('/profile-image', deleteProfileImage);

// Signature
router.post('/signature', uploadSig, handleMulterError, uploadSignature);
router.delete('/signature', deleteSignature);

export default router;