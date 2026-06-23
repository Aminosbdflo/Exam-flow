import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUserProfile, getUserResults, getAllUsers, getSystemStats, deleteUser, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getUserProfile);
router.get('/me/results', protect, getUserResults);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.get('/stats', protect, admin, getSystemStats);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
