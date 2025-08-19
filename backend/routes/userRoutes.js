// server/routes/userRoutes.js
import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isSuperAdmin } from '../middleware/roleMiddleware.js'; // 🛡️ Ensure this is a separate middleware

const router = express.Router();

// ✅ Only SuperAdmin and Admin can view all users
import roleMiddleware from '../middleware/roleMiddleware.js';
router.get('/', protect, roleMiddleware(['SuperAdmin', 'Admin']), getUsers);

// ✅ Only SuperAdmin can assign roles
router.put('/:id/role', protect, isSuperAdmin, updateUserRole);

export default router;
