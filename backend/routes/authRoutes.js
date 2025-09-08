// server/routes/authRoutes.js
import express from 'express';

import { login, signup, changePassword, forgotPassword, resetPassword, getProfile, uploadProfileImage, forgotPasswordLink, sendSignupOtp, verifySignupOtp } from '../controllers/authController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup OTP endpoints
router.post('/send-signup-otp', sendSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);
// Get current user profile

// Get current user profile
router.get('/profile', protect, getProfile);

// Upload profile image
router.post('/upload-image', protect, upload.single('image'), uploadProfileImage);

router.post('/login', login);
router.post('/signup', signup);
router.post('/change-password', protect, changePassword);

// Password reset routes
router.post('/forgot-password', forgotPassword);
// New endpoint for sending password reset link (for Forgot Password page)
router.post('/forgot-password-link', forgotPasswordLink);
router.post('/reset-password', resetPassword);

export default router;
